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
    id: number
    permalink: string
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
    website: string
    website_title: string
    online: boolean
    track_count: number
    playlist_count: number
    followers_count: number
    followings_count: number
    public_favorites_count: number
    avatar_data?: string
}
