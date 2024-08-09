import {assert} from "chai"
import "mocha"
import {soundcloud} from "./login"

describe("Oembed", function () {
    it("should get an oembed", async function () {
        const response = await soundcloud.oembed.get({url: "https://soundcloud.com/official-kaijo/space-junk"})
        assert(typeof response === "string")
    })
})
