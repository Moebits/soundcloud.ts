import type { Dispatcher } from "undici"
import { Pool, request } from "undici"

const apiURL = "https://api.soundcloud.com"
const apiV2URL = "https://api-v2.soundcloud.com"
const webURL = "https://soundcloud.com"

export class API {
    public static headers: Record<string, any> = {
        referer: "soundcloud.com",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
    }
    public api = new Pool(apiURL)
    public apiV2 = new Pool(apiV2URL)
    public web = new Pool(webURL)
    public proxy?: Pool
    constructor(public clientID?: string, public oauthToken?: string, proxy?: string) {
        if (oauthToken) API.headers.Authorization = `OAuth ${oauthToken}`
        if (proxy) this.proxy = new Pool(proxy)
    }

    get headers() {
        return API.headers
    }

    /**
     * Gets an endpoint from the Soundcloud API.
     */
    public get = (endpoint: string, params?: Record<string, any>) => {
        return this.makeGet(this.api, apiURL, endpoint, params)
    }

    /**
     * Gets an endpoint from the Soundcloud V2 API.
     */
    public getV2 = (endpoint: string, params?: Record<string, any>) => {
        return this.makeGet(this.apiV2, apiV2URL, endpoint, params)
    }

    /**
     * Some endpoints use the main website as the URL.
     */
    public getWebsite = (endpoint: string, params?: Record<string, any>) => {
        return this.makeGet(this.web, webURL, endpoint, params)
    }

    /**
     * Gets a URL, such as download, stream, attachment, etc.
     */
    public getURL = (URI: string, params?: Record<string, any>) => {
        if (this.proxy) return this.makeRequest(this.proxy, this.buildOptions(URI, "GET", params))
        const options = {
            query: params || {},
            headers: API.headers,
            maxRedirections: 5,
        }
        if (this.clientID) options.query.client_id = this.clientID
        if (this.oauthToken) options.query.oauth_token = this.oauthToken
        return request(URI, options).then(r => {
            if (r.statusCode.toString().startsWith("2")) {
                if (r.headers["content-type"] === "application/json") return r.body.json()
                return r.body.text()
            }
            throw new Error(`Status code ${r.statusCode}`)
        })
    }

    private readonly makeGet = async (pool: Pool, origin: string, endpoint: string, params?: Record<string, any>) => {
        if (!this.clientID) await this.getClientID()
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        const options = this.buildOptions(`${this.proxy ? origin : ""}/${endpoint}`, "GET", params)
        try {
            return await this.makeRequest(this.proxy || pool, options)
        } catch {
            await this.getClientID(true)
            return this.makeRequest(this.proxy || pool, options)
        }
    }

    public post = async (endpoint: string, params?: Record<string, any>) => {
        if (!this.clientID) await this.getClientID()
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        const options = this.buildOptions(`${this.proxy ? origin : ""}/${endpoint}`, "POST", params)
        return this.makeRequest(this.proxy || this.api, options)
    }

    public getClientID = async (reset?: boolean) => {
        if (!this.oauthToken && (!this.clientID || reset)) {
            const response = await (this.proxy ? this.proxy.request(this.buildOptions(webURL)) : this.web.request(this.buildOptions("/"))).then(r =>
                r.body.text()
            )
            const urls = response.match(
                /(?!<script crossorigin src=")https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*\.js)(?=">)/g
            )
            if (urls.length === 0) throw new Error("Could not find client ID")
            let script: string
            do {
                script = await request(urls.pop()).then(r => r.body.text())
            } while (urls.length > 0 && !script.includes(',client_id:"'))
            this.clientID = script.match(/,client_id:"(\w+)"/)?.[1]
            if (!this.clientID) throw new Error("Could not find client ID")
        }
        return this.clientID
    }

    private readonly buildOptions = (path: string, method: Dispatcher.HttpMethod = "GET", params?: Record<string, any>) => {
        const options: Dispatcher.RequestOptions = {
            query: (method == "GET" && params) || {},
            headers: API.headers,
            method,
            path,
            maxRedirections: 5,
        }
        if (method === "POST" && params) options.body = JSON.stringify(params)
        if (this.clientID) options.query.client_id = this.clientID
        if (this.oauthToken) options.query.oauth_token = this.oauthToken
        return options
    }

    private readonly makeRequest = (pool: Pool, options: Dispatcher.RequestOptions) => {
        return pool.request(options).then(r => {
            if (r.statusCode.toString().startsWith("2")) {
                if (r.headers["content-type"].includes("application/json")) return r.body.json()
                return r.body.text()
            }
            throw new Error(`Status code ${r.statusCode}`)
        })
    }
}
