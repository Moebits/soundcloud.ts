import { assert } from "chai"
import "mocha"
import { soundcloud } from "./login"

describe("Tracks", function () {
    it("should get a track", async function () {
        const response = await soundcloud.tracks.getV2("https://soundcloud.com/kenny_the_king/lemonade")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })

    it("should search tracks", async function () {
        const response = await soundcloud.tracks.searchV2({ q: "virtual riot" })
        assert(Object.prototype.hasOwnProperty.call(response.collection[0], "description"))
    })

    it.skip("should get track comments", async function () {
        const response = await soundcloud.tracks.comments("https://soundcloud.com/kenny_the_king/lemonade")
        assert(Object.prototype.hasOwnProperty.call(response[0], "body"))
    })

    it.skip("should get a comment", async function () {
        const response = await soundcloud.tracks.comment("https://soundcloud.com/tenpimusic/snowflake", 577938945)
        assert(Object.prototype.hasOwnProperty.call(response, "body"))
    })

    it.skip("should get favoriters", async function () {
        const response = await soundcloud.tracks.favoriters("https://soundcloud.com/tenpimusic/kudasai")
        assert(Object.prototype.hasOwnProperty.call(response[0], "description"))
    })

    /* 401 Error - Possibly bug with soundcloud.
    it("should get a favoriter", async function() {
        const response = await soundcloud.tracks.favoriter("https://soundcloud.com/inf1n1temusic/inf1n1tea-konus-nova1", "tenpimusic")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })*/

    it.skip("should get a secret token", async function () {
        const response = await soundcloud.tracks.secretToken("https://soundcloud.com/tenpimusic/kudasai")
        assert(Object.prototype.hasOwnProperty.call(response, "token"))
    })
})
