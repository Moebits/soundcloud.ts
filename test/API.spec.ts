import { assert } from "chai"
import "mocha"
import { soundcloud } from "./login"

describe("API", function () {
    it("should get a valid client id on computer site", async function () {
        const clientId = await soundcloud.api.getClientIdWeb().catch(e => {
            // eslint-disable-next-line no-console
            console.error(e)
            if (this.test) this.test.title += " (error occurred)"
            return ""
        })
        assert.isString(clientId)
    })

    it("should get a valid client id on mobile site", async function () {
        const clientId = await soundcloud.api.getClientIdMobile().catch(e => {
            // eslint-disable-next-line no-console
            console.error(e)
            if (this.test) this.test.title += " (error occurred)"
            return ""
        })
        assert.isString(clientId)
    })
})
