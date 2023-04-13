import type api from "../API"
import type { SoundcloudComment } from "../types"

export class Comments {
    public constructor(private readonly api: api) {}

    /**
     * @deprecated use getV2
     * Gets a comment using its ID.
     */
    public get = async (commentID: number) => {
        const response = await this.api.get(`/comments/${commentID}`)
        return response as Promise<SoundcloudComment>
    }

    /**
     * Gets a comment from its ID, using the Soundcloud v2 API.
     */
    public getV2 = async (commentID: number) => {
        const response = await this.api.getV2(`/comments/${commentID}`)
        return response as Promise<SoundcloudComment>
    }
}
