import SoundCloud from "./soundcloud"

require("dotenv").config()
const soundcloud = new SoundCloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN);
(async () => {
    const result = await soundcloud.users.likes("https://soundcloud.com/soundcloud")
    console.log(result.map((t) => t.permalink_url))
})()