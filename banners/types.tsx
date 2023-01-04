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
    limitedOnly: boolean
    sortBy: string
    order: string
}

export type BannerOptionSetters = {
    setOrder: Dispatch<SetStateAction<any>>
    setSortBy: Dispatch<SetStateAction<any>>
    setLimitedOnly: Dispatch<SetStateAction<any>>
}