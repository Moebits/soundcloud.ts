import {assert} from "chai"
import "mocha"
import {soundcloud} from "./login"

describe.skip("Apps", function () {
    it("should get apps", async function () {
        const response = await soundcloud.apps.getV2()
        assert(Object.prototype.hasOwnProperty.call(response.collection[0], "creator"))
    })
})
