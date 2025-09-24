import type {SoundcloudFilter, SoundcloudSearch, SoundcloudUser} from "./index"

export type SoundcloudLicense =
    | "no-rights-reserved"
    | "all-rights-reserved"
    | "cc-by"
    | "cc-by-nc"
    | "cc-by-nd"
    | "cc-by-sa"
    | "cc-by-nc-nd"
    | "cc-by-nc-sa"

export type SoundcloudTrackType =
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

export interface SoundcloudTrack {
    comment_count: number
    full_duration: number
    downloadable: boolean
    created_at: string
    description: string | null
    media: {
        transcodings: SoundcloudTranscoding[]
    }
    title: string
    publisher_metadata: {
        id: number
        urn: string
        artist: string
        album_title: string
        contains_music: boolean
        upc_or_ean: string
        isrc: string
        explicit: boolean
        p_line: string
        p_line_for_display: string
        c_line: string
        c_line_for_display: string
        writer_composer: string
        release_title: string
        publisher: string
    }
    duration: number
    has_downloads_left: boolean
    artwork_url: string
    public: boolean
    streamable: boolean
    tag_list: string
    genre: string
    id: number
    reposts_count: number
    state: "processing" | "failed" | "finished"
    label_name: string | null
    last_modified: string
    commentable: boolean
    policy: string
    visuals: string | null
    kind: string
    purchase_url: string | null
    sharing: "private" | "public"
    uri: string
    secret_token: string | null
    download_count: number
    likes_count: number
    urn: string
    license: SoundcloudLicense
    purchase_title: string | null
    display_date: string
    embeddable_by: "all" | "me" | "none"
    release_date: string
    user_id: number
    monetization_model: string
    waveform_url: string
    permalink: string
    permalink_url: string
    user: SoundcloudUser
    playback_count: number
}
export interface SoundcloudTrackSearch extends SoundcloudSearch {
    collection: SoundcloudTrack[]
}

export interface SoundcloudSecretToken {
    kind: "secret-token"
    token: string
    uri: string
    resource_uri: string
}

export interface SoundcloudTranscoding {
    url: string
    preset: string
    duration: number
    snipped: boolean
    format: {
        protocol: string
        mime_type: string
    }
    quality: string
}

export interface SoundcloudTrackFilter extends SoundcloudFilter {
    "filter.genre_or_tag"?: string
    "filter.duration"?: "short" | "medium" | "long" | "epic"
    "filter.created_at"?: "last_hour" | "last_day" | "last_week" | "last_month" | "last_year"
    "filter.license"?: "to_modify_commercially" | "to_share" | "to_use_commercially"
}