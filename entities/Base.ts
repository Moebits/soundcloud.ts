import type Soundcloud from "../soundcloud"

export class Base {
    public constructor(public readonly soundcloud: Soundcloud) {}
    get api() {
        return this.soundcloud.api
    }
}
