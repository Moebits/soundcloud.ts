import api from "../API"

export class Users {
    constructor(private readonly api: api) {}

    public search = async (query: string) => {
        const response = await this.api.get(`/users`, {q: query})
        return response
    }

    public get = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable, true)
        if (userID.hasOwnProperty("id")) return userID
        const response = await this.api.get(`/users/${userID}`)
        return response
    }

    public tracks = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/users/${userID}/tracks`)
        return response
    }

    public playlists = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/users/${userID}/playlists`)
        return response
    }

    public followings = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/users/${userID}/followings`)
        return response
    }

    public following = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const followingID = await this.api.resolve(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followings/${followingID}`)
        return response
    }

    public followers = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/users/${userID}/followers`)
        return response
    }

    public follower = async (userResolvable: string | number, anotherUserResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const followerID = await this.api.resolve(anotherUserResolvable)
        const response = await this.api.get(`/users/${userID}/followers/${followerID}`)
        return response
    }

    public comments = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/users/${userID}/comments`)
        return response
    }

    public favorites = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/users/${userID}/favorites`)
        return response
    }

    public favorite = async (userResolvable: string | number, trackResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const trackID = await this.api.resolve(trackResolvable)
        const response = await this.api.get(`/users/${userID}/favorites/${trackID}`)
        return response
    }

    public webProfiles = async (userResolvable: string | number) => {
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/users/${userID}/web-profiles`)
        return response
    }

}
