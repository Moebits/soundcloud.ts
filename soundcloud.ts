import type { SoundcloudOptions } from "./types"
import api from "./API"
import { Apps, Comments, Me, Oembed, Playlists, Resolve, Tracks, Users, Util } from "./entities/index"

/**
 * The main class for interacting with the Soundcloud API.
 */
export default class Soundcloud {
    public static clientId?: string
    public static oauthToken?: string
    public static proxy?: string
    public api: api
    public tracks: Tracks
    public users: Users
    public playlists: Playlists
    public oembed: Oembed
    public resolve: Resolve
    public me: Me
    public comments: Comments
    public apps: Apps
    public util: Util
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
        this.api = new api(Soundcloud.clientId, Soundcloud.oauthToken, Soundcloud.proxy)
        this.tracks = new Tracks(this.api)
        this.users = new Users(this.api)
        this.playlists = new Playlists(this.api)
        this.oembed = new Oembed(this.api)
        this.resolve = new Resolve(this.api)
        this.me = new Me(this.api)
        this.comments = new Comments(this.api)
        this.apps = new Apps(this.api)
        this.util = new Util(this.api)
    }
}

module.exports.default = Soundcloud
export * from "./entities/index"
export * from "./types/index"
