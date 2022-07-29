import api from "./API"
import {Apps, Comments, Me, Oembed, Playlists, Resolve, Tracks, Users, Util} from "./entities/index"

/**
 * The main class for interacting with the Soundcloud API.
 */
export default class Soundcloud {
    public static clientID?: string
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
    public constructor(clientID?: string, oauthToken?: string, options?: {proxy?: string }) {
        if (clientID) {
            Soundcloud.clientID = clientID
            if (oauthToken) Soundcloud.oauthToken = oauthToken
        }
        if (options?.proxy) Soundcloud.proxy = options.proxy
        this.api = new api(Soundcloud.clientID, Soundcloud.oauthToken, Soundcloud.proxy)
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
