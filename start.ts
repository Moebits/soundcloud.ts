import SoundCloud from "./soundcloud"

require("dotenv").config()
const soundcloud = new SoundCloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN);
(async () => {
    const result = await soundcloud.util.downloadTrack("https://soundcloud.com/euphonicsessions/euphonic-sessions-january2024", "./tracks")
    console.log(result)
})()