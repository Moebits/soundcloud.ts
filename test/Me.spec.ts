import { assert } from "chai"
import "mocha"
import { soundcloud } from "./login"

describe.skip("Me", function () {
    it("should get activities", async function () {
        const response = await soundcloud.me.activities()
        assert(Object.prototype.hasOwnProperty.call(response, "collection"))
    })

    it("should get affiliated activities", async function () {
        const response = await soundcloud.me.activitiesAffiliated()
        assert(Object.prototype.hasOwnProperty.call(response, "collection"))
    })

    it("should get exclusive activities", async function () {
        const response = await soundcloud.me.activitiesExclusive()
        assert(Object.prototype.hasOwnProperty.call(response, "collection"))
    })

    it("should get own activities", async function () {
        const response = await soundcloud.me.activitiesOwn()
        assert(Object.prototype.hasOwnProperty.call(response, "collection"))
    })

    it("should get connections", async function () {
        const response = await soundcloud.me.connections()
        assert(typeof response !== "undefined")
    })
})
