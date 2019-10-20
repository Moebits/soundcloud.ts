import api from "../API"
import {SoundCloudComment, SoundCloudPlaylist, SoundCloudTrack, SoundCloudUser, SoundCloudUserCollection,
SoundCloudUserFilter, SoundCloudWebProfile} from "../types"
import {Resolve} from "./index"

export class Users {
    private readonly resolve = new Resolve(this.api)
    constructor(private readonly api: api) {}

    public search = async (params?: SoundCloudUserFilter) => {
        const response = await this.api.get(`/users`, params)
        return response as Promise<SoundCloudUser[]>
    }

    public get = async (userResolvable: string | number): Promise<SoundCloudUser> => {
        const userID = await this.resolve.get(userResolvable, true)
        if (userID.hasOwnProperty("id")) return userID
        const response = await this.api.get(`/users/${userID}`)
        return response
    }

    public tracks = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/tracks`)
        return response as Promise<SoundCloudTrack[]>
    }

    public playlists = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/playlists`)
        return response as Promise<SoundCloudPlaylist[]>
    }

    public followings = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/followings`)
        return response as Promise<SoundCloudUserCollection>
    }

    public following = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const followingID = await this.resolve.get(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followings/${followingID}`)
        return response as Promise<SoundCloudUser>
    }

    public followers = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/followers`)
        return response as Promise<SoundCloudUserCollection>
    }

    public follower = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const followerID = await this.resolve.get(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followers/${followerID}`)
        return response as Promise<SoundCloudUser>
    }

    public comments = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/comments`)
        return response as Promise<SoundCloudComment[]>
    }

    public favorites = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/favorites`)
        return response as Promise<SoundCloudTrack[]>
    }

    public favorite = async (userResolvable: string | number, trackResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.get(`/users/${userID}/favorites/${trackID}`)
        return response as Promise<SoundCloudTrack>
    }

    public webProfiles = async (userResolvable: string | number) => {
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/users/${userID}/web-profiles`)
        return response as Promise<SoundCloudWebProfile[]>
    }

}
