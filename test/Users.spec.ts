import {assert} from "chai"
import "mocha"
import {soundcloud} from "./login"

describe("Users", function () {
    it("should get a user", async function () {
        const response = await soundcloud.users.get("https://soundcloud.com/yourparadis")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })

    it("should search for users", async function () {
        const response = await soundcloud.users.search({ q: "virtual riot" })
        assert(Object.prototype.hasOwnProperty.call(response.collection[0], "description"))
    })

    it("should get user tracks", async function () {
        const response = await soundcloud.users.tracks("https://soundcloud.com/5tereomanjpn")
        assert(Object.prototype.hasOwnProperty.call(response[0], "description"))
    })

    it("should get user likes", async function () {
        const response = await soundcloud.users.likes("https://soundcloud.com/yourparadis")
        assert(Object.prototype.hasOwnProperty.call(response[0], "title"))
    })

    it("should get a users web profiles", async function () {
        const response = await soundcloud.users.webProfiles("https://soundcloud.com/yourparadis")
        assert(Object.prototype.hasOwnProperty.call(response[0], "url"))
    })
})
