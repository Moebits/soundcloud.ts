import type {SoundcloudPlaylistFilterV2, SoundcloudPlaylistSearchV2, SoundcloudPlaylistV2} from "../types"
import {API} from "../API"
import {Tracks, Resolve} from "./index"
import {request} from "undici"

export class Playlists {
    private readonly tracks = new Tracks(this.api)
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: API) {}

    /**
     * Return playlist with all tracks fetched.
     */
    public fetch = async (playlist: SoundcloudPlaylistV2) => {
        const unresolvedTracks = playlist.tracks.splice(playlist.tracks.findIndex(t => !t.title)).map(t => t.id)
        if (unresolvedTracks.length === 0) return playlist
        playlist.tracks = playlist.tracks.concat(await this.tracks.getArrayV2(unresolvedTracks, true))
        return playlist
    }

    /**
     * Searches for playlists using the v2 API.
     */
    public searchV2 = async (params?: SoundcloudPlaylistFilterV2) => {
        const response = await this.api.getV2("search/playlists", params)
        return response as Promise<SoundcloudPlaylistSearchV2>
    }

    /**
     * Fetches a playlist from URL or ID using Soundcloud v2 API.
     */
    public getV2 = async (playlistResolvable: string | number) => {
        const playlistID = await this.resolve.getV2(playlistResolvable)
        const response = <SoundcloudPlaylistV2>await this.api.getV2(`/playlists/${playlistID}`)
        return this.fetch(response) as Promise<SoundcloudPlaylistV2>
    }

    /**
     * Searches for playlists (web scraping)
     */
    public searchAlt = async (query: string) => {
        const headers = this.api.headers
        const html = await request(`https://soundcloud.com/search/sets?q=${query}`, {headers}).then(r => r.body.text())
        const urls = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)?.map((u: any) => `https://soundcloud.com${u}`)
        if (!urls) return []
        const scrape: any = []
        for (let i = 0; i < urls.length; i++) {
            const songHTML = await request(urls[i], {headers}).then(r => r.body.text())
            const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
            const playlist = json[json.length - 1].data
            scrape.push(playlist)
        }
        return scrape as Promise<SoundcloudPlaylistV2[]>
    }

    /**
     * Gets a playlist by URL (web scraping)
     */
    public getAlt = async (url: string) => {
        if (!url.startsWith("https://soundcloud.com/")) url = `https://soundcloud.com/${url}`
        const headers = this.api.headers
        const songHTML = await request(url, {headers}).then((r: any) => r.body.text())
        const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
        const playlist = json[json.length - 1].data
        return this.fetch(playlist) as Promise<SoundcloudPlaylistV2>
    }
}
