import api from "../API"
import {SoundCloudOembed, SoundCloudOembedFilter} from "../types"

export class Oembed {
    public constructor(private readonly api: api) {}

    /**
     * Gets the Oembed for a track, playlist, or user.
     */
    public get = async (params: SoundCloudOembedFilter) => {
        const response = await this.api.getWebsite(`/oembed`, params)
        return response as Promise<SoundCloudOembed>
    }
}
