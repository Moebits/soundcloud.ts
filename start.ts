import SoundCloud from "./soundcloud"

require("dotenv").config()
const soundcloud = new SoundCloud();
(async () => {
    // const result = await soundcloud.util.downloadTrack("https://soundcloud.com/colbreakz/my-universe", "./tracks")
    // const result = await soundcloud.tracks.getAlt("https://soundcloud.com/colbreakz/my-universe")
    const result = await soundcloud.playlists.searchAlt("anime")
    console.log(result)
})()
