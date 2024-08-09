import type {SoundcloudAppV2} from "../types"
import {API} from "../API"

export class Apps {
    public constructor(private readonly api: API) {}

    /**
     * Gets Soundcloud apps, using the Soundcloud v2 API.
     */
    public getV2 = async () => {
        const response = await this.api.getV2("/apps")
        return response as Promise<SoundcloudAppV2>
    }
}