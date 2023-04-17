import {Dispatch, SetStateAction} from "react"

export type BannerDataset = {
    fiveStarCharacters: Featured[]
    fourStarCharacters: Featured[]
    fiveStarWeapons: Featured[]
    fourStarWeapons: Featured[]
}

export type BannerHistoryDataset = {
    fiveStarCharacters: FeaturedHistory[]
    fourStarCharacters: FeaturedHistory[]
    fiveStarWeapons: FeaturedHistory[]
    fourStarWeapons: FeaturedHistory[]
}

export type Featured = {
    name: string
} & FeaturedVersions & FeaturedDates

export type FeaturedHistory = {
    name: string
} & FeaturedVersions

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

export type VersionParts = {
    version: string
    parts: number
}

export type DetailedFeaturedHistory = {
    name: string
    image: string
    runs: number
    versions: string[]
    counter: number[]
}

export type PopoverFeaturedHistory = {
    name: string
    image: string
    stars: number
    version: string
}

export type BannerFilterSortOptions = {
    sortBy: string
    order: string
}

export type BannerOptionSetters = {
    setOrder: Dispatch<SetStateAction<any>>
    setSortBy: Dispatch<SetStateAction<any>>
}