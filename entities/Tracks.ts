import type {SoundcloudTrackFilterV2, SoundcloudTrackSearchV2, SoundcloudTrackV2} from "../types"
import {API} from "../API"
import {Resolve} from "./index"
import {request} from "undici"

export class Tracks {
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: API) {}

    /**
     * Searches for tracks using the v2 API.
     */
    public searchV2 = async (params?: SoundcloudTrackFilterV2) => {
        const response = await this.api.getV2("search/tracks", params)
        return response as Promise<SoundcloudTrackSearchV2>
    }

    /**
     * Fetches a track from URL or ID using Soundcloud v2 API.
     */
    public getV2 = async (trackResolvable: string | number) => {
        const trackID = await this.resolve.getV2(trackResolvable)
        const response = await this.api.getV2(`/tracks/${trackID}`)
        return response as Promise<SoundcloudTrackV2>
    }

    /**
     * Fetches tracks from an array of ID using Soundcloud v2 API.
     */
    public getArrayV2 = async (trackIds: number[], keepOrder: boolean = false) => {
        if (trackIds.length === 0) return []
        // Max 50 ids per request => split into chunks of 50 ids
        const chunks: number[][] = []
        let i = 0
        while (i < trackIds.length) chunks.push(trackIds.slice(i, (i += 50)))
        const response: SoundcloudTrackV2[] = []
        const tracks = <SoundcloudTrackV2[][]>await Promise.all(chunks.map(chunk => this.api.getV2("/tracks", {ids: chunk.join(",")})))
        const result = response.concat(...tracks)
        if (keepOrder) return result.sort((a, b) => trackIds.indexOf(a.id) - trackIds.indexOf(b.id));
        return result
    }

    /**
     * Searches for tracks (web scraping)
     */
    public searchAlt = async (query: string) => {
        const headers = this.api.headers
        const html = await request(`https://soundcloud.com/search/sounds?q=${query}`, {headers}).then(r => r.body.text())
        const urls = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)?.map((u: any) => `https://soundcloud.com${u}`)
        if (!urls) return []
        const scrape: any = []
        for (let i = 0; i < urls.length; i++) {
            const songHTML = await request(urls[i], {headers}).then(r => r.body.text())
            const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
            const track = json[json.length - 1].data
            scrape.push(track)
        }
        return scrape as Promise<SoundcloudTrackV2[]>
    }

    /**
     * Gets a track by URL (web scraping)
     */
    public getAlt = async (url: string) => {
        if (!url.startsWith("https://soundcloud.com/")) url = `https://soundcloud.com/${url}`
        const headers = this.api.headers
        const songHTML = await request(url, {headers}).then(r => r.body.text())
        const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
        const track = json[json.length - 1].data
        return track as Promise<SoundcloudTrackV2>
    }

    /**
     * Gets all related tracks of a track using the v2 API.
     */
    public relatedV2 = async (trackResolvable: string | number, limit?: number) => {
        const trackID = await this.resolve.getV2(trackResolvable)
        const response = <SoundcloudTrackSearchV2>await this.api.getV2(`/tracks/${trackID}/related`, {limit})
        return response.collection
    }
}
