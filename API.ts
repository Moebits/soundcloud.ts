import axios from "axios"

const apiURL = "https://api.soundcloud.com/"
const webURL = "https://www.soundcloud.com/"

export default class API {
    public constructor(private readonly clientID: string, private readonly oauthToken: string) {}

    public get = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.get(endpoint, {params}).then((r) => r.data)
        return response
    }

    public getWebsite = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = webURL + endpoint
        const response = await axios.get(endpoint, {params}).then((r) => r.data)
        return response
    }

    public post = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.post(endpoint, {params}).then((r) => r.data)
        return response
    }

    public put = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.put(endpoint, {params}).then((r) => r.data)
        return response
    }

    public delete = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.delete(endpoint, {params}).then((r) => r.data)
        return response
    }

    public resolve = async (resolvable: string | number, full?: boolean) => {
        let id = resolvable
        if (String(resolvable).includes("soundcloud")) {
            const resolved = await this.get(`resolve`, {url: resolvable})
            if (full) return resolved
            id = resolved.id
        }
        return id
    }
}
