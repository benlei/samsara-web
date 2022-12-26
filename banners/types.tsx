export type Banners = {
    characters: Banner;

    weapons: Banner;
}

export type Banner = {
    4: BannerResource;
    5: BannerResource;
}

export type BannerResource = {
    [name: string]: string[]
}

export type VersionParts = {
    version: string;
    parts: number;
}

export type ResourceCounter = {
    name: string;
    image: string;
    runs: number;
    counter: number[];
}