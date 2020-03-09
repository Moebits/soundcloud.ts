import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as stream from "stream"
import api from "../API"
import {SoundCloudTrack} from "../types"
import {Playlists, Tracks, Users} from "./index"

export class Util {
    private readonly playlists = new Playlists(this.api)
    private readonly users = new Users(this.api)
    private readonly tracks = new Tracks(this.api)
    constructor(private readonly api: api) {}

    /**
     * Utility for awaiting a stream.Writable
     */
    public awaitStream = async (writeStream: stream.Writable) => {
        return new Promise((resolve, reject) => {
            writeStream.on("finish", resolve)
            writeStream.on("error", reject)
        })
    }

    /**
     * Downloads the stream of a track. Note: Requires ffmpeg because of the dependency on audioconcat.
     */
    public downloadTrackStream = async (songUrl: string, title: string, folder: string) => {
        if (title.endsWith(".mp3")) title = title.replace(".mp3", "")
        const headers = {
            "referer": "soundcloud.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
        }
        const html = await axios.get(songUrl, {headers})
        const match = html.data.match(/(?<="transcodings":\[{"url":")(.*?)(?=")/)?.[0]
        let url: string
        if (match) {
            url = await axios.get(match + `?client_id=${this.api.clientID}`, {headers}).then((r) => r.data.url)
        } else {
            return null
        }
        const result = await axios.get(url, {headers}).then((d) => d.data)
        const streamUrls = result.match(/(https:\/\/cf-hls-media.sndcdn.com)((.|\n)*?)(?=#)/gm)
        if (!fs.existsSync(folder)) fs.mkdirSync(folder)
        const src = path.join(folder, "concat")
        if (!fs.existsSync(src)) fs.mkdirSync(src)
        const chunkList: string[] = []
        for (let i = 0; i < streamUrls.length; i++) {
            const chunkPath = `${title}${i}.mp3`
            const dest = path.join(src, chunkPath)
            const res = await axios.get(streamUrls[i], {responseType: "arraybuffer"})
            fs.writeFileSync(dest, Buffer.from(res.data, "binary"))
            chunkList.push(dest)
        }
        const audioconcat = require("audioconcat")
        const finalMP3 = path.join(folder, `${title}.mp3`)
        await new Promise((resolve) => {
            audioconcat(chunkList).concat(finalMP3)
            .on("end", () => {
                resolve()
            })
        })
        this.removeDirectory(src)
        return finalMP3
    }

    public downloadTrack = async (trackResolvable: string | number | SoundCloudTrack, folder?: string) => {
        let track: SoundCloudTrack
        if (trackResolvable.hasOwnProperty("downloadable")) {
            track = trackResolvable as SoundCloudTrack
        } else {
            track = await this.tracks.get(String(trackResolvable))
        }
        if (!folder) folder = "./"
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        if (track.downloadable === true) {
            const result = await axios.get(track.download_url, {responseType: "arraybuffer", params: {client_id: this.api.clientID}})
            const dest = path.join(folder, `${track.title}.${result.headers["x-amz-meta-file-type"]}`)
            fs.writeFileSync(dest, Buffer.from(result.data, "binary"))
            return dest
        } else {
            return this.downloadTrackStream(track.permalink_url, track.title, folder)
        }
    }

    public downloadTracks = async (tracks: SoundCloudTrack[], dest?: string, limit?: number) => {
        if (!limit) limit = tracks.length
        const resultArray: string[] = []
        for (let i = 0; i < limit; i++) {
            try {
                const result = await this.downloadTrack(tracks[i], dest)
                resultArray.push(result)
            } catch {
                continue
            }
        }
        return resultArray
    }

    public downloadSearch = async (query: string, dest?: string, limit?: number) => {
        const tracks = await this.tracks.search({q: query})
        return this.downloadTracks(tracks, dest, limit)
    }

    public downloadFavorites = async (userResolvable: string | number, dest?: string, limit?: number) => {
        const tracks = await this.users.favorites(userResolvable)
        return this.downloadTracks(tracks, dest, limit)
    }

    public downloadPlaylist = async (playlistResolvable: string | number, dest?: string, limit?: number) => {
        const playlist = await this.playlists.get(playlistResolvable)
        return this.downloadTracks(playlist.tracks, dest, limit)
    }

    public streamTrack = async (trackResolvable: string | number | SoundCloudTrack, folder?: string) => {
        let track: SoundCloudTrack
        if (trackResolvable.hasOwnProperty("downloadable")) {
            track = trackResolvable as SoundCloudTrack
        } else {
            track = await this.tracks.get(String(trackResolvable))
        }
        if (!folder) folder = "./"
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        if (track.downloadable === true) {
            const result = await axios.get(track.download_url, {responseType: "arraybuffer", params: {client_id: this.api.clientID, oauth_token: this.api.oauthToken}})
            const dest = path.join(folder, `${track.title}.${result.headers["x-amz-meta-file-type"]}`)
            fs.writeFileSync(dest, Buffer.from(result.data, "binary"))
            return fs.createReadStream(dest)
        } else {
            const dest = await this.downloadTrackStream(track.permalink_url, track.title, folder)
            return fs.createReadStream(dest)
        }
    }

    // Remove directory recursively
    private removeDirectory(dir: string) {
        if (dir === "/" || dir === "./") return
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(function(entry) {
                const entryPath = path.join(dir, entry)
                if (fs.lstatSync(entryPath).isDirectory()) {
                    this.removeDirectory(entryPath)
                } else {
                    fs.unlinkSync(entryPath)
                }
            })
            try {
                fs.rmdirSync(dir)
            } catch (e) {
                console.log(e)
            }
        }
    }
}
