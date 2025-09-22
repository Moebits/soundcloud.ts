const apiURL = "https://api.soundcloud.com"
const apiV2URL = "https://api-v2.soundcloud.com"
const webURL = "https://soundcloud.com"

export class API {
    public static headers: {[key: string]: string} = {
        Origin: "https://soundcloud.com",
        Referer: "https://soundcloud.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67"
    }
    public clientId?: string
    public oauthToken?: string
    public proxy?: string

    public constructor(clientId?: string, oauthToken?: string, proxy?: string) {
        this.clientId = clientId
        this.oauthToken = oauthToken
        this.proxy = proxy
        if (oauthToken) API.headers.Authorization = `OAuth ${oauthToken}`
    }

    public get headers() {
        return API.headers
    }

    public get = (endpoint: string, params?: {[key: string]: any}) => this.getRequest(apiURL, endpoint, params)
    public getV2 = (endpoint: string, params?: {[key: string]: any}) => this.getRequest(apiV2URL, endpoint, params)
    public getWebsite = (endpoint: string, params?: {[key: string]: any}) => this.getRequest(webURL, endpoint, params)
    public getURL = (URI: string, params?: {[key: string]: any}) => this.fetchRequest(URI, "GET", params)
    public post = (endpoint: string, params?: {[key: string]: any}) => this.fetchRequest(`${apiURL}/${endpoint}`, "POST", params)

    private options = (method: string, params?: {[key: string]: any}) => {
        const options: RequestInit = {
            method,
            headers: {...API.headers},
            redirect: "follow"
        }
        if (method === "POST" && params) options.body = JSON.stringify(params)
        return options
    }

    private fetchRequest = async (url: string, method: string, params?: {[key: string]: any}) => {
        if (!params) params = {}
        if (!this.clientId) await this.getClientId()
        params.client_id = this.clientId
        if (this.oauthToken) params.oauth_token = this.oauthToken
        const query = params ? "?" + new URLSearchParams(params).toString() : ""
        url += query
        if (this.proxy) url = this.proxy + url
        const response = await fetch(url, this.options(method, params))
        if (!response.ok) throw new Error(`Status code ${response.status}`)
        const contentType = response.headers.get("content-type")
        return contentType && contentType.includes("application/json") ? response.json() : response.text()
    }

    private getRequest = async (origin: string, endpoint: string, params?: {[key: string]: any}) => {
        if (!params) params = {}
        if (!this.clientId) await this.getClientId()
        params.client_id = this.clientId
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        return this.fetchRequest(`${origin}/${endpoint}`, "GET", params)
    }

    public getClientIdWeb = async () => {
        const response = await fetch(webURL).then((r) => r.text())
        if (!response || typeof response !== "string") throw new Error("Could not find client ID")
        const urls = response.match(/https?:\/\/[^\s"]+\.js/g)
        if (!urls) throw new Error("Could not find script URLs")
        for (const scriptURL of urls) {
            const script = await fetch(scriptURL).then((r) => r.text())
            const clientId = script.match(/[{,]client_id:"(\w+)"/)?.[1]
            if (clientId) return clientId
        }
        throw new Error("Could not find client ID in script URLs")
    }

    public getClientIdMobile = async () => {
        const response = await fetch("https://m.soundcloud.com/", {
            headers: {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/99.0.4844.47 Mobile/15E148 Safari/604.1"}
        }).then(r => r.text())
        const clientId = response.match(/"clientId":"(\w+?)"/)?.[1]
        if (clientId) return clientId
        throw new Error("Could not find client ID")
    }

    public getClientId = async (reset?: boolean) => {
        if (!this.oauthToken && (!this.clientId || reset)) {
            try {
                this.clientId = await this.getClientIdWeb()
            } catch (webError) {
                console.log("Web fetch error:", webError)
                try {
                    this.clientId = await this.getClientIdMobile()
                } catch (mobileError) {
                    console.log("Mobile fetch error:", mobileError)
                    throw new Error(`Could not find client ID. Provide one in the constructor.\nWeb error: ${webError}\nMobile error: ${mobileError}`)
                }
            }
        }
        return this.clientId
    }
}