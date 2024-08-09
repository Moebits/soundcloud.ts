import type {SoundcloudOembed, SoundcloudOembedFilter} from "../types"
import {API} from "../API"

export class Oembed {
    public constructor(private readonly api: API) {}
    
    /**
     * Gets the Oembed for a track, playlist, or user.
     */
    public get = async (params: SoundcloudOembedFilter) => {
        const response = await this.api.getWebsite("/oembed", params)
        return response as Promise<string>
    }
}
