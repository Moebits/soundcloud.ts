import {assert} from "chai"
import "mocha"
import {soundcloud} from "./login"

describe("Comments", function () {
    it("should get a comment", async function () {
        const response = await soundcloud.comments.get(1916574994)
        assert(Object.prototype.hasOwnProperty.call(response, "body"))
    })
})
