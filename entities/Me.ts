import type {SoundcloudUser} from "../types"
import {Base} from "."

export class Me extends Base {
    /**
     * Gets your own profile, using the Soundcloud v2 API.
     */
    public getV2 = async () => {
        const response = await this.api.getV2("/me")
        return response as Promise<SoundcloudUser>
    }
}
