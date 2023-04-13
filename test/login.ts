import Soundcloud from "../soundcloud"

// eslint-disable-next-line
require("dotenv").config()
const soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN)

export { soundcloud }
