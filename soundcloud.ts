import {API} from "./API"
import {Apps, Comments, Me, Oembed, Playlists, Resolve, Tracks, Users, Util} from "./entities"

/**
 * The main class for interacting with the Soundcloud API.
 */
export class Soundcloud {
    public static clientId?: string
    public static oauthToken?: string
    public static proxy?: string
    public api = new API(Soundcloud.clientId, Soundcloud.oauthToken)
    public apps = new Apps(this.api)
    public comments = new Comments(this.api)
    public me = new Me(this.api)
    public oembed = new Oembed(this.api)
    public playlists = new Playlists(this.api)
    public resolve = new Resolve(this.api)
    public tracks = new Tracks(this.api)
    public users = new Users(this.api)
    public util = new Util(this.api)
    public constructor(clientId?: string, oauthToken?: string, options?: {proxy?: string}) {
        if (clientId) {
            Soundcloud.clientId = clientId
            if (oauthToken) Soundcloud.oauthToken = oauthToken
        }
        if (options?.proxy) Soundcloud.proxy = options.proxy
        this.api = new API(Soundcloud.clientId, Soundcloud.oauthToken, Soundcloud.proxy)
        this.apps = new Apps(this.api)
        this.comments = new Comments(this.api)
        this.me = new Me(this.api)
        this.oembed = new Oembed(this.api)
        this.playlists = new Playlists(this.api)
        this.resolve = new Resolve(this.api)
        this.tracks = new Tracks(this.api)
        this.users = new Users(this.api)
        this.util = new Util(this.api)
    }
}

export * from "./entities"
export * from "./types"
export * from "./API"
export default Soundcloud
module.exports.default = Soundcloud
