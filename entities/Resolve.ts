import { Base } from "."
import { request } from "undici"

export class Resolve extends Base {
    /**
     * @deprecated
     * Gets the ID of a user/playlist/track from the Soundcloud URL.
     */
    public get = async (resolvable: string | number, full?: boolean) => {
        if (!String(resolvable).match(/\d{8,}/) && !String(resolvable).includes("soundcloud")) {
            resolvable = `https://soundcloud.com/${resolvable}`
        }
        let id = resolvable
        if (String(resolvable).includes("soundcloud")) {
            const resolved = await this.api.get("resolve", { url: resolvable })
            if (full) return resolved
            id = resolved.id
        }
        return id
    }

    /**
     * Gets the ID from the html source.
     */
    public getAlt = async (resolvable: string | number) => {
        if (!String(resolvable).match(/\d{8,}/) && !String(resolvable).includes("soundcloud")) {
            resolvable = `https://soundcloud.com/${resolvable}`
        }
        let id = resolvable
        if (String(resolvable).includes("soundcloud")) {
            const html = await request(String(resolvable), { headers: this.api.headers }).then(r => r.body.text())
            const data = JSON.parse(html.match(/(\[{"id")(.*?)(?=\);)/)?.[0])
            id = data[data.length - 1]?.data?.[0]?.id ? data[data.length - 1].data[0].id : data[data.length - 2].data[0].id
        }
        return id
    }

    /**
     * Gets the ID of a user/playlist/track from the Soundcloud URL using the v2 API.
     */
    public getV2 = async (resolvable: string | number, full?: boolean) => {
        if (!String(resolvable).match(/\d{8,}/) && !String(resolvable).includes("soundcloud")) {
            resolvable = `https://soundcloud.com/${resolvable}`
        }
        let id = resolvable
        if (String(resolvable).includes("soundcloud")) {
            const resolved = await this.api.getV2("resolve", { url: resolvable })
            if (full) return resolved
            id = resolved.id
        }
        return id
    }
}
