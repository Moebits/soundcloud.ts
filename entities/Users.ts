import type {SoundcloudTrackSearchV2, SoundcloudTrackV2, SoundcloudUserFilterV2, SoundcloudUserSearchV2, SoundcloudUserV2, SoundcloudWebProfile} from "../types"
import {API} from "../API"
import {URL} from "url"
import {Resolve} from "./index"
import {request} from "undici"

export class Users {
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: API) {}

    /**
     * Searches for users using the v2 API.
     */
    public searchV2 = async (params?: SoundcloudUserFilterV2) => {
        const response = await this.api.getV2("search/users", params)
        return response as Promise<SoundcloudUserSearchV2>
    }

    /**
     * Fetches a user from URL or ID using Soundcloud v2 API.
     */
    public getV2 = async (userResolvable: string | number) => {
        const userID = await this.resolve.getV2(userResolvable)
        const response = await this.api.getV2(`/users/${userID}`)
        return response as Promise<SoundcloudUserV2>
    }

    /**
     * Gets all the tracks by the user using Soundcloud v2 API.
     */
    public tracksV2 = async (userResolvable: string | number) => {
        const userID = await this.resolve.getV2(userResolvable)
        const response = <SoundcloudTrackSearchV2>await this.api.getV2(`/users/${userID}/tracks`)
        let nextHref = response.next_href
        while (nextHref) {
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            const nextPage = <SoundcloudTrackSearchV2>await this.api.getURL(url.origin + url.pathname, params)
            response.collection.push(...nextPage.collection)
            nextHref = nextPage.next_href
        }
        return response.collection as SoundcloudTrackV2[]
    }

    /**
     * Gets all of a users liked tracks.
     */
    public likes = async (userResolvable: string | number, limit?: number) => {
        const userID = await this.resolve.getV2(userResolvable)
        const response = <SoundcloudTrackSearchV2>await this.api.getV2(`/users/${userID}/likes`, {limit: 50, offset: 0})
        const tracks: SoundcloudTrackV2[] = []
        let nextHref = response.next_href
        while (nextHref && (!limit || tracks.length < limit)) {
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            const nextPage = <SoundcloudTrackSearchV2>await this.api.getURL(url.origin + url.pathname, params)
            tracks.push(...nextPage.collection)
            nextHref = nextPage.next_href
        }
        return tracks
    }

    /**
     * Gets all the web profiles on a users sidebar.
     */
    public webProfiles = async (userResolvable: string | number) => {
        const userID = await this.resolve.getV2(userResolvable)
        const response = await this.api.getV2(`/users/soundcloud:users:${userID}/web-profiles`)
        return <SoundcloudWebProfile[]>response
    }

    /**
     * Searches for users (web scraping)
     */
    public searchAlt = async (query: string) => {
        const headers = this.api.headers
        const html = await request(`https://soundcloud.com/search/people?q=${query}`, {headers}).then(r => r.body.text())
        const urls = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)?.map((u: any) => `https://soundcloud.com${u}`)
        if (!urls) return []
        const scrape: any = []
        for (let i = 0; i < urls.length; i++) {
            const songHTML = await request(urls[i], {headers}).then(r => r.body.text())
            const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
            const user = json[json.length - 1].data
            scrape.push(user)
        }
        return scrape as Promise<SoundcloudUserV2[]>
    }

    /**
     * Gets a user by URL (web scraping)
     */
    public getAlt = async (url: string) => {
        if (!url.startsWith("https://soundcloud.com/")) url = `https://soundcloud.com/${url}`
        const headers = this.api.headers
        const songHTML = await request(url, {headers}).then(r => r.body.text())
        const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
        const user = json[json.length - 1].data
        return user as Promise<SoundcloudUserV2>
    }
}
