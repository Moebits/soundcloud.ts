import api from "../API"

export class Comments {
    public constructor(private readonly api: api) {}

    public get = async (commentID: number) => {
        const response = await this.api.get(`/comments/${commentID}`)
        return response
    }
}
