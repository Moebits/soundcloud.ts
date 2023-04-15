import type Soundcloud from "../soundcloud"

export class Base {
    public constructor(public readonly sc: Soundcloud) {}
    get api() {
        return this.sc.api
    }
}
