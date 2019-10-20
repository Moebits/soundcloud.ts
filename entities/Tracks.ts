import api from "../API"
import {SoundCloudComment, SoundCloudSecretToken, SoundCloudTrack, SoundCloudTrackFilter, SoundCloudUser} from "../types"
import {Resolve} from "./index"
export class Tracks {
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: api) {}

    public search = async (params?: SoundCloudTrackFilter) => {
        const response = await this.api.get(`/tracks`, params)
        return response
    }

    public get = async (trackResolvable: string | number): Promise<SoundCloudTrack> => {
        const id = await this.resolve.get(trackResolvable, true)
        if (id.hasOwnProperty("id")) return id
        const response = await this.api.get(`/tracks/${id}`)
        return response
    }

    public comments = async (trackResolvable: string | number) => {
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/comments`)
        return response as Promise<SoundCloudComment[]>
    }

    public comment = async (trackResolvable: string | number, commentID: number) => {
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/comments/${commentID}`)
        return response as Promise<SoundCloudComment>
    }

    public favoriters = async (trackResolvable: string | number) => {
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/favoriters`)
        return response as Promise<SoundCloudUser[]>
    }

    public favoriter = async (trackResolvable: string | number, userResolvable: string | number) => {
        const trackID = await this.resolve.get(trackResolvable)
        const userID = await this.resolve.get(userResolvable)
        const response = await this.api.get(`/tracks/${trackID}/favoriters/${userID}`)
        return response as Promise<SoundCloudUser>
    }

    public secretToken = async (trackResolvable: string | number) => {
        const trackID = await this.resolve.get(trackResolvable)
        const response = await this.api.get(`/tracks/${trackID}/secret-token`)
        .catch(() => Promise.reject("Oauth Token is required for this endpoint."))
        return response as Promise<SoundCloudSecretToken>
    }

}
