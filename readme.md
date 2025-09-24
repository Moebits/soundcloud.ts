<div align="left">
  <p>
    <a href="https://moebits.github.io/soundcloud.ts/"><img src="https://raw.githubusercontent.com/Moebits/soundcloud.ts/master/images/soundcloud.tslogo.gif" width="500" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/soundcloud.ts/"><img src="https://nodei.co/npm/soundcloud.ts.png" /></a>
  </p>
</div>

### About

This is a wrapper for the Soundcloud API that includes typings and various utility functions
to make getting tracks, users, and playlists easier! You can also download single tracks, or download tracks in mass programmatically.

### Insall

```ts
npm install soundcloud.ts
```

### Useful Links

-   [**SoundCloud API Documentation**](https://developers.soundcloud.com/docs/api/reference)
-   [**Soundcloud.ts Documentation**](https://moebits.github.io/soundcloud.ts/)

### Getting Started

Authenticating with your account is **optional**, but I still recommend it. If you don't authenticate, you won't be able to use private endpoints such as `/me`. Soundcloud has closed down their API applications, but you are still able to get your client id and oauth token by inspecting the network traffic.

-   Go to soundcloud.com and login (skip if you are already logged in)
-   Open up the dev tools (Right click -> inspect) and go to the Network tab
-   Go to soundcloud.com, and you should see a bunch of requests in the network tab
-   Find the request that has the name `session` (you can filter by typing `session` in the filter box) and click on it
-   Go to the Payload tab
-   You should see your client id in the Query String Parameters section, and your oauth token (`access_token`) in the Request Payload section

```ts
const soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN)
/*Get track v2*/
const track = await soundcloud.tracks.get("succducc/azure")
/*Search tracks v2*/
const tracks = await soundcloud.tracks.search({q: "cool track name"})

/*Get user v2*/
const user = await soundcloud.playlists.get("someone")
/*Search users v2*/
const users = await soundcloud.users.search({q: "cool username"})

/*Get playlist (web scraping)*/
const playlist = await soundcloud.playlists.getAlt("virtual-riot/sets/throwback-ep")
/*Search playlists v2*/
const playlists = await soundcloud.playlists.search({q: "cool playlist name"})
```

#### Searching for tracks and playlists

```ts
import Soundcloud from "soundcloud.ts"

async function useAPI() {
    /*Credentials are optional, client id is manually found if omitted.*/
    const soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN)

    /*You can get tracks by URL or ID (which can only be gotten from the API)*/
    const track = await soundcloud.tracks.get("https://soundcloud.com/user/mysong")

    /*Worth to mention that you can omit the soundcloud.com part.*/
    const trackShorthand = await soundcloud.tracks.get("user/mysong")

    /*To get the ID with the url of a track/playlist/user, you can use the resolve endpoint.*/
    const id = await soundcloud.resolve.get("https://soundcloud.com/user/mysong")

    /*You can search for tracks... with nothing?*/
    const randomSearch = await soundcloud.tracks.search()

    /*But more commonly, you will want to add parameters such as the search query.*/
    const search = await soundcloud.tracks.search({q: "artist"})

    /*You can also get the super secret token that is used on private tracks. Authentication required, 
  and only works with your own tracks.*/
    const secretToken = await soundcloud.tracks.secretToken("user/mysecretsong")

    /*Playlists are largely the same, you can use the get() and search() methods.*/
    const playlist = await soundcloud.playlists.get("https://soundcloud.com/user/sets/my-songs")
}
```

#### Searching for users and comments

```ts
async function useAPI() {
    /*Users also have a get() and search() method.*/
    const user = await soundcloud.users.get("user")
    const userSearch = await soundcloud.users.search({q: "some user"})

    /*You can get the followers and following of a user.*/
    const following = await soundcloud.users.following("user")
    const followers = await soundcloud.users.followers("user")

    /*Favorite tracks too.*/
    const favorites = await soundcloud.users.favorites("user")

    /*The web profiles are the social links that show on the side of a user's profile*/
    const socialLinks = await soundcloud.users.webProfiles("user")

    /*It's very easy to get all of the comments on a track, or all of the comments by a user.*/
    const userComments = await soundcloud.users.comments("user")
    const trackComments = await soundcloud.tracks.comments("user/mysong")

    /*And you can get a specific comment from its ID (must make an API call to get it).*/
    const comment = await soundcloud.comments.get(577904916)
}
```

#### Downloading and streaming tracks

```ts
async function useAPI() {
    /*If downloads aren't enabled, it will download the stream instead of the original file.*/
    await soundcloud.util.downloadTrack("user/mysong", "./tracks")

    /*You can download multiple tracks by passing them as an array to downloadTracks(). The third
  parameter is the limit of tracks to download.*/
    const tracks = await soundcloud.tracks.search({q: "cool track"})
    await soundcloud.util.downloadTracks(tracks, "./tracks", 10)

    /*In addition, there are a bunch of utilities that do the above automatically for convenience.*/
    await soundcloud.util.downloadSearch("artist", "./tracks")
    await soundcloud.util.downloadFavorites("user", "./tracks")
    await soundcloud.util.downloadPlaylist("https://soundcloud.com/user/sets/my-songs", "./tracks")

    /*streamTrack() will download the track and will return a stream.Readable automatically.*/
    const readableStream = await soundcloud.util.streamTrack("https://soundcloud.com/virtual-riot/emotionalrmx")
}
```

### Other Endpoints

There are more less commonly used endpoints such as **me**, **apps**, and **oembed**. Refer to the [**SoundCloud API Documentation**](https://developers.soundcloud.com/docs/api/reference) for their usage.

### Common Types

<details>
<summary>SoundCloudTrack</summary>

```ts
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
```

</details>

<details>
<summary>SoundCloudPlaylist</summary>

```ts
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
```

</details>

<details>
<summary>SoundCloudUser</summary>

```ts
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
```

</details>

<details>
<summary>SoundCloudComment</summary>

```ts
export interface SoundCloudComment {
    kind: "comment"
    id: number
    created_at: string
    user_id: number
    track_id: number
    timestamp: number
    body: string
    uri: string
    user: SoundCloudUserMini
    self: {
        urn: string
    }
}
```

</details>
