import * as fs from "fs"
import * as path from "path"
import * as stream from "stream"
import api from "../API"
import {SoundCloudTrack} from "../types"
import {Tracks} from "./index"

export class Util {
    private readonly tracks = new Tracks(this.api)
    constructor(private readonly api: api) {}

    /**
     * Utility for awaiting a stream.Writable
     */
    public awaitStream = async (writeStream: stream.Writable) => {
        return new Promise((resolve, reject) => {
            writeStream.on("finish", resolve)
            writeStream.on("error", reject)
        })
    }

    public downloadTrack = async (trackResolvable: string | number | SoundCloudTrack, folder?: string) => {
        let track: SoundCloudTrack
        if (trackResolvable.hasOwnProperty("downloadable")) {
            track = trackResolvable as SoundCloudTrack
        } else {
            track = await this.tracks.get(String(trackResolvable))
        }
        if (track.downloadable === true) {
            if (!folder) folder = "./"
            if (!fs.existsSync(folder)) fs.mkdirSync(folder)
            await this.api.getURI(track.download_url, {responseType: "arraybuffer"})
            .then((r) => {
                let dest: string
                if (r.headers["content-type"] === "audio/x-wav") {
                    dest = path.join(folder, `${track.title}.wav`)
                } else {
                    dest = path.join(folder, `${track.title}.mp3`)
                }
                fs.writeFileSync(dest, r.data)
            })
        } else {
            return Promise.reject("This track doesn't have downloads enabled.")
        }
    }
}
