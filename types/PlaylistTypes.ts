import type {SoundcloudFilter, SoundcloudLicense, SoundcloudSearch, SoundcloudTrack, SoundcloudUser} from "./index"

export interface SoundcloudPlaylist {
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
    tracks: SoundcloudTrack[]
    id: number
    urn: string
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
    user: SoundcloudUser
    published_at: string | null
    embeddable_by: "all" | "me" | "none"
}

export interface SoundcloudPlaylistSearch extends SoundcloudSearch {
    collection: SoundcloudPlaylist[]
}

export interface SoundcloudPlaylistFilter extends SoundcloudFilter {
    "filter.genre_or_tag"?: string
}