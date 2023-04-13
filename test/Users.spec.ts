import { assert } from "chai"
import "mocha"
import { soundcloud } from "./login"

describe("Users", function () {
    it("should get a user", async function () {
        const response = await soundcloud.users.getV2("https://soundcloud.com/yourparadis")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })

    it("should search for users", async function () {
        const response = await soundcloud.users.searchV2({ q: "virtual riot" })
        assert(Object.prototype.hasOwnProperty.call(response.collection[0], "description"))
    })

    it.skip("should get user comments", async function () {
        const response = await soundcloud.users.comments("https://soundcloud.com/tenpimusic")
        assert(Object.prototype.hasOwnProperty.call(response[0], "body"))
    })

    it.skip("should get a user favorite", async function () {
        const response = await soundcloud.users.favorite(
            "https://soundcloud.com/tenpimusic",
            "https://soundcloud.com/inf1n1temusic/inf1n1tea-konus-nova1"
        )
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })

    it.skip("should get user favorites", async function () {
        const response = await soundcloud.users.favorites("https://soundcloud.com/tenpimusic")
        assert(Object.prototype.hasOwnProperty.call(response[0], "description"))
    })

    /* 401
    it("should get a user following", async function() {
        const response = await soundcloud.users.following("https://soundcloud.com/tenpimusic", "virtual-riot")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })
    */

    it.skip("should get user followings", async function () {
        const response = await soundcloud.users.followings("https://soundcloud.com/tenpimusic")
        assert(Object.prototype.hasOwnProperty.call(response, "collection"))
    })

    it.skip("should get user followers", async function () {
        const response = await soundcloud.users.followers("https://soundcloud.com/tenpimusic")
        assert(Object.prototype.hasOwnProperty.call(response, "collection"))
    })

    /* 401
    it("should get a user follower", async function() {
        const response = await soundcloud.users.follower("https://soundcloud.com/tenpimusic", "tenma1")
        assert(Object.prototype.hasOwnProperty.call(response, "description"))
    })
    */

    it("should get user tracks", async function () {
        const response = await soundcloud.users.tracksV2("https://soundcloud.com/kenny_the_king")
        assert(Object.prototype.hasOwnProperty.call(response[0], "description"))
    })

    it.skip("should get user playlists", async function () {
        const response = await soundcloud.users.playlists("https://soundcloud.com/tenpimusic")
        assert(Object.prototype.hasOwnProperty.call(response[0], "description"))
    })

    it("should get a users web profiles", async function () {
        const response = await soundcloud.users.webProfiles("https://soundcloud.com/yourparadis")
        assert(Object.prototype.hasOwnProperty.call(response[0], "url"))
    })
})
