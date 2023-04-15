import { Base } from "."
import type { SoundcloudOembed, SoundcloudOembedFilter } from "../types"

export class Oembed extends Base {
    /**
     * Gets the Oembed for a track, playlist, or user.
     */
    public get = async (params: SoundcloudOembedFilter) => {
        const response = await this.api.getWebsite("/oembed", params)
        return response as Promise<SoundcloudOembed>
    }
}
