import {SoundCloudLicense, SoundCloudTrack, SoundCloudUserMini} from "./index"
export interface SoundCloudPlaylist {
    duration: number
    release_day: number | null
    permalink_url: string
    reposts_count: number
    genre: string | null
    permalink: string
    purchase_url: string | null
    release_month: number | null
    description: string | null
    uri: string
    label_name: string | null
    tag_list: string
    release_year: number | null
    secret_uri: string
    track_count: number
    user_id: number
    last_modified: string
    license: SoundCloudLicense
    tracks: SoundCloudTrack[]
    playlist_type: string | null
    id: number
    downloadable: boolean | null
    sharing: "private" | "public"
    secret_token?: string
    created_at: string
    release: number | null
    likes_count: number
    kind: "playlist"
    title: string
    type: string | null
    purchase_title: string | null
    artwork_url: string | null
    ean: string | null
    streamable: boolean
    user: SoundCloudUserMini
    embeddable_by: string
    label_id: string | null
}
