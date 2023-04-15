import type { SoundcloudOptions } from "./types"
import API from "./API"
import { Apps, Comments, Me, Oembed, Playlists, Resolve, Tracks, Users, Util } from "./entities"

/**
 * The main class for interacting with the Soundcloud API.
 */
export default class Soundcloud {
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
     * @param clientID The client ID of your app
     * @param oauthToken The oauth token of the user
     * @param options The options for the client
     * @param options.proxy The proxy to use for requests
     * @deprecated Use `new Soundcloud({ clientId, oauthToken, proxy })` instead.
     */
    public constructor(clientID?: string, oauthToken?: string, options?: { proxy?: string })
    /**
     * @param options The options for the client
     * @param options.clientId The client ID of your app
     * @param options.oauthToken The oauth token of the user
     * @param options.proxy The proxy to use for requests
     */
    public constructor(options?: SoundcloudOptions)
    public constructor(clientID?: string | SoundcloudOptions, oauthToken?: string, options?: { proxy?: string }) {
        const opts: SoundcloudOptions = {}
        if (typeof clientID === "string") {
            // eslint-disable-next-line no-console
            console.warn("`Soundcloud(clientID, oauthToken, options)` is deprecated. Use `Soundcloud({ clientId, oauthToken, proxy })` instead.")
            opts.clientId = clientID
            opts.oauthToken = oauthToken
            opts.proxy = options?.proxy
        }
        if (opts.clientId) {
            Soundcloud.clientId = opts.clientId
            if (opts.oauthToken) Soundcloud.oauthToken = opts.oauthToken
        }
        if (opts.proxy) Soundcloud.proxy = opts.proxy
        this.api = new API(Soundcloud.clientId, Soundcloud.oauthToken, Soundcloud.proxy)
    }
}

module.exports.default = Soundcloud
export * from "./entities"
export * from "./types"
