import axios from "axios"
import api from "../API"
import {SoundCloudComment, SoundCloudPlaylist, SoundCloudTrack, SoundCloudUser, SoundCloudUserCollection,
SoundCloudUserFilter, SoundCloudWebProfile} from "../types"
import {Resolve} from "./index"

export class Users {
    private readonly resolve = new Resolve(this.api)
    constructor(private readonly api: api) {}

    /**
     * Searches for users.
     */
    public search = async (params?: SoundCloudUserFilter) => {
        const response = await this.api.get(`/users`, params)
        return response as Promise<SoundCloudUser[]>
    }

    /**
     * Gets a user by URL or ID.
     */
    public get = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable, true)
        if (userID.hasOwnProperty("id")) return userID
        const response = await this.api.get(`/users/${userID}`)
        return response as Promise<SoundCloudUser>
    }

    /**
     * Gets all the tracks by the user.
     */
    public tracks = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/tracks`)
        return response as Promise<SoundCloudTrack[]>
    }

    /**
     * Gets all the playlists by the user.
     */
    public playlists = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/playlists`)
        return response as Promise<SoundCloudPlaylist[]>
    }

    /**
     * Gets all the users the user is following.
     */
    public followings = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/followings`)
        return response as Promise<SoundCloudUserCollection>
    }

    /**
     * Gets a specific following.
     */
    public following = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const followingID = await this.resolve.get(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followings/${followingID}`)
        return response as Promise<SoundCloudUser>
    }

    /**
     * Gets all of a users followers.
     */
    public followers = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/followers`)
        return response as Promise<SoundCloudUserCollection>
    }

    /**
     * Gets a specific follower.
     */
    public follower = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const followerID = await this.resolve.get(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followers/${followerID}`)
        return response as Promise<SoundCloudUser>
    }

    /**
     * Gets all comments by the user.
     */
    public comments = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/comments`)
        return response as Promise<SoundCloudComment[]>
    }

    /**
     * Gets all of a users favorite tracks.
     */
    public favorites = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/favorites`)
        return response as Promise<SoundCloudTrack[]>
    }

    /**
     * Gets a specific favorite track.
     */
    public favorite = async (userResolvable: string | number, trackResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.get(`/users/${userID}/favorites/${trackID}`)
        return response as Promise<SoundCloudTrack>
    }

    /**
     * Gets all the web profiles on a users sidebar.
     */
    public webProfiles = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/web-profiles`)
        return response as Promise<SoundCloudWebProfile[]>
    }

    /**
     * Searches for users (web scraping)
     */
    public scrape = async (query: string) => {
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}
        const html = await axios.get(`https://soundcloud.com/search/people?q=${query}`, {headers}).then((r) => r.data)
        const urls = html.match(/(?<=<li><h2><a href=")(.*?)(?=">)/gm)?.map((u: any) => `https://soundcloud.com${u}`)
        if (!urls) return []
        const scrape: any = []
        for (let i = 0; i < urls.length; i++) {
            const songHTML = await axios.get(urls[i], {headers}).then((r: any) => r.data)
            const data = JSON.parse(songHTML.match(/(\[{"id")(.*?)(?=\);)/)?.[0])
            const user = data[4].data[0]
            scrape.push(user)
        }
        return scrape as Promise<SoundCloudUser[]>
    }

    /**
     * Gets a user by URL (web scraping)
     */
    public getURL = async (url: string) => {
        if (!url.startsWith("https://soundcloud.com/")) url = `https://soundcloud.com/${url}`
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}
        const songHTML = await axios.get(url, {headers}).then((r: any) => r.data)
        const data = JSON.parse(songHTML.match(/(\[{"id")(.*?)(?=\);)/)?.[0])
        const user = data[4].data[0]
        return user as Promise<SoundCloudUser>
    }

}
