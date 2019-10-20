import api from "../API"

export class Oembed {
    public constructor(private readonly api: api) {}

    public get = async (params: any) => {
        const response = await this.api.get(`/oembed`, params)
        return response
    }
}
