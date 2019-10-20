import {SoundCloudUserMini} from "./index"
export interface SoundCloudComment {
    kind: "comment"
    id: number
    created_at: string
    user_id: number
    track_id: number
    timestamp: number
    body: string
    uri: string
    user: SoundCloudUserMini
}
