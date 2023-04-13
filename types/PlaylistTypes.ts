import type {
    SoundcloudFilterV2,
    SoundcloudLicense,
    SoundcloudSearchV2,
    SoundcloudTrack,
    SoundcloudTrackV2,
    SoundcloudUserMini,
    SoundcloudUserV2,
} from "./index"

export interface SoundcloudPlaylistFilter {
    representation?: "compact" | "id"
    q?: string
}
export interface SoundcloudPlaylist {
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
    license: SoundcloudLicense
    tracks: SoundcloudTrack[]
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
    user: SoundcloudUserMini
    embeddable_by: string
    label_id: string | null
}

export interface SoundcloudPlaylistV2 {
    duration: number
    permalink_url: string
    reposts_count: number
    genre: string | null
    permalink: string
    purchase_url: string | null
    description: string | null
    uri: string
    label_name: string | null
    tag_list: string
    set_type: string
    public: boolean
    track_count: number
    user_id: number
    last_modified: string
    license: SoundcloudLicense
    tracks: SoundcloudTrackV2[]
    id: number
    release_date: string | null
    display_date: string
    sharing: "public" | "private"
    secret_token: string | null
    created_at: string
    likes_count: number
    kind: string
    title: string
    purchase_title: string | null
    managed_by_feeds: boolean
    artwork_url: string | null
    is_album: boolean
    user: SoundcloudUserV2
    published_at: string | null
    embeddable_by: "all" | "me" | "none"
}

export interface SoundcloudPlaylistSearchV2 extends SoundcloudSearchV2 {
    collection: SoundcloudPlaylistV2[]
}

export interface SoundcloudPlaylistFilterV2 extends SoundcloudFilterV2 {
    "filter.genre_or_tag"?: string
}
