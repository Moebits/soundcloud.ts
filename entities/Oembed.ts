import api from "../API"
import {SoundCloudOembed, SoundCloudOembedFilter} from "../types"

export class Oembed {
    public constructor(private readonly api: api) {}

    public get = async (params: SoundCloudOembedFilter) => {
        const response = await this.api.getWebsite(`/oembed`, params)
        return response as Promise<SoundCloudOembed>
    }
}
