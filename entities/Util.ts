import type {SoundcloudTrackV2, SoundcloudTranscoding} from "../types"
import * as fs from "fs"
import * as path from "path"
import {API} from "../API"
import {Tracks, Users, Playlists} from "./index"
import {request} from "undici"
import {Readable} from "stream"
import {spawnSync} from "child_process"

const makeRequest = async (...args: Parameters<typeof request>) => {
    const response = await request(...args).then(r => {
        if (r.statusCode.toString().startsWith("2")) return r.body
        throw new Error(`Status code ${r.statusCode}`)
    })
    return response
}

let temp = 0
const FFMPEG = {checked: false, path: ""}
const SOURCES: (() => string)[] = [
    () => {
        const ffmpeg = require("ffmpeg-static")
        return ffmpeg?.path ?? ffmpeg
    },
    () => "ffmpeg",
    () => "./ffmpeg",
]

export class Util {
    private readonly tracks = new Tracks(this.api)
    private readonly users = new Users(this.api)
    private readonly playlists = new Playlists(this.api)
    public constructor(private readonly api: API) {}


    private readonly resolveTrack = async (trackResolvable: string | SoundcloudTrackV2) => {
        return typeof trackResolvable === "string" ? await this.tracks.getV2(trackResolvable) : trackResolvable
    }

    private readonly sortTranscodings = async (trackResolvable: string | SoundcloudTrackV2, protocol?: "progressive" | "hls") => {
        const track = await this.resolveTrack(trackResolvable)
        const transcodings = track.media.transcodings.sort(t => (t.quality === "hq" ? -1 : 1))
        if (!protocol) return transcodings
        return transcodings.filter(t => t.format.protocol === protocol)
    }

    private readonly getStreamLink = async (transcoding: SoundcloudTranscoding) => {
        if (!transcoding?.url) return null
        const url = transcoding.url
        let client_id = await this.api.getClientId()
        const headers = this.api.headers
        let connect = url.includes("?") ? `&client_id=${client_id}` : `?client_id=${client_id}`
        try {
            return await makeRequest(url + connect, {headers})
                .then(r => r.json())
                .then(r => (<{url: string}>r).url)
        } catch {
            client_id = await this.api.getClientId(true)
            connect = url.includes("?") ? `&client_id=${client_id}` : `?client_id=${client_id}`
            try {
                return await makeRequest(url + connect, {headers})
                    .then(r => r.json())
                    .then(r => (<{url: string}>r).url)
            } catch {
                return null
            }
        }
    }
    /**
     * Gets the direct streaming link of a track.
     */
    public streamLink = async (trackResolvable: string | SoundcloudTrackV2, protocol?: "progressive" | "hls") => {
        const track = await this.resolveTrack(trackResolvable)
        const transcodings = await this.sortTranscodings(track, protocol)
        if (!transcodings.length) return null
        return this.getStreamLink(transcodings[0])
    }

    private readonly mergeFiles = async (files: string[], outputFile: string): Promise<void> => {
        const outStream = fs.createWriteStream(outputFile)
        const ret = new Promise<void>((resolve, reject) => {
            outStream.on("finish", resolve)
            outStream.on("error", reject)
        })
        for (const file of files) {
            await new Promise((resolve, reject) => {
                fs.createReadStream(file).on("error", reject).on("end", resolve).pipe(outStream, {end: false})
            })
        }
        outStream.end()
        return ret
    }

    private readonly checkFFmpeg = () => {
        if (FFMPEG.checked) return true
        for (const fn of SOURCES) {
            try {
                const command = fn()
                const result = spawnSync(command, ["-h"], {windowsHide: true, shell: true, encoding: "utf-8"})
                if (result.error) throw result.error
                if (result.stderr && !result.stdout) throw new Error(result.stderr)

                const output = result.output.filter(Boolean).join("\n")
                const version = /version (.+) Copyright/im.exec(output)?.[1]
                if (!version) throw new Error(`Malformed FFmpeg command using ${command}`)
                FFMPEG.path = command
            } catch {}
        }
        FFMPEG.checked = true
        if (!FFMPEG.path) {
            console.warn("FFmpeg not found, please install ffmpeg-static or add ffmpeg to your PATH.")
            console.warn("Download m4a (hq) is disabled, use mp3 (sq) instead.")
        }
        return true
    }

