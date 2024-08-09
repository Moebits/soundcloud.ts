import type {SoundcloudComment} from "../types"
import {API} from "../API"

export class Comments {
    public constructor(private readonly api: API) {}
    
    /**
     * Gets a comment from its ID, using the Soundcloud v2 API.
     */
    public getV2 = async (commentID: number) => {
        const response = await this.api.getV2(`/comments/${commentID}`)
        return response as Promise<SoundcloudComment>
    }
}
