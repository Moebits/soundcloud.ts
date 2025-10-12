import SoundCloud from "./soundcloud"

require("dotenv").config()
const soundcloud = new SoundCloud();
(async () => {
    const result = await soundcloud.util.downloadTrack("https://soundcloud.com/5tereomanjpn/aire-tea-timestereoman-remix", "./tracks")
    console.log(result)
})()