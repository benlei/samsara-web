import {Dispatch, SetStateAction} from "react";

export type BannerDataset = {
    fiveStarCharacters: Featured[]
    fourStarCharacters: Featured[]
    fiveStarWeapons: Featured[]
    fourStarWeapons: Featured[]
}

export type Featured = {
    name: string
} & FeaturedVersions & FeaturedDates

export type FeaturedVersions = {
    versions: string[]
}

export type FeaturedDates = {
    dates: DateRange[]
}

export type DateRange = {
    start: string
    end: string
}


export type BannerResource = {
    [name: string]: string[]
}

export type VersionParts = {
    version: string;
    parts: number;
}

export type ResourceBanner = {
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

export type BannerSummary = {
    versions: string[]
    dates: DateRange[]
}
export type CommonSummaryProperties = {
    versionParts: VersionParts[]
    featuredList: Featured[]
    type: string
    order: 'asc' | 'desc' | boolean
    filterText: string
}