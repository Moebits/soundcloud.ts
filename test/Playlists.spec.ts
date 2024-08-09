import {assert} from "chai"
import "mocha"
import {soundcloud} from "./login"

describe("Playlists", function () {
    it("should get a playlist", async function () {
        const response = await soundcloud.playlists.getV2("https://soundcloud.com/yourparadis/sets/jazz-hip-4-1")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })

    it("should search for playlists", async function () {
        const response = await soundcloud.playlists.searchV2({ q: "playlist", limit: 5 })
        assert(Object.prototype.hasOwnProperty.call(response.collection[0], "description"))
    })

    it.skip("should get a secret token", async function () {
        const response = await soundcloud.playlists.secretToken("https://soundcloud.com/tenpimusic/sets/my-songs")
        assert(Object.prototype.hasOwnProperty.call(response, "token"))
    })
})
