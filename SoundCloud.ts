import api from "./API"
import {Tracks} from "./entities/index"

const publicID = "BeGVhOrGmfboy1LtiHTQF6Ejpt9ULJCI"

export default class SoundCloud {
    public clientID: string
    public oauthToken: string
    public api = new api(this.clientID, this.oauthToken)
    public tracks = new Tracks(this.api)
    public constructor(clientID?: string, oauthToken?: string) {
        if (clientID) {
            this.clientID = clientID
            if (oauthToken) this.oauthToken = oauthToken
        } else {
            this.clientID = publicID
        }
        this.api = new api(this.clientID, this.oauthToken)
        this.tracks = new Tracks(this.api)
    }
}

module.exports.default = SoundCloud
export * from "./entities/index"
export * from "./types/index"