    private readonly spawnFFmpeg = (argss: string[]) => {
        try {
            spawnSync(FFMPEG.path, argss, {windowsHide: true, shell: false})
        } catch (e) {
            console.error(e)
            throw "FFmpeg error"
        }
    }

    /**
     * Readable stream of m3u playlists.
     */
    private readonly m3uReadableStream = async (trackResolvable: string | SoundcloudTrackV2): Promise<{stream: NodeJS.ReadableStream, type: "m4a" | "mp3"}> => {
        const track = await this.resolveTrack(trackResolvable)
        const transcodings = await this.sortTranscodings(track, "hls")
        if (!transcodings.length) throw "No transcodings found"
        let transcoding: {url: string; type: "m4a" | "mp3"}
        for (const t of transcodings) {
            if (t.format.mime_type.startsWith('audio/mp4; codecs="mp4a') && this.checkFFmpeg()) {
                transcoding = {url: t.url, type: "m4a"}
                break
            }
            if (t.format.mime_type.startsWith("audio/mpeg")) {
                transcoding = {url: t.url, type: "mp3"}
                break
            }
        }
        if (!transcoding) {
            console.log(`Support for this track is not yet implemented, please open an issue on GitHub.\n
            URL: ${track.permalink_url}.\n
            Type: ${track.media.transcodings.map(t => t.format.mime_type).join(" | ")}`)
            throw "No supported transcodings found"
        }
        const headers = this.api.headers
        const client_id = await this.api.getClientId()
        const connect = transcoding.url.includes("?") ? `&client_id=${client_id}` : `?client_id=${client_id}`
        const m3uLink = await makeRequest(transcoding.url + connect, {headers: this.api.headers})
            .then(r => r.json())
            .then(r => (<{url: string }>r).url)
        const destDir = path.join(__dirname, `tmp_${temp++}`)
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, {recursive: true})
        const output = path.join(destDir, `out.${transcoding.type}`)

