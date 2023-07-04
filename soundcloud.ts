import type { SoundcloudOptions } from "./types"
import { API } from "./API"
import { Apps, Comments, Me, Oembed, Playlists, Resolve, Tracks, Users, Util } from "./entities"

/**
 * The main class for interacting with the Soundcloud API.
 */
export class Soundcloud {
    public static clientId?: string
    public static oauthToken?: string
    public static proxy?: string
    public api: API
    public apps = new Apps(this)
    public comments = new Comments(this)
    public me = new Me(this)
    public oembed = new Oembed(this)
    public playlists = new Playlists(this)
    public resolve = new Resolve(this)
    public tracks = new Tracks(this)
    public users = new Users(this)
    public util = new Util(this)
    public constructor(options?: SoundcloudOptions)
    /**
     * @deprecated Use `new Soundcloud({ clientId, oauthToken, proxy })` instead.
     */
    public constructor(clientId?: string, oauthToken?: string, options?: { proxy?: string })
    public constructor(clientId?: string | SoundcloudOptions, oauthToken?: string, options?: { proxy?: string }) {
        const opts: SoundcloudOptions = {}
        if (typeof clientId === "string") {
            // eslint-disable-next-line no-console
            console.warn("`Soundcloud(clientId, oauthToken, options)` is deprecated. Use `Soundcloud({ clientId, oauthToken, proxy })` instead.")
            opts.clientId = clientId
            opts.oauthToken = oauthToken
            opts.proxy = options?.proxy
        } else {
            Object.assign(opts, clientId)
        }
        if (opts.clientId) {
            Soundcloud.clientId = opts.clientId
            if (opts.oauthToken) Soundcloud.oauthToken = opts.oauthToken
        }
        if (opts.proxy) Soundcloud.proxy = opts.proxy
        this.api = new API(Soundcloud.clientId, Soundcloud.oauthToken, Soundcloud.proxy)
    }
}

export * from "./entities"
export * from "./types"
export * from "./API"
export default Soundcloud
module.exports.default = Soundcloud
