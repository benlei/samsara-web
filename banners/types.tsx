import {Dispatch, SetStateAction} from "react";

export type BannerResource = {
    [name: string]: string[]
}

export type VersionParts = {
    version: string;
    parts: number;
}

export type Rundown = {
    name: string;
    image: string;
    runs: number;
    banners: string[];
    counter: number[];
}


export type BannerFilterSortOptions = {
    limitedOnly: boolean | null | undefined
    sortBy: string | null
    order: string | null
}

export type BannerOptionSetters = {
    setOrder: Dispatch<SetStateAction<any>>
    setSortBy: Dispatch<SetStateAction<any>>
    setLimitedOnly: Dispatch<SetStateAction<any>>
}