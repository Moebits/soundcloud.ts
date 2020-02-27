import api from "../API"
import {SoundCloudPlaylist, SoundCloudPlaylistFilter, SoundCloudSecretToken} from "../types"
import {Resolve} from "./index"

export class Playlists {
    private readonly resolve = new Resolve(this.api)
    public constructor(private readonly api: api) {}

    /**
     * Searches for playlists.
     */
    public search = async (params?: SoundCloudPlaylistFilter) => {
        const response = await this.api.get(`/playlists`, params)
        return response as Promise<SoundCloudPlaylist[]>
    }

    /**
     * Fetches a playlist from URL or ID.
     */
    public get = async (playlistResolvable: string | number) => {
        const playlistID = await this.resolve.get(playlistResolvable, true)
        if (playlistID.hasOwnProperty("id")) return playlistID
        const response = await this.api.get(`/playlists/${playlistID}`)
        return response as Promise<SoundCloudPlaylist>
    }

    /**
     * Requires Authentication - Gets the secret token from one of your playlists.
     */
    public secretToken = async (playlistResolvable: string | number) => {
        const playlistID = await this.resolve.get(playlistResolvable)
        const response = await this.api.get(`/playlists/${playlistID}/secret-token`)
        .catch(() => Promise.reject("Oauth Token is required for this endpoint."))
        return response as Promise<SoundCloudSecretToken>
    }
}
