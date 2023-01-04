import {getBaseVersion, getVersionPart} from "@/banners/version";
import _ from "lodash";
import dayjs, {Dayjs} from "dayjs";
import {VersionParts} from "@/banners/types";
import {getImageFromName} from "@/format/image";

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

export type BannerSummary = {
    versions: string[]
    dates: DateRange[]
}

export type DateRange = {
    start: string
    end: string
}

export function getBannerPatchGap(versionParts: VersionParts[], oldVersion: string, newVersion: string): number {
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
        sum += getBannerPatchGap(versionParts, banner.versions[i], banner.versions[i + 1])
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
        sum += dayjs(banner.dates[i + 1].start).diff(dayjs(banner.dates[i].end), 'day')
    }

    return _.round(sum / (banner.dates.length - 1), 1)
}

export function getResourceSummaries(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: Dayjs,
): ResourceSummary[] {
    // const versionParts = getVersionParts(
    //     _.chain(bannerSummaries)
    //         .mapValues((b) => b.versions)
    //         .value(),
    //     'asc',
    // )

    const result: ResourceSummary[] = []

    _.forIn(bannerSummaries, (banner, name) => {
        result.push({
            name,
            image: getImageFromName(name),
            runs: banner.versions.length,
            daysSinceLastRun: Math.max(0, currDate.diff(dayjs(banner.dates[banner.dates.length - 1].end), 'day')),
            bannersSinceLastRun: getBannerGap(
                versionParts,
                banner.versions[banner.versions.length - 1],
                `${versionParts[versionParts.length - 1].version}.${versionParts[versionParts.length - 1].parts}`
            ) + 1,
            patchesSinceLastRun: getBannerPatchGap(
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