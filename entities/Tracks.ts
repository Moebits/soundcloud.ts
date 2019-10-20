import api from "../API"
import {SoundCloudTrack, SoundCloudTrackFilter} from "../types"

export class Tracks {
    public constructor(private readonly api: api) {}

    public search = async (params: SoundCloudTrackFilter) => {
        const response = await this.api.get(`/tracks`, params)
        return response
    }

    public get = async (trackResolvable: string | number) => {
        const id = await this.api.resolve(trackResolvable, true)
        if (id.hasOwnProperty("id")) return id
        const response = await this.api.get(`/tracks/${id}`)
        return response as Promise<SoundCloudTrack>
    }

    public comments = async (trackResolvable: string | number) => {
        const trackID = await this.api.resolve(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/comments`)
        return response
    }

    public comment = async (trackResolvable: string | number, commentID: number) => {
        const trackID = await this.api.resolve(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/comments/${commentID}`)
        return response
    }

    public favoriters = async (trackResolvable: string | number) => {
        const trackID = await this.api.resolve(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/favoriters`)
        return response
    }

    public favoriter = async (trackResolvable: string | number, userResolvable: string | number) => {
        const trackID = await this.api.resolve(trackResolvable)
        const userID = await this.api.resolve(userResolvable)
        const response = await this.api.get(`/tracks/${trackID}/favoriters/${userID}`)
        return response
    }

    public secretToken = async (trackResolvable: string | number) => {
        const trackID = await this.api.resolve(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/secret-token`)
        .catch(() => Promise.reject("Oauth Token is required for this endpoint."))
        return response
    }

}
