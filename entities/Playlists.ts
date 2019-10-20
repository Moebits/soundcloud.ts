import api from "../API"
import {Resolve} from "./index"
interface SoundCloudPlaylistFilter {
    representation: "compact" | "id"
    q: string
}

export class Playlists {
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: api) {}

    public search = async (params?: SoundCloudPlaylistFilter) => {
        const response = await this.api.get(`/playlists`, params)
        return response
    }

    public get = async (playlistResolvable: string | number) => {
        const playlistID = await this.resolve.get(playlistResolvable, true)
        if (playlistID.hasOwnProperty("id")) return playlistID
        const response = await this.api.get(`/playlists/${playlistID}`)
        return response
    }

    public secretToken = async (playlistResolvable: string | number) => {
        const playlistID = await this.resolve.get(playlistResolvable)
        const response = await this.api.get(`/playlists/${playlistID}/secret-token`)
        .catch(() => Promise.reject("Oauth Token is required for this endpoint."))
        return response
    }
}
