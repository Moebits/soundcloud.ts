import SoundCloud from "./SoundCloud"

require("dotenv").config()
const soundcloud = new SoundCloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN);
(async () => {
    // const result = await soundcloud.tracks.search({q: "virtual riot"})
    const result = await soundcloud.tracks.secretToken("https://soundcloud.com/tenpimusic/kudasai")
    console.log(result)
})()
