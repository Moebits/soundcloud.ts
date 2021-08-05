import SoundCloud from "./soundcloud"

require("dotenv").config()
const soundcloud = new SoundCloud();
(async () => {
    // const result = await soundcloud.util.downloadTrack("https://soundcloud.com/colbreakz/my-universe", "./tracks")
    // const result = await soundcloud.tracks.getV2("https://soundcloud.com/colbreakz/my-universe")
    const result = await soundcloud.util.downloadSongCover("https://soundcloud.com/colbreakz/my-universe", null, true)
    console.log(result)
})()
