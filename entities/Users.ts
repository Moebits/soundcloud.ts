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
    public get = async (userResolvable: string | number): Promise<SoundCloudUser> => {
        const userID = await this.resolve.get(userResolvable, true)
        if (userID.hasOwnProperty("id")) return userID
        const response = await this.api.get(`/users/${userID}`)
        return response
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

}
