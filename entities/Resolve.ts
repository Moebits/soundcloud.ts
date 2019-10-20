import api from "../API"

export class Resolve {
    public constructor(private readonly api: api) {}

    /**
     * Gets the ID of a user/playlist/track from the soundcloud URL.
     */
    public get = async (resolvable: string | number, full?: boolean) => {
        if (!String(resolvable).match(/\d{8,}/) && !String(resolvable).includes("soundcloud")) {
            resolvable = `https://soundcloud.com/${resolvable}`
        }
        let id = resolvable
        if (String(resolvable).includes("soundcloud")) {
            const resolved = await this.api.get(`resolve`, {url: resolvable})
            if (full) return resolved
            id = resolved.id
        }
        return id
    }
}
