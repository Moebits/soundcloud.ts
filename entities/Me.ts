import type { SoundcloudActivityCollection, SoundcloudConnection, SoundcloudUser } from "../types"
import { Base } from "."

export class Me extends Base {
    /**
     * @deprecated use getV2
     * Gets your own profile, or your ID if pass in a true param.
     */
    public get = async <B extends boolean>(returnID?: B): Promise<B extends true ? number : SoundcloudUser> => {
        const response = await this.api.get("/me")
        if (returnID) return response.id
        return response
    }

    /**
     * Gets your own profile, using the Soundcloud v2 API.
     */
    public getV2 = async () => {
        const response = await this.api.getV2("/me")
        return response as Promise<SoundcloudUser>
    }

    /**
     * @deprecated
     * Gets activities from your homepage.
     */
    public activities = async () => {
        const response = await this.api.get("/me/activities")
        return response as Promise<SoundcloudActivityCollection>
    }

    /**
     * @deprecated
     * Gets affiliated activities.
     */
    public activitiesAffiliated = async () => {
        const response = await this.api.get("/me/activities/tracks/affiliated")
        return response as Promise<SoundcloudActivityCollection>
    }

    /**
     * @deprecated
     * Gets exclusive activities.
     */
    public activitiesExclusive = async () => {
        const response = await this.api.get("/me/activities/tracks/exclusive")
        return response as Promise<SoundcloudActivityCollection>
    }

    /**
     * @deprecated
     * Gets your own activities only.
     */
    public activitiesOwn = async () => {
        const response = await this.api.get("/me/activities/all/own")
        return response as Promise<SoundcloudActivityCollection>
    }

    /**
     * @deprecated
     * Gets your app connections, id any.
     */
    public connections = async () => {
        const response = await this.api.get("/me/connections")
        return response as Promise<SoundcloudConnection[]>
    }

    /**
     * @deprecated
     * Gets a connection from its ID.
     */
    public connection = async (connectionID: number) => {
        const response = await this.api.get(`/me/connections/${connectionID}`)
        return response as Promise<SoundcloudConnection>
    }

    /**
     * @deprecated
     * Gets your tracks.
     */
    public tracks = async () => {
        const id = await this.get(true)
        return this.sc.users.tracks(id)
    }

    /**
     * @deprecated
     * Gets your comments.
     */
    public comments = async () => {
        const id = await this.get(true)
        return this.sc.users.comments(id)
    }

    /**
     * @deprecated
     * Gets your favorites.
     */
    public favorites = async () => {
        const id = await this.get(true)
        return this.sc.users.favorites(id)
    }

    /**
     * @deprecated
     * Gets a favorite.
     */
    public favorite = async (userResolvable: string | number) => {
        const id = await this.get(true)
        return this.sc.users.favorite(id, userResolvable)
    }

    /**
     * @deprecated
     * Gets your followers.
     */
    public followers = async () => {
        const id = await this.get(true)
        return this.sc.users.followers(id)
    }

    /**
     * @deprecated
     * Gets a follower.
     */
    public follower = async (userResolvable: string | number) => {
        const id = await this.get(true)
        return this.sc.users.follower(id, userResolvable)
    }

    /**
     * @deprecated
     * Gets your followings.
     */
    public followings = async () => {
        const id = await this.get(true)
        return this.sc.users.followings(id)
    }

    /**
     * @deprecated
     * Gets a following.
     */
    public following = async (userResolvable: string | number) => {
        const id = await this.get(true)
        return this.sc.users.following(id, userResolvable)
    }

    /**
     * @deprecated
     * Gets your playlists.
     */
    public playlists = async () => {
        const id = await this.get(true)
        return this.sc.users.playlists(id)
    }

    /**
     * @deprecated
     * Gets your social networking profiles.
     */
    public webProfiles = async () => {
        const id = await this.get(true)
        return this.sc.users.webProfiles(id)
    }
}
