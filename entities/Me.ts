import api from "../API"
import {Users} from "./index"

export class Me {
    private readonly users = new Users(this.api)
    public constructor(private readonly api: api) {}

    public get = async (returnID?: boolean) => {
        const response = await this.api.get(`/me`)
        if (returnID) return response.id
        return response
    }

    public activities = async () => {
        const response = await this.api.get(`/me/activities`)
        return response
    }

    public activitiesAffiliated = async () => {
        const response = await this.api.get(`/me/activities/affiliated`)
        return response
    }

    public activitiesExclusive = async () => {
        const response = await this.api.get(`/me/activities/exclusive`)
        return response
    }

    public activitiesOwn = async () => {
        const response = await this.api.get(`/me/activities/all/own`)
        return response
    }

    public connections = async () => {
        const id = await this.get(true)
        const response = await this.api.get(`/me/${id}/connections`)
        return response
    }

    public connection = async (connectionID: number) => {
        const id = await this.get(true)
        const response = await this.api.get(`/me/${id}/connections/${connectionID}`)
        return response
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
