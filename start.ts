import SoundCloud from "./soundcloud"

require("dotenv").config()
const soundcloud = new SoundCloud(process.env.SOUNDCLOUD_CLIENT_ID);
(async () => {
    // const result = await soundcloud.tracks.search({q: "virtual riot"})
    // await soundcloud.util.downloadPlaylist("https://soundcloud.com/tenpimusic/sets/my-songs", "./tracks")
    // await soundcloud.util.downloadSearch("virtual riot")
    // await soundcloud.util.downloadSearch("virtual riot", "./tracks", 10)
    // const result = await soundcloud.tracks.search({q: "anime"})
    // const result = await soundcloud.util.downloadTrack("https://soundcloud.com/virtual-riot/virtualriot-withyou", "./tracks")
    // const result = await soundcloud.users.getURL("imtenpi")
    // const result = await soundcloud.playlists.searchV2({q: "anime"})
    // const result = await soundcloud.users.getV2("https://soundcloud.com/imtenpi/sets/my-songs")
    // const result = await soundcloud.util.streamLink("imtenpi/snowflake")
    const result = await soundcloud.tracks.searchV2({q: "kawaii"})
    console.log(result)
})()
