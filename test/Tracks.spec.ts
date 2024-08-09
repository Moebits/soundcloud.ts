import {assert} from "chai"
import "mocha"
import {soundcloud} from "./login"

describe("Tracks", function () {
    it("should get a track", async function () {
        const response = await soundcloud.tracks.getV2("https://soundcloud.com/nocopyrightsounds/jonth-soundclash-ncs-release")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })

    it("should search tracks", async function () {
        const response = await soundcloud.tracks.searchV2({q: "virtual riot"})
        assert(Object.prototype.hasOwnProperty.call(response.collection[0], "description"))
    })
})
