import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as stream from "stream"
import api from "../API"
import {SoundcloudTrack, SoundcloudTrackV2} from "../types"
import {Playlists, Tracks, Users} from "./index"

export class Util {
    private readonly playlists = new Playlists(this.api)
    private readonly users = new Users(this.api)
    private readonly tracks = new Tracks(this.api)
    constructor(private readonly api: api) {}

    /**
     * Downloads the mp3 stream of a track.
     */
    public downloadTrackStream = async (songUrl: string, title: string, folder: string) => {
        if (title.endsWith(".mp3")) title = title.replace(".mp3", "")
        const headers = {
            "referer": "soundcloud.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
        }
        const html = await axios.get(songUrl, {headers})
        // const match = html.data.match(/(?<="transcodings":\[{"url":")(.*?)(?=")/)?.[0]
        const match = html.data.match(/(?<=,{"url":")(.*?)(progressive)/)?.[0]
        let url: string
        const connect = match.includes("secret_token") ? `&client_id=${this.api.clientID}` : `?client_id=${this.api.clientID}`
        if (match) {
            url = await axios.get(match + connect, {headers}).then((r) => r.data.url)
            .catch(() => {
                return Promise.reject("client id expired")
            })
        } else {
            return null
        }
        /*const result = await axios.get(url, {headers}).then((r) => r.data)
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
        this.removeDirectory(src)*/
        const finalMP3 = path.join(folder, `${title}.mp3`)
        const binary = await axios.get(url, {headers, responseType: "arraybuffer"}).then((r) => r.data)
        fs.writeFileSync(finalMP3, Buffer.from(binary, "binary"))
        return finalMP3
    }

    /**
     * Gets a track title from the page
     */
    public getTitle = async (songUrl: string) => {
        const headers = {
            "referer": "soundcloud.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
        }
        const html = await axios.get(songUrl, {headers}).then((r) => r.data)
        const title = html.match(/(?<="og:title" content=")(.*?)(?=")/)?.[0]?.replace(/\//g, "")
        return title
    }

    /**
     * Downloads a track on Soundcloud.
     */
    public downloadTrack = async (trackResolvable: string | SoundcloudTrack | SoundcloudTrackV2, folder?: string) => {
        if (!folder) folder = "./"
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        let track: SoundcloudTrack
        if (trackResolvable.hasOwnProperty("downloadable")) {
            track = trackResolvable as SoundcloudTrack
            if (track.downloadable === true) {
                const result = await axios.get(track.download_url, {responseType: "arraybuffer", params: {client_id: this.api.clientID}})
                const dest = path.join(folder, `${track.title.replace(/\//g, "")}.${result.headers["x-amz-meta-file-type"]}`)
                fs.writeFileSync(dest, Buffer.from(result.data, "binary"))
                return dest
            } else {
                return this.downloadTrackStream(track.permalink_url, track.title.replace(/\//g, ""), folder)
            }
        } else {
            const url = trackResolvable as string
            const title = await this.getTitle(url)
            return this.downloadTrackStream(url, title, folder)
        }
    }

    /**
     * Downloads an array of tracks.
     */
    public downloadTracks = async (tracks: SoundcloudTrack[] | SoundcloudTrackV2[] | string[], dest?: string, limit?: number) => {
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

    /**
     * Downloads all the tracks from the search query.
     */
    public downloadSearch = async (query: string, dest?: string, limit?: number) => {
        const tracks = await this.tracks.searchV2({q: query})
        return this.downloadTracks(tracks.collection, dest, limit)
    }

    /**
     * @deprecated
     * Downloads all of a users favorites.
     */
    public downloadFavorites = async (userResolvable: string | number, dest?: string, limit?: number) => {
        const tracks = await this.users.favorites(userResolvable)
        return this.downloadTracks(tracks, dest, limit)
    }

    /**
     * Downloads all the tracks in a playlist.
     */
    public downloadPlaylist = async (playlistResolvable: string | number, dest?: string, limit?: number) => {
        const playlist = await this.playlists.get(playlistResolvable)
        return this.downloadTracks(playlist.tracks, dest, limit)
    }

    /**
     * Same as downloadTrack, but it returns a readable stream.
     */
    public streamTrack = async (trackResolvable: string | SoundcloudTrack, folder?: string) => {
        if (!folder) folder = "./"
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        let track: SoundcloudTrack
        if (trackResolvable.hasOwnProperty("downloadable")) {
            track = trackResolvable as SoundcloudTrack
            if (track.downloadable === true) {
                const result = await axios.get(track.download_url, {responseType: "arraybuffer", params: {client_id: this.api.clientID, oauth_token: this.api.oauthToken}})
                const dest = path.join(folder, `${track.title.replace(/\//g, "")}.${result.headers["x-amz-meta-file-type"]}`)
                fs.writeFileSync(dest, Buffer.from(result.data, "binary"))
                return fs.createReadStream(dest)
            } else {
                const dest = await this.downloadTrackStream(track.permalink_url, track.title.replace(/\//g, ""), folder)
                return fs.createReadStream(dest)
            }
        } else {
            const url = trackResolvable as string
            const title = await this.getTitle(url)
            const dest = await this.downloadTrackStream(url, title, folder)
            return fs.createReadStream(dest)
        }
    }

    /**
     * Utility for awaiting a stream.Writable
     */
    private readonly awaitStream = async (writeStream: stream.Writable) => {
        return new Promise((resolve, reject) => {
            writeStream.on("finish", resolve)
            writeStream.on("error", reject)
        })
    }

    /**
     * Removes a directory recursively
     */
    private readonly removeDirectory = (dir: string) => {
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
