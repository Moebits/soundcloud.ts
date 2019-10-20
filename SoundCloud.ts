import api from "./API"
import {Tracks, Users, Playlists, Oembed, Resolve, Me, Comments, Apps} from "./entities/index"

const publicID = "BeGVhOrGmfboy1LtiHTQF6Ejpt9ULJCI"

export default class Soundcloud {
    public static clientID: string
    public static oauthToken: string
    public api = new api(Soundcloud.clientID, Soundcloud.oauthToken)
    public tracks = new Tracks(this.api)
    public users = new Users(this.api)
    public playlists = new Playlists(this.api)
    public oembed = new Oembed(this.api)
    public resolve = new Resolve(this.api)
    public me = new Me(this.api)
    public comments = new Comments(this.api)
    public apps = new Apps(this.api)
    public constructor(clientID?: string, oauthToken?: string) {
        if (clientID) {
            Soundcloud.clientID = clientID
            if (oauthToken) Soundcloud.oauthToken = oauthToken
        } else {
            Soundcloud.clientID = publicID
        }
        this.api = new api(Soundcloud.clientID, Soundcloud.oauthToken)
        this.tracks = new Tracks(this.api)
        this.users = new Users(this.api)
        this.playlists = new Playlists(this.api)
        this.oembed = new Oembed(this.api)
        this.resolve = new Resolve(this.api)
        this.me = new Me(this.api)
        this.comments = new Comments(this.api)
        this.apps = new Apps(this.api)    
    }
}

module.exports.default = Soundcloud
export * from "./entities/index"
export * from "./types/index"
