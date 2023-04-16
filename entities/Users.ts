import type {
    SoundcloudComment,
    SoundcloudPlaylist,
    SoundcloudTrack,
    SoundcloudTrackV2,
    SoundcloudUser,
    SoundcloudUserCollection,
    SoundcloudUserFilter,
    SoundcloudUserFilterV2,
    SoundcloudUserSearchV2,
    SoundcloudUserV2,
    SoundcloudWebProfile,
} from "../types"
import { Base } from "."
import { URL } from "url"
import { request } from "undici"

export class Users extends Base {
    /**
     * @deprecated use searchV2
     * Searches for users.
     */
    public search = async (params?: SoundcloudUserFilter) => {
        const response = await this.api.get("/users", params)
        return response as Promise<SoundcloudUser[]>
    }

    /**
     * Searches for users using the v2 API.
     */
    public searchV2 = async (params?: SoundcloudUserFilterV2) => {
        const response = await this.api.getV2("search/users", params)
        return response as Promise<SoundcloudUserSearchV2>
    }

    /**
     * @deprecated use getV2
     * Gets a user by URL or ID.
     */
    public get = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable, true)
        if (Object.prototype.hasOwnProperty.call(userID, "id")) return userID
        const response = await this.api.get(`/users/${userID}`)
        return response as Promise<SoundcloudUser>
    }

    /**
     * Fetches a user from URL or ID using Soundcloud v2 API.
     */
    public getV2 = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.getV2(userResolvable)
        const response = await this.api.getV2(`/users/${userID}`)
        return response as Promise<SoundcloudUserV2>
    }

    /**
     * @deprecated
     * Gets all the tracks by the user.
     */
    public tracks = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/tracks`)
        return response as Promise<SoundcloudTrack[]>
    }
    /**
     * Gets all the tracks by the user using Soundcloud v2 API.
     */
    public tracksV2 = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.getV2(userResolvable)
        const response = await this.api.getV2(`/users/${userID}/tracks`)
        let nextHref = response.next_href
        while (nextHref) {
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            const nextPage = await this.api.getURL(url.origin + url.pathname, params)
            response.collection.push(...nextPage.collection)
            nextHref = nextPage.next_href
        }
        return response.collection as Promise<SoundcloudTrackV2[]>
    }

    /**
     * @deprecated
     * Gets all the playlists by the user.
     */
    public playlists = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/playlists`)
        return response as Promise<SoundcloudPlaylist[]>
    }

    /**
     * @deprecated
     * Gets all the users the user is following.
     */
    public followings = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/followings`)
        return response as Promise<SoundcloudUserCollection>
    }

    /**
     * @deprecated
     * Gets a specific following.
     */
    public following = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const followingID = await this.sc.resolve.get(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followings/${followingID}`)
        return response as Promise<SoundcloudUser>
    }

    /**
     * @deprecated
     * Gets all of a users followers.
     */
    public followers = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/followers`)
        return response as Promise<SoundcloudUserCollection>
    }

    /**
     * @deprecated
     * Gets a specific follower.
     */
    public follower = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const followerID = await this.sc.resolve.get(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followers/${followerID}`)
        return response as Promise<SoundcloudUser>
    }

    /**
     * @deprecated
     * Gets all comments by the user.
     */
    public comments = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/comments`)
        return response as Promise<SoundcloudComment[]>
    }

    /**
     * @deprecated use likes
     * Gets all of a users favorite tracks.
     */
    public favorites = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/favorites`)
        return response as Promise<SoundcloudTrack[]>
    }

    /**
     * Gets all of a users liked tracks.
     */
    public likes = async (userResolvable: string | number, limit?: number) => {
        const userID = await this.sc.resolve.getV2(userResolvable)
        const response = await this.api.getV2(`/users/${userID}/likes`, { limit: 50, offset: 0 })
        const tracks: SoundcloudTrackV2[] = []
        let nextHref = response.next_href
        while (nextHref && (!limit || tracks.length < limit)) {
            const url = new URL(nextHref)
            const params = {}
            url.searchParams.forEach((value, key) => (params[key] = value))
            const nextPage = await this.api.getURL(url.origin + url.pathname, params)
            tracks.push(...nextPage.collection)
            nextHref = nextPage.next_href
        }
        return tracks
    }

    /**
     * @deprecated
     * Gets a specific favorite track.
     */
    public favorite = async (userResolvable: string | number, trackResolvable: string | number) => {
        const userID = await this.sc.resolve.get(userResolvable)
        const trackID = await this.sc.resolve.get(trackResolvable)
        const response = await this.api.get(`/users/${userID}/favorites/${trackID}`)
        return response as Promise<SoundcloudTrack>
    }

    /**
     * Gets all the web profiles on a users sidebar.
     */
    public webProfiles = async (userResolvable: string | number) => {
        const userID = await this.sc.resolve.getV2(userResolvable)
        const response = await this.api.getV2(`/users/soundcloud:users:${userID}/web-profiles`)
        return response as Promise<SoundcloudWebProfile[]>
    }

    /**
     * Searches for users (web scraping)
     */
    public searchAlt = async (query: string) => {
        const headers = this.api.headers
        const html = await request(`https://soundcloud.com/search/people?q=${query}`, { headers }).then(r => r.body.text())
        const urls = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)?.map((u: any) => `https://soundcloud.com${u}`)
        if (!urls) return []
        const scrape: any = []
        for (let i = 0; i < urls.length; i++) {
            const songHTML = await request(urls[i], { headers }).then(r => r.body.text())
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
        const songHTML = await request(url, { headers }).then(r => r.body.text())
        const json = JSON.parse(songHTML.match(/(\[{)(.*)(?=;)/gm)[0])
        const user = json[json.length - 1].data
        return user as Promise<SoundcloudUserV2>
    }
}
