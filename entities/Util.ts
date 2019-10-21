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
            const result = await axios.get(track.download_url, {responseType: "arraybuffer", params: {client_id: this.api.clientID, oauth_token: this.api.oauthToken}})
            const dest = path.join(folder, `${track.title}.${result.headers["x-amz-meta-file-type"]}`)
            fs.writeFileSync(dest, Buffer.from(result.data, "binary"))
        } else {
            const result = await axios.get(track.stream_url, {responseType: "arraybuffer", params: {client_id: this.api.clientID, oauth_token: this.api.oauthToken}})
            const dest = path.join(folder, `${track.title}.mp3`)
            fs.writeFileSync(dest, Buffer.from(result.data, "binary"))
        }
    }

    public downloadTracks = (tracks: SoundCloudTrack[], dest?: string) => {
        for (let i = 0; i < tracks.length; i++) {
            try {
                this.downloadTrack(tracks[i], dest)
            } catch {
                continue
            }
        }
    }

    public downloadSearch = async (query: string, dest?: string) => {
        const tracks = await this.tracks.search({q: query})
        this.downloadTracks(tracks, dest)
    }

    public downloadFavorites = async (userResolvable: string | number, dest?: string) => {
        const tracks = await this.users.favorites(userResolvable)
        this.downloadTracks(tracks, dest)
    }

    public downloadPlaylist = async (playlistResolvable: string | number, dest?: string) => {
        const playlist = await this.playlists.get(playlistResolvable)
        this.downloadTracks(playlist.tracks, dest)
    }

    public streamTrack = async (trackResolvable: string | number | SoundCloudTrack) => {
        let track: SoundCloudTrack
        if (trackResolvable.hasOwnProperty("downloadable")) {
            track = trackResolvable as SoundCloudTrack
        } else {
            track = await this.tracks.get(String(trackResolvable))
        }
        console.log(track.stream_url)

        // const result = await axios.head(track.stream_url, {params: {client_id: this.api.clientID, oauth_token: this.api.oauthToken}})
        // console.log(result)

    }
}
