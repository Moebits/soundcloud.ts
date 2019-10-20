export interface SoundCloudUserFilter {
    q?: string
}

export interface SoundCloudUserMini {
    avatar_url: string
    id: number
    kind: string
    permalink_url: string
    uri: string
    username: string
    permalink: string
    last_modified: string
}

export interface SoundCloudUser {
    kind: "user"
    id: number
    permalink: string
    subscriptions: []
    username: string
    uri: string
    permalink_url: string
    avatar_url: string
    country: string
    full_name: string
    city: string
    description: string
    discogs_name: string | null
    myspace_name: string | null
    website: string | null
    website_title: string
    online: boolean
    track_count: number
    playlist_count: number
    followers_count: number
    followings_count: number
    likes_count: number
    comments_count: number
    public_favorites_count: number
    avatar_data?: string
    quota?: {
        unlimited_upload_quota: boolean
        upload_seconds_used: number
        upload_seconds_left: number
    }
    private_playlists_count?: number
    primary_email_confirmed?: boolean
    private_tracks_count?: number
    locale?: string
    last_modified: string
    first_name: string
    last_name: string
    reposts_count: number
    upload_seconds_left?: number
    plan: string

}

export interface SoundCloudWebProfile {
    kind: "web-profile"
    id: number
    service: string
    title: string
    url: string
    username: string | null
    created_at: string
}

export interface SoundCloudUserCollection {
    collection: SoundCloudUser
    next_href: string | null
}
