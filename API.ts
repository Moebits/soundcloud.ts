import axios from "axios"

const apiURL = "https://api.soundcloud.com/"
const webURL = "https://www.soundcloud.com/"

export default class API {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}
    public constructor(public clientID: string, public oauthToken: string) {}

    /**
     * Gets an endpoint from the Soundcloud API.
     */
    public get = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.get(endpoint, {params, headers: this.headers}).then((r) => r.data)
        return response
    }

    /**
     * Some endpoints use the main website as the URL.
     */
    public getWebsite = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = webURL + endpoint
        const response = await axios.get(endpoint, {params, headers: this.headers}).then((r) => r.data)
        return response
    }

    /**
     * Gets a URI, such as download, stream, attachment, etc.
     */
    public getURI = async (URI: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        return axios.get(URI, {params, headers: this.headers})
    }

    public post = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.post(endpoint, {params, headers: this.headers}).then((r) => r.data)
        return response
    }

    public put = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.put(endpoint, {params, headers: this.headers}).then((r) => r.data)
        return response
    }

    public delete = async (endpoint: string, params?: any) => {
        if (!params) params = {}
        params.client_id = this.clientID
        if (this.oauthToken) params.oauth_token = this.oauthToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        endpoint = apiURL + endpoint
        const response = await axios.delete(endpoint, {params, headers: this.headers}).then((r) => r.data)
        return response
    }
}
