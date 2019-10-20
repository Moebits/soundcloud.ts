import {SoundCloudLicense} from "./TrackTypes"

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
