import type { SoundcloudApp, SoundcloudAppV2 } from "../types"
import { Base } from "./Base"

export class Apps extends Base {
    /**
     * @deprecated use getV2
     * Gets Soundcloud apps.
     */
    public get = async () => {
        const response = await this.api.get("/apps")
        return response as Promise<SoundcloudApp[]>
    }
    /**
     * Gets Soundcloud apps, using the Soundcloud v2 API.
     */
    public getV2 = async () => {
        const response = await this.api.getV2("/apps")
        return response as Promise<SoundcloudAppV2>
    }
}
