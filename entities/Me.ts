import api from "../API"
import {SoundCloudActivityCollection, SoundCloudConnection, SoundCloudUser} from "../types"
import {Users} from "./index"

export class Me {
    private readonly users = new Users(this.api)
    public constructor(private readonly api: api) {}

    /**
     * Gets your own profile, or your ID if pass in a true param.
     */
    public get = async <B extends boolean>(returnID?: B): Promise<B extends true ? number : SoundCloudUser> => {
        const response = await this.api.get(`/me`)
        if (returnID) return response.id
        return response
    }

    /**
     * Gets activities from your homepage.
     */
    public activities = async () => {
        const response = await this.api.get(`/me/activities`)
        return response as Promise<SoundCloudActivityCollection>
    }

    /**
     * Gets affiliated activities.
     */
    public activitiesAffiliated = async () => {
        const response = await this.api.get(`/me/activities/tracks/affiliated`)
        return response as Promise<SoundCloudActivityCollection>
    }

    /**
     * Gets exclusive activities.
     */
    public activitiesExclusive = async () => {
        const response = await this.api.get(`/me/activities/tracks/exclusive`)
        return response as Promise<SoundCloudActivityCollection>
    }

    /**
     * Gets your own activities only.
     */
    public activitiesOwn = async () => {
        const response = await this.api.get(`/me/activities/all/own`)
        return response as Promise<SoundCloudActivityCollection>
    }

    /**
     * Gets your app connections, id any.
     */
    public connections = async () => {
        const id = await this.get(true)
        const response = await this.api.get(`/me/connections`)
        return response as Promise<SoundCloudConnection[]>
    }

    /**
     * Gets a connection from its ID.
     */
    public connection = async (connectionID: number) => {
        const id = await this.get(true)
        const response = await this.api.get(`/me/connections/${connectionID}`)
        return response as Promise<SoundCloudConnection>
    }

    public tracks = async () => {
        const id = await this.get(true)
        return this.users.tracks(id)
    }

    public comments = async () => {
        const id = await this.get(true)
        return this.users.comments(id)
    }

    public favorites = async () => {
        const id = await this.get(true)
        return this.users.favorites(id)
    }

    public favorite = async (userResolvable: string | number) => {
        const id = await this.get(true)
        return this.users.favorite(id, userResolvable)
    }

    public followers = async () => {
        const id = await this.get(true)
        return this.users.followers(id)
    }

    public follower = async (userResolvable: string | number) => {
        const id = await this.get(true)
        return this.users.follower(id, userResolvable)
    }

    public followings = async () => {
        const id = await this.get(true)
        return this.users.followings(id)
    }

    public following = async (userResolvable: string | number) => {
        const id = await this.get(true)
        return this.users.following(id, userResolvable)
    }

    public playlists = async () => {
        const id = await this.get(true)
        return this.users.playlists(id)
    }

    public webProfiles = async () => {
        const id = await this.get(true)
        return this.users.webProfiles(id)
    }

}
