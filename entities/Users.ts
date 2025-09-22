import type {SoundcloudTrackSearch, SoundcloudTrack, SoundcloudUserFilter, SoundcloudUserSearch, SoundcloudUser, SoundcloudWebProfile, SoundcloudPlaylist, SoundcloudPlaylistSearch} from "../types"
import {API} from "../API"
import {URL} from "url"
import {Resolve} from "./index"

export class Users {
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: API) {}

    /**
     * Searches for users using the v2 API.
     */
    public search = async (params?: SoundcloudUserFilter) => {
        const response = await this.api.getV2("search/users", params)
        return response as Promise<SoundcloudUserSearch>
    }

    /**
     * Fetches a user from URL or ID using Soundcloud v2 API.
     */
    public get = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.getV2(`/users/${userID}`)
        return response as Promise<SoundcloudUser>
    }

    /**
     * Gets all the tracks by the user using Soundcloud v2 API.
     */
    public tracks = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = <SoundcloudTrackSearch>await this.api.getV2(`/users/${userID}/tracks`)
        let nextHref = response.next_href
        while (nextHref) {
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            const nextPage = <SoundcloudTrackSearch>await this.api.getURL(url.origin + url.pathname, params)
            response.collection.push(...nextPage.collection)
            nextHref = nextPage.next_href
        }
        return response.collection as SoundcloudTrack[]
    }

    /**
     * Gets all of a users liked tracks.
     */
    public likes = async (userResolvable: string | number, limit?: number) => {
        const userID = await this.resolve.get(userResolvable)
        let response = <SoundcloudTrackSearch>await this.api.getV2(`/users/${userID}/likes`, {limit: 50, offset: 0})
        const tracks: SoundcloudTrack[] = []
        let nextHref = response.next_href
        while (nextHref && (!limit || tracks.length < limit)) {
            tracks.push(...response.collection.map((r: any) => r.track))
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            response = <SoundcloudTrackSearch>await this.api.getURL(url.origin + url.pathname, params)
            nextHref = response.next_href
        }
        return tracks
    }

    /**
     * Gets all the playlists by the user using Soundcloud v2 API.
     */
    public playlists = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = <SoundcloudPlaylistSearch>await this.api.getV2(`/users/${userID}/playlists`)
        let nextHref = response.next_href
        while (nextHref) {
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            const nextPage = <SoundcloudPlaylistSearch>await this.api.getURL(url.origin + url.pathname, params)
            response.collection.push(...nextPage.collection)
            nextHref = nextPage.next_href
        }
        return response.collection as SoundcloudPlaylist[]
    }

    /**
     * Gets all the web profiles on a users sidebar.
     */
    public webProfiles = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.getV2(`/users/soundcloud:users:${userID}/web-profiles`)
        return response as Promise<SoundcloudWebProfile[]>
    }

    /**
     * Gets a user's followers.
    */
    public following = async (userResolvable: string | number, limit?: number) => {
        const userID = await this.resolve.get(userResolvable)
        let response = await this.api.getV2(`/users/${userID}/followings`, {limit: 50, offset: 0}) as any
        const followers: SoundcloudUser[] = []
        let nextHref = response.next_href
        
        while (nextHref && (!limit || followers.length < limit)) {
            followers.push(...response.collection)
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            response = await this.api.getURL(url.origin + url.pathname, params)
            nextHref = response.next_href
        }
        
        return followers
    }

    /**
     * Searches for users (web scraping)
     */
    public searchAlt = async (query: string) => {
        const headers = this.api.headers
        const html = await fetch(`https://soundcloud.com/search/people?q=${query}`, {headers}).then(r => r.text())
        const urls = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)?.map((u: any) => `https://soundcloud.com${u}`)
        if (!urls) return []
        const scrape: any = []
        for (let i = 0; i < urls.length; i++) {
            const songHTML = await fetch(urls[i], {headers}).then(r => r.text())
            const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
            const user = json[json.length - 1].data
            scrape.push(user)
        }
        return scrape as Promise<SoundcloudUser[]>
    }

    /**
     * Gets a user by URL (web scraping)
     */
    public getAlt = async (url: string) => {
        if (!url.startsWith("https://soundcloud.com/")) url = `https://soundcloud.com/${url}`
        const headers = this.api.headers
        const songHTML = await fetch(url, {headers}).then(r => r.text())
        const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
        const user = json[json.length - 1].data
        return user as Promise<SoundcloudUser>
    }
}
