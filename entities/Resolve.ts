import api from "../API"

export class Resolve {
    public constructor(private readonly api: api) {}

    public get = async (resolvable: string | number, full?: boolean) => {
        let id = resolvable
        if (String(resolvable).includes("soundcloud")) {
            const resolved = await this.api.get(`resolve`, {url: resolvable})
            if (full) return resolved
            id = resolved.id
        }
        return id
    }
}
