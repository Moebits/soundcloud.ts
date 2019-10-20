import {SoundCloudPlaylist} from "./index"

export interface SoundCloudActivityCollection {
    collection: SoundCloudActivity[]
    next_href: string
    future_href: string
}

export interface SoundCloudActivity {
    origin: SoundCloudPlaylist
    tags: string | null,
    created_at: string
    type: string
}

export interface SoundCloudConnection {
    created_at: string
    display_name: string
    id: number
    post_favorite: boolean
    post_publish: false,
    service: string
    type: string
    uri: string
}
