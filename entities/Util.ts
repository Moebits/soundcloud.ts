import * as audioconcat from "audioconcat"
import * as fs from "fs"
import * as path from "path"
import { Readable } from "stream"
import { request } from "undici"
import type api from "../API"
import type { SoundcloudTrack, SoundcloudTrackV2 } from "../types"
import { Playlists, Tracks, Users } from "./index"

const makeRequest = async (...args: Parameters<typeof request>) => {
    const response = await request(...args).then(r => {
        if (r.statusCode.toString().startsWith("2")) return r.body
        throw new Error(`Status code ${r.statusCode}`)
    })
    return response
}

export class Util {
    private readonly playlists = new Playlists(this.api)
    private readonly users = new Users(this.api)
    private readonly tracks = new Tracks(this.api)
    constructor(private readonly api: api) {}

    /**
     * Gets the direct streaming link of a track.
     */
    public streamLink = async (songUrl: string) => {
        const headers = {
            referer: "soundcloud.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        }
        if (songUrl.includes("m.soundcloud.com")) songUrl = songUrl.replace("m.soundcloud.com", "soundcloud.com")
        if (!songUrl.includes("soundcloud.com")) songUrl = `https://soundcloud.com/${songUrl}`
        const html = await makeRequest(songUrl, { headers }).then(r => r.text())
        const json = JSON.parse(html.match(/(\[{)(.*)(?=;)/gm)[0])
        const track = json[json.length - 1].data

        //  const match = html.data.match(/(?<=,{"url":")(.*?)(progressive)/)?.[0]
        const match = track.media.transcodings.find((t: any) => t.format.mime_type === "audio/mpeg" && t.format.protocol === "progressive")?.url
        let url: string
        let client_id = await this.api.getClientID()
        if (match) {
            let connect = match.includes("secret_token") ? `&client_id=${client_id}` : `?client_id=${client_id}`
            try {
                url = await makeRequest(match + connect, { headers })
                    .then(r => r.json())
                    .then(r => r.url)
            } catch {
                client_id = await this.api.getClientID(true)
                connect = match.includes("secret_token") ? `&client_id=${client_id}` : `?client_id=${client_id}`
                url = await makeRequest(match + connect, { headers })
                    .then(r => r.json())
                    .then(r => r.url)
            }
        } else {
            return null
        }
        return url
    }

    /**
     * Readable stream of m3u playlists.
     */
    private readonly m3uReadableStream = async (songUrl: string): Promise<NodeJS.ReadableStream> => {
        const headers = {
            referer: "soundcloud.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        }
        if (songUrl.includes("m.soundcloud.com")) songUrl = songUrl.replace("m.soundcloud.com", "soundcloud.com")
        if (!songUrl.includes("soundcloud.com")) songUrl = `https://soundcloud.com/${songUrl}`
        const html = await makeRequest(songUrl, { headers }).then(r => r.text())
        const json = JSON.parse(html.match(/(\[{)(.*)(?=;)/gm)[0])
        const track = json[json.length - 1].data
        const client_id = await this.api.getClientID()
        const match = track.media.transcodings.find((t: any) => t.format.mime_type === "audio/mpeg" && t.format.protocol === "hls")?.url
        if (!match) return null
        const connect = match.includes("secret_token") ? `&client_id=${client_id}` : `?client_id=${client_id}`
        const m3uLink = await makeRequest(match + connect, { headers })
            .then(r => r.json())
            .then(r => r.url)
        const m3u = await makeRequest(m3uLink, { headers }).then(r => r.text())
        const urls = m3u.match(/(http).*?(?=\s)/gm)
        const destDir = path.join(__dirname, "temp")
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
        const output = `${destDir}/temp.mp3`
        const chunks = []
        for (let i = 0; i < urls.length; i++) {
            const arrayBuffer = await request(urls[i], { headers }).then(r => r.body.arrayBuffer())
            fs.writeFileSync(`${destDir}/${i}.mp3`, Buffer.from(arrayBuffer))
            chunks.push(`${destDir}/${i}.mp3`)
        }
        await new Promise<void>(resolve => {
            audioconcat(chunks)
                .concat(output)
                .on("end", () => resolve())
        })
        const stream = Readable.from(fs.readFileSync(output))
        Util.removeDirectory(destDir)
        return stream
    }

    /**
     * Downloads the mp3 stream of a track as readable stream.
     */
    private readonly downloadTrackReadableStream = async (songUrl: string): Promise<NodeJS.ReadableStream> => {
        const headers = {
            referer: "soundcloud.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        }
        const url = await this.streamLink(songUrl)
        if (!url) return this.m3uReadableStream(songUrl)
        const readable = await makeRequest(url, { headers })
        return readable
    }

    /**
     * Downloads the mp3 stream of a track.
     */
    private readonly downloadTrackStream = async (songUrl: string, title: string, dest: string) => {
        if (title.endsWith(".mp3")) title = title.replace(".mp3", "")
        const finalMP3 = path.extname(dest) ? dest : path.join(dest, `${title}.mp3`)

        const stream = await this.downloadTrackReadableStream(songUrl)
        const writeStream = fs.createWriteStream(finalMP3)
        stream.pipe(writeStream)

        await new Promise<void>(resolve => stream.on("end", () => resolve()))

        return finalMP3
    }

    /**
     * Gets a track title from the page
     */
    public getTitle = async (songUrl: string) => {
        const headers = {
            referer: "soundcloud.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        }
        const html = await makeRequest(songUrl, { headers }).then(r => r.text())
        const title = html.match(/(?<="og:title" content=")(.*?)(?=")/)?.[0]?.replace(/\//g, "")
        return title
    }

    /**
     * Downloads a track on Soundcloud.
     */
    public downloadTrack = async (trackResolvable: string | SoundcloudTrack | SoundcloudTrackV2, dest?: string) => {
        if (!dest) dest = "./"
        const folder = path.dirname(dest)
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
        let track: SoundcloudTrack
        if (Object.prototype.hasOwnProperty.call(trackResolvable, "downloadable")) {
            track = trackResolvable as SoundcloudTrack
            if (track.downloadable === true) {
                const client_id = await this.api.getClientID()
                const result = await request(track.download_url, { query: { client_id } })
                dest = path.extname(dest) ? dest : path.join(folder, `${track.title.replace(/\//g, "")}.${result.headers["x-amz-meta-file-type"]}`)
                fs.writeFileSync(dest, Buffer.from(await result.body.arrayBuffer()))
                return dest
            } else {
                return this.downloadTrackStream(track.permalink_url, track.title.replace(/\//g, ""), dest)
            }
        } else {
            const url = trackResolvable as string
            const title = await this.getTitle(url)
            return this.downloadTrackStream(url, title, dest)
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
        const tracks = await this.tracks.searchV2({ q: query })
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
    public downloadPlaylist = async (playlistResolvable: string, dest?: string, limit?: number) => {
        const playlist = await this.playlists.getAlt(playlistResolvable)
        return this.downloadTracks(playlist.tracks, dest, limit)
    }

    /**
     * Returns a readable stream to the track.
     */
    public streamTrack = async (trackResolvable: string | SoundcloudTrack | SoundcloudTrackV2): Promise<NodeJS.ReadableStream> => {
        let track: SoundcloudTrack
        if (Object.prototype.hasOwnProperty.call(trackResolvable, "downloadable")) {
            track = trackResolvable as SoundcloudTrack
            if (track.downloadable === true) {
                const client_id = await this.api.getClientID()
                return makeRequest(track.download_url, { query: { client_id, oauth_token: this.api.oauthToken } })
            } else {
                return this.downloadTrackReadableStream(track.permalink_url)
            }
        } else {
            const url = trackResolvable as string
            return this.downloadTrackReadableStream(url)
        }
    }

    /**
     * Downloads a track's song cover.
     */
    public downloadSongCover = async (trackResolvable: string | SoundcloudTrack | SoundcloudTrackV2, dest?: string, noDL?: boolean) => {
        if (!dest) dest = "./"
        const folder = path.dirname(dest)
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
        let track: SoundcloudTrackV2
        if (Object.prototype.hasOwnProperty.call(trackResolvable, "artwork_url")) {
            track = trackResolvable as SoundcloudTrackV2
        } else {
            track = await this.tracks.getV2(trackResolvable as string)
        }
        let artwork = track.artwork_url ? track.artwork_url : track.user.avatar_url
        artwork = artwork.replace(".jpg", ".png").replace("-large", "-t500x500")
        const title = track.title.replace(/\//g, "")
        dest = path.extname(dest) ? dest : path.join(folder, `${title}.png`)
        const client_id = await this.api.getClientID()
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
            // eslint-disable-next-line no-console
            console.error(error)
        }
    }
}
