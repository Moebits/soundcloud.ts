import type {SoundcloudTrackFilter, SoundcloudTrackSearch, SoundcloudTrack} from "../types"
import {API} from "../API"
import {Resolve} from "./index"

export class Tracks {
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: API) {}

    /**
     * Searches for tracks using the v2 API.
     */
    public search = async (params?: SoundcloudTrackFilter) => {
        const response = await this.api.getV2("search/tracks", params)
        return response as Promise<SoundcloudTrackSearch>
    }

    /**
     * Fetches a track from URL or ID using Soundcloud v2 API.
     */
    public get = async (trackResolvable: string | number) => {
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.getV2(`/tracks/${trackID}`)
        return response as Promise<SoundcloudTrack>
    }

    /**
     * Fetches tracks from an array of ID using Soundcloud v2 API.
     */
    public getArray = async (trackIds: number[], keepOrder: boolean = false) => {
        if (trackIds.length === 0) return []
        // Max 50 ids per request => split into chunks of 50 ids
        const chunks: number[][] = []
        let i = 0
        while (i < trackIds.length) chunks.push(trackIds.slice(i, (i += 50)))
        const response: SoundcloudTrack[] = []
        const tracks = <SoundcloudTrack[][]>await Promise.all(chunks.map(chunk => this.api.getV2("/tracks", {ids: chunk.join(",")})))
        const result = response.concat(...tracks)
        if (keepOrder) return result.sort((a, b) => trackIds.indexOf(a.id) - trackIds.indexOf(b.id));
        return result
    }

    /**
     * Searches for tracks (web scraping)
     */
    public searchAlt = async (query: string) => {
        const headers = this.api.headers
        const html = await fetch(`https://soundcloud.com/search/sounds?q=${query}`, {headers}).then(r => r.text())
        const urls = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)?.map((u: any) => `https://soundcloud.com${u}`)
        if (!urls) return []
        const scrape: any = []
        for (let i = 0; i < urls.length; i++) {
            const songHTML = await fetch(urls[i], {headers}).then(r => r.text())
            const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
            const track = json[json.length - 1].data
            scrape.push(track)
        }
        return scrape as Promise<SoundcloudTrack[]>
    }

    /**
     * Gets a track by URL (web scraping)
     */
    public getAlt = async (url: string) => {
        if (!url.startsWith("https://soundcloud.com/")) url = `https://soundcloud.com/${url}`
        const headers = this.api.headers
        const songHTML = await fetch(url, {headers}).then(r => r.text())
        const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
        const track = json[json.length - 1].data
        return track as Promise<SoundcloudTrack>
    }

    /**
     * Gets all related tracks of a track using the v2 API.
     */
    public related = async (trackResolvable: string | number, limit?: number) => {
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.getV2(`/tracks/${trackID}/related`, {limit})
        return response.collection as Promise<SoundcloudTrackSearch>
    }
}