<div align="left">
  <p>
    <a href="https://tenpi.github.io/soundcloud.ts/"><img src="https://raw.githubusercontent.com/Tenpi/soundcloud.ts/master/images/soundcloud.tslogo.gif" width="500" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/soundcloud.ts/"><img src="https://nodei.co/npm/soundcloud.ts.png" /></a>
  </p>
</div>

### About
This is a wrapper for the Soundcloud API that includes typings and various utility functions
to make getting tracks, users, and playlists easier!

### Insall
```ts
npm install soundcloud.ts
```

### Useful Links
- [**SoundCloud API Documentation**](https://developers.soundcloud.com/docs/api/reference)

### Getting Started
Authenticating with your account is **optional**, but I still recommend it. If you don't authenticate, you won't be able to use private endpoints such as `/me`. Soundcloud has closed down their API applications, but you are still able to get your 
client id and oauth token by inspecting the network traffic.
- Go to any track that has downloads enabled on Soundcloud, such as: https://soundcloud.com/tenpimusic/starstruck
- Open up the dev tools (Right click -> inspect) and go to the Network tab
- Download the track (hamburger menu -> download file), and observe the network tab.
- You will see something like `&client_id="client id"&oauth_token="token"`, grab these credentials!

#### Searching for tracks and playlists
```ts
import Soundcloud from "soundcloud.ts"

async function useAPI() {
  /*Credentials are optional, a public client id will be used if they are omitted.*/
  const soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN)

  /*You can get tracks by URL or ID (which can only be gotten from the API)*/
  const track = await soundcloud.tracks.get("https://soundcloud.com/tenpimusic/snowflake")

  /*To get the ID with the url of a track/playlist/user, you can use the resolve endpoint.*/
  const id = await soundcloud.resolve.get("https://soundcloud.com/tenpimusic/snowflake")

  /*You can search for tracks... with nothing?*/
  const randomSearch = await soundcloud.tracks.search()

  /*But more commonly, you will want to add parameters such as the search query.*/
  const search = await soundcloud.tracks.search({q: "virtual riot"})

  /*You can also get the super secret token that is used on private tracks. Authentication required, 
  and only works with your own tracks.*/
  const secretToken = await soundcloud.tracks.secretToken("https://soundcloud.com/tenpimusic/kudasai")

  /*Playlists are largely the same, you can use the get() and search() methods.*/
  const playlist = await soundcloud.playlists.get("https://soundcloud.com/tenpimusic/sets/my-songs")
}
```

#### Searching for users and comments
```ts
async function useAPI() {
  /*Users also have a get() and search() method.*/
  const user = await soundcloud.users.get("https://soundcloud.com/tenpimusic")
  const userSearch = await soundcloud.users.get({q: "some user"})

  /*You can get the followers and following of a user.*/
  const following = await soundcloud.users.following("https://soundcloud.com/tenpimusic")
  const followers = await soundcloud.users.followers("https://soundcloud.com/tenpimusic")
  
  /*Favorite tracks too.*/
  const favorites = await soundcloud.users.favorites("https://soundcloud.com/tenpimusic")

  /*The web profiles are the social links that show on the side of a user's profile*/
  const socialLinks = await soundcloud.users.webProfiles("https://soundcloud.com/tenpimusic")

  /*It's very easy to get all of the comments on a track, or all of the comments by a user.*/
  const userComments = await soundcloud.users.comments("https://soundcloud.com/tenpimusic")
  const trackComments = await soundcloud.tracks.comments("https://soundcloud.com/tenpimusic/moonlight")

  /*And you can get a specific comment from its ID (must make an API call to get it).*/
  const comment = await soundcloud.comments.get(577904916)
}
```
### Other Endpoints
There are more less commonly used endpoints such as **me**, **apps**, and **oembed**. Refer to the [**SoundCloud API Documentation**](https://developers.soundcloud.com/docs/api/reference) for their usage.

### Common Types
<details>
<summary>SoundCloudTrack</summary>

```ts
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
```
</details>

<details>
<summary>SoundCloudPlaylist</summary>

```ts
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
```
</details>

<details>
<summary>SoundCloudUser</summary>

```ts
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
}
```
</details>