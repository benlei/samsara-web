import {getBaseVersion, getVersionPart} from "@/banners/version";
import _ from "lodash";
import dayjs, {Dayjs} from "dayjs";
import {VersionParts} from "@/banners/types";
import {getImageFromName} from "@/format/image";
import utc from "dayjs/plugin/utc";

const HighRange = 60
const MidRange = 25

export type ResourceSummary = {
    name: string
    image: string
    runs: number
    daysSinceLastRun: number
    bannersSinceLastRun: number
    patchesSinceLastRun: number
    avgBannerGapInterval: number
    avgPatchGapInterval: number
    avgDaysInterval: number
}

export type CountSummary = {
    name: string
    image: string
    count: number
}

export type AverageCountSummary = {
    name: string
    image: string
    average: number
    standardDeviation: number
    count: number
}

export type BannerSummary = {
    versions: string[]
    dates: DateRange[]
}

export type DateRange = {
    start: string
    end: string
}

export type CommonSummaryProperties = {
    versionParts: VersionParts[]
    banners: { [name: string]: BannerSummary }
    type: string
    order: 'asc' | 'desc' | boolean
    filterText: string
}

export function getPatchGap(versionParts: VersionParts[], oldVersion: string, newVersion: string): number {
    const baseOldVersion = getBaseVersion(oldVersion)
    const baseNewVersion = getBaseVersion(newVersion)

    return _.findIndex(versionParts, (vp) => vp.version === baseNewVersion)
        - _.findIndex(versionParts, (vp) => vp.version === baseOldVersion);
}

export function getBannerGap(versionParts: VersionParts[], oldVersion: string, newVersion: string): number {
    const baseOldVersion = getBaseVersion(oldVersion)
    const baseOldVersionPart = getVersionPart(oldVersion)
    const baseNewVersion = getBaseVersion(newVersion)
    const baseNewVersionPart = getVersionPart(newVersion)

    if (baseOldVersion == baseNewVersion) {
        return baseNewVersionPart - baseOldVersionPart - 1
    }

    let startIndex = _.findIndex(versionParts, (vp) => vp.version === baseOldVersion);
    const endIndex = _.findIndex(versionParts, (vp) => vp.version === baseNewVersion);

    let total = versionParts[startIndex].parts - baseOldVersionPart
    while (++startIndex < endIndex) {
        total += versionParts[startIndex].parts
    }

    total += baseNewVersionPart - 1

    return total
}

export function getAvgPatchGapInterval(versionParts: VersionParts[], banner: BannerSummary): number {
    if (banner.versions.length < 2) {
        return -1
    }

    let sum = 0
    for (let i = 0; i < banner.versions.length - 1; i++) {
        sum += getPatchGap(versionParts, banner.versions[i], banner.versions[i + 1])
    }

    return _.round(sum / (banner.versions.length - 1), 1)
}

export function getAvgBannerGapInterval(versionParts: VersionParts[], banner: BannerSummary): number {
    if (banner.versions.length < 2) {
        return -1
    }

    let sum = 0
    for (let i = 0; i < banner.versions.length - 1; i++) {
        sum += getBannerGap(versionParts, banner.versions[i], banner.versions[i + 1])
    }

    return _.round(sum / (banner.versions.length - 1), 1)
}

export function getAvgDayInterval(banner: BannerSummary): number {
    if (banner.dates.length < 2) {
        return -1
    }

    let sum = 0
    for (let i = 0; i < banner.dates.length - 1; i++) {
        sum += dayjs.utc(banner.dates[i + 1].start).diff(dayjs.utc(banner.dates[i].end), 'day')
    }

    return _.round(sum / (banner.dates.length - 1), 1)
}

export function getResourceSummaries(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: Dayjs,
): ResourceSummary[] {
    dayjs.extend(utc);

    const result: ResourceSummary[] = []

    _.forIn(bannerSummaries, (banner, name) => {
        result.push({
            name,
            image: getImageFromName(name),
            runs: banner.versions.length,
            daysSinceLastRun: Math.max(0, currDate.diff(dayjs.utc(banner.dates[banner.dates.length - 1].end), 'day')),
            bannersSinceLastRun: getBannerGap(
                versionParts,
                banner.versions[banner.versions.length - 1],
                `${versionParts[versionParts.length - 1].version}.${versionParts[versionParts.length - 1].parts}`
            ) + 1,
            patchesSinceLastRun: getPatchGap(
                versionParts,
                banner.versions[banner.versions.length - 1],
                `${versionParts[versionParts.length - 1].version}.${versionParts[versionParts.length - 1].parts}`
            ),
            avgBannerGapInterval: getAvgBannerGapInterval(versionParts, banner),
            avgPatchGapInterval: getAvgPatchGapInterval(versionParts, banner),
            avgDaysInterval: getAvgDayInterval(banner),
        })
    })

    return result
}

//=======================================================
// New Stuff
//=======================================================

export function getColorClassName(p: number): string {
    if (p >= HighRange) {
        return 'dark'
    } else if (p >= MidRange) {
        return 'normal'
    }
    return 'light'
}

export function getPercent(nom: number, denom: number): number {
    return 100 * Math.max(0, nom) / Math.max(1, denom)
}

export function getFilterFunction(filterText: string): (s: CountSummary | AverageCountSummary) => boolean {
    if (!filterText.trim().length) {
        return () => true
    }

    if (filterText.startsWith('/') && filterText.endsWith('/')) {
        try {
            const re = new RegExp(filterText.substring(1, filterText.length - 1), 'i')
            return (s) => re.test(s.name)
        } catch (ignore) {

        }
    }

    return (s) => s.name.toLowerCase().includes(filterText!.toLowerCase())
}

function getCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    calculate: (banner: BannerSummary) => number,
): CountSummary[] {
    const result: CountSummary[] = []

    _.forIn(bannerSummaries, (banner, name) => {
        result.push({
            name,
            image: getImageFromName(name),
            count: calculate(banner),
        })
    })

    return result
}

export function getDaysSinceRunCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: string,
): CountSummary[] {
    dayjs.extend(utc);
    const currDayjs = dayjs.utc(currDate)
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => Math.max(
            0,
            currDayjs.diff(
                dayjs.utc(banner.dates[banner.dates.length - 1].end),
                'day',
            )
        ),
    )
}

export function getBannersSinceLastCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => getBannerGap(
            versionParts,
            banner.versions[banner.versions.length - 1],
            `${versionParts[versionParts.length - 1].version}.${versionParts[versionParts.length - 1].parts}`
        ) + 1,
    )
}

export function getPatchesSinceLastCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => getPatchGap(
            versionParts,
            banner.versions[banner.versions.length - 1],
            `${versionParts[versionParts.length - 1].version}.${versionParts[versionParts.length - 1].parts}`
        ),
    )
}

export function getRunsCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => banner.versions.length,
    )
}

function getAverageCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    calculateAll: (versionParts: VersionParts[], banner: BannerSummary) => number[],
): AverageCountSummary[] {
    const result: AverageCountSummary[] = []

    _.forIn(bannerSummaries, (banner, name) => {
        const counters = calculateAll(versionParts, banner)
        const average = counters.length ?
            _.round(_.sum(counters) / counters.length, 1) : 0
        const standardDeviation = counters.length ?
            _.round(
                Math.sqrt(
                    _.sum(
                        _.map(counters, (c) => Math.pow((c - average), 2))
                    ) / counters.length
                ), 1
            ) : 0

        result.push({
            name,
            image: getImageFromName(name),
            count: banner.versions.length,
            average,
            standardDeviation,
        })
    })

    return result
}

export function getAverageDaysInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): AverageCountSummary[] {
    dayjs.extend(utc);

    function getDayGaps(ignore: any, banner: BannerSummary): number[] {
        if (banner.dates.length < 2) {
            return []
        }

        const result = []
        for (let i = 0; i < banner.dates.length - 1; i++) {
            result.push(dayjs.utc(banner.dates[i + 1].start).diff(dayjs.utc(banner.dates[i].end), 'day'))
        }

        return result
    }

    return getAverageCountSummary(
        versionParts,
        bannerSummaries,
        getDayGaps,
    )
}