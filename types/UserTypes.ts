import type {SoundcloudFilter, SoundcloudSearch} from "./index"

export interface SoundcloudUserMini {
    avatar_url: string
    id: number
    kind: string
    permalink_url: string
    uri: string
    username: string
    permalink: string
    last_modified: string
}

export interface SoundcloudUser {
    avatar_url: string
    city: string
    comments_count: number
    country_code: number | null
    created_at: string
    creator_subscriptions: SoundcloudCreatorSubscription[]
    creator_subscription: SoundcloudCreatorSubscription
    description: string
    followers_count: number
    followings_count: number
    first_name: string
    full_name: string
    groups_count: number
    id: number
    kind: string
    last_modified: string
    last_name: string
    likes_count: number
    playlist_likes_count: number
    permalink: string
    permalink_url: string
    playlist_count: number
    reposts_count: number | null
    track_count: number
    uri: string
    urn: string
    username: string
    verified: boolean
    visuals: {
        urn: string
        enabled: boolean
        visuals: SoundcloudVisual[]
        tracking: null
    }
}

export interface SoundcloudUserSearch extends SoundcloudSearch {
    collection: SoundcloudUser[]
}

export interface SoundcloudWebProfile {
    network: string
    title: string
    url: string
    username: string | null
}

export interface SoundcloudUserCollection {
    collection: SoundcloudUser
    next_href: string | null
}

export interface SoundcloudVisual {
    urn: string
    entry_time: number
    visual_url: string
}

export interface SoundcloudCreatorSubscription {
    product: {
        id: string
    }
}

export interface SoundcloudUserFilter extends SoundcloudFilter {
    "filter.place"?: string
}