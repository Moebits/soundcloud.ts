import {SoundcloudSearchV2, SoundCloudUserMini} from "./index"

export type SoundCloudLicense =
    | "no-rights-reserved"
    | "all-rights-reserved"
    | "cc-by"
    | "cc-by-nc"
    | "cc-by-nd"
    | "cc-by-sa"
    | "cc-by-nc-nd"
    | "cc-by-nc-sa"

export type SoundCloudTrackType =
    | "original"
    | "remix"
    | "live"
    | "recording"
    | "spoken"
    | "podcast"
    | "demo"
    | "in progress"
    | "stem"
    | "loop"
    | "sound effect"
    | "sample"
    | "other"

export interface SoundCloudTrackFilter {
    q?: string
    tags?: string
    filter?: "public" | "private" | "all"
    license?: SoundCloudLicense
    bpm_from?: number
    bpm_to?: number
    duration_from?: number
    duration_to?: number
    created_at_from?: Date
    created_at_to?: Date
    ids?: string
    genres?: string
    types?: string
}

export interface SoundCloudTrack {
    comment_count: number
    release: number | ""
    original_content_size: number
    track_type: SoundCloudTrackType | null
    original_format: string
    streamable: boolean
    download_url: string | null
    id: number
    state: "processing" | "failed" | "finished"
    last_modified: string
    favoritings_count: number
    kind: string
    purchase_url: string
    release_year: number | null
    sharing: string
    attachments_uri: string
    license: SoundCloudLicense
    user_id: number
    user_favorite: boolean
    waveform_url: string
    permalink: string
    permalink_url: string
    playback_count: number
    downloadable: boolean
    created_at: string
    description: string
    title: string
    duration: number
    artwork_url: string
    video_url: string | null
    tag_list: string
    release_month: number | null
    genre: string
    release_day: number | null
    reposts_count: number
    label_name: string | null
    commentable: boolean
    bpm: number | null
    policy: string
    key_signature: string
    isrc: string | null
    uri: string
    download_count: number
    likes_count: number
    purchase_title: string
    embeddable_by: string
    monetization_model: string
    user: SoundCloudUserMini
    user_playback_count: number | null
    stream_url: string
    label?: SoundCloudUserMini
    label_id: number | null
    asset_data?: string
    artwork_data?: string
}

export interface SoundcloudTrackV2 {
    comment_count: number
    full_duration: number
    downloadable: boolean
    created_at: string
    description: string | null
    media: any
    title: string
    publisher_metadata: any
    duration: number
    has_downloads_left: boolean
    artwork_url: string
    public: boolean
    streamable: boolean
    tag_list: string
    genre: string
    id: number
    reposts_count: number
    state: string
    label_name: string | null
    last_modified: string
    commentable: boolean
    policy: string
    visuals: string | null
    kind: string
    purchase_url: string | null
    sharing: string
    uri: string
    secret_token: string | null
    download_count: number
    likes_count: number
    urn: string
    license: string
    purchase_title: string | null
    display_date: string
    embeddable_by: string
    release_date: string
    user_id: number
    monetization_model: string
    waveform_url: string
    permalink: string
    permalink_url: string
    user: any
    playback_count: number
}
export interface SoundcloudTrackSearchV2 extends SoundcloudSearchV2 {
    collection: SoundcloudTrackV2[]
}

export interface SoundCloudSecretToken {
    kind: "secret-token"
    token: string
    uri: string
    resource_uri: string
}
