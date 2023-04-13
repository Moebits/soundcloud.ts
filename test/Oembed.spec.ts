import { assert } from "chai"
import "mocha"
import { soundcloud } from "./login"

describe.skip("Oembed", function () {
    it("should get an oembed", async function () {
        const response = await soundcloud.oembed.get({ url: "https://soundcloud.com/official-kaijo/space-junk" })
        assert(Object.prototype.hasOwnProperty.call(response, "title"))
    })
})