        if (transcoding.type === "m4a") {
            try {
                this.spawnFFmpeg(["-y", "-loglevel", "warning", "-i", m3uLink, "-bsf:a", "aac_adtstoasc", "-vcodec", "copy", "-c", "copy", "-crf", "50", output])
            } catch {
                console.warn("Failed to transmux to m4a (hq), download as mp3 (hq) instead.")
                FFMPEG.path = null
                return this.m3uReadableStream(trackResolvable)
            }
        } else {
            const m3u = await makeRequest(m3uLink, {headers}).then(r => r.text())
            const urls = m3u.match(/(http).*?(?=\s)/gm)
            const chunks: string[] = []
            for (let i = 0; i < urls.length; i++) {
                const arrayBuffer = await request(urls[i], {headers}).then(r => r.body.arrayBuffer())
                const chunkPath = path.join(destDir, `${i}.${transcoding.type}`)
                fs.writeFileSync(chunkPath, Buffer.from(arrayBuffer))
                chunks.push(chunkPath)
            }
            await this.mergeFiles(chunks, output)
        }
        const stream: NodeJS.ReadableStream = Readable.from(fs.readFileSync(output))
        Util.removeDirectory(destDir)
        return {stream, type: transcoding.type}
    }

    /**
     * Downloads the mp3 stream of a track.
     */
    private readonly downloadTrackStream = async (trackResolvable: string | SoundcloudTrackV2, title: string, dest: string) => {
        let result: {stream: NodeJS.ReadableStream, type: string}
        const track = await this.resolveTrack(trackResolvable)
        const transcodings = await this.sortTranscodings(track, "progressive")
        if (!transcodings.length) {
            result = await this.m3uReadableStream(trackResolvable)
        } else {
            const transcoding = transcodings[0]
            const url = await this.getStreamLink(transcoding)
            const headers = this.api.headers
            const stream = await makeRequest(url, {headers})
            const type = transcoding.format.mime_type.startsWith('audio/mp4; codecs="mp4a') ? "m4a" : "mp3"
            result = {stream, type}
        }

        const stream = result.stream
        const fileName = path.extname(dest) ? dest : path.join(dest, `${title}.${result.type}`)
        const writeStream = fs.createWriteStream(fileName)
        stream.pipe(writeStream)

        await new Promise<void>(resolve => stream.on("end", () => resolve()))
        return fileName
    }

    /**
     * Downloads a track on Soundcloud.
     */
    public downloadTrack = async (trackResolvable: string | SoundcloudTrackV2, dest?: string) => {
        if (!dest) dest = "./"
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, {recursive: true})
        const track = await this.resolveTrack(trackResolvable)
        if (track.downloadable === true) {
            try {
                const downloadObj = await this.api.getV2(`/tracks/${track.id}/download`) as any
                const result = await request(downloadObj.redirectUri)
                dest = path.extname(dest) ? dest : path.join(dest, `${track.title.replace(/\//g, "")}.${result.headers["x-amz-meta-file-type"]}`)
                const arrayBuffer = await result.body.arrayBuffer() as any
                fs.writeFileSync(dest, Buffer.from(arrayBuffer, "binary"))
                return dest
            } catch {
                return this.downloadTrackStream(track, track.title.replace(/\//g, ""), dest)
            }
        } else {
            return this.downloadTrackStream(track, track.title.replace(/\//g, ""), dest)
        }
    }

    /**
     * Downloads an array of tracks.
     */
    public downloadTracks = async (tracks: SoundcloudTrackV2[] | string[], dest?: string, limit?: number) => {
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
     * Download all liked tracks by a user.
     */
    public downloadLikes = async (userResolvable: string | number, dest?: string, limit?: number) => {
        const tracks = await this.users.likes(userResolvable, limit)
        return this.downloadTracks(tracks, dest, limit)
    }

    /**
     * Downloads all the tracks in a playlist.
     */
    public downloadPlaylist = async (playlistResolvable: string, dest?: string, limit?: number) => {
        const playlist = await this.playlists.getV2(playlistResolvable)
        return this.downloadTracks(playlist.tracks, dest, limit)
    }

    /**
     * Returns a readable stream to the track.
     */
    public streamTrack = async (trackResolvable: string | SoundcloudTrackV2): Promise<NodeJS.ReadableStream> => {
        const url = await this.streamLink(trackResolvable, "progressive")
        if (!url) return this.m3uReadableStream(trackResolvable).then(r => r.stream)
        const readable = await makeRequest(url, {headers: this.api.headers})
        return readable
    }

    /**
     * Downloads a track's song cover.
     */
    public downloadSongCover = async (trackResolvable: string | SoundcloudTrackV2, dest?: string, noDL?: boolean) => {
        if (!dest) dest = "./"
        const folder = dest
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        const track = await this.resolveTrack(trackResolvable)
        const artwork = (track.artwork_url ? track.artwork_url : track.user.avatar_url).replace(".jpg", ".png").replace("-large", "-t500x500")
        const title = track.title.replace(/\//g, "")
        dest = path.extname(dest) ? dest : path.join(folder, `${title}.png`)
        const client_id = await this.api.getClientId()
        const url = `${artwork}?client_id=${client_id}`
        if (noDL) return url
        const arrayBuffer = await makeRequest(url).then(r => r.arrayBuffer())
        fs.writeFileSync(dest, Buffer.from(arrayBuffer))
        return dest
    }

    private static readonly removeDirectory = (dir: string) => {
        if (!fs.existsSync(dir)) return
        fs.readdirSync(dir).forEach(file => {
            const current = path.join(dir, file)
            if (fs.lstatSync(current).isDirectory()) {
                Util.removeDirectory(current)
            } else {
                fs.unlinkSync(current)
            }
        })
        try {
            fs.rmdirSync(dir)
        } catch (error) {
            console.error(error)
        }
    }
}
