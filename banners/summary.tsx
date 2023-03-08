import {getBaseVersion, getVersionPart} from "@/banners/version";
import _ from "lodash";
import dayjs, {Dayjs} from "dayjs";
import {VersionParts} from "@/banners/types";
import {getImageFromName} from "@/format/image";
import utc from "dayjs/plugin/utc";

export const UnknownFutureCounter = -999999999
const DefaultBannerDayDuration = 21
const Dark9Percent = 85
const Dark8Percent = 70
const Dark7Percent = 55
const Dark6Percent = 40
const Dark5Percent = 25

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
    discrepancy: boolean
}

export type BannerSummary = {
    versions: string[]
    dates: DateRange[]
}

export type DateRange = {
    start: string
    end: string
}

export type DayjsRange = {
    start: Dayjs
    end: Dayjs
}

export type CommonSummaryProperties = {
    versionParts: VersionParts[]
    banners: { [name: string]: BannerSummary }
    type: string
    order: 'asc' | 'desc' | boolean
    filterText: string
}


function getNormalizedDayjsBannerDates(currDayjs: Dayjs, banner: BannerSummary): DayjsRange[] {
    function getEquivalentFutureDateFromCurrToRangeStart(range: DayjsRange): DayjsRange {
        return {
            start: range.end.subtract(range.start.diff(currDayjs, 'day'), 'day'),
            end: currDayjs,
        }
    }

    const result: DayjsRange[] = _.chain(banner.dates)
        .filter((dateRange) => dateRange.start != '')
        .map((dateRange) => {
            if (!dateRange.end) {
                return {
                    start: dayjs.utc(dateRange.start),
                    end: dayjs.utc(dateRange.start).add(DefaultBannerDayDuration, 'day'),
                }
            }

            return {
                start: dayjs.utc(dateRange.start),
                end: dayjs.utc(dateRange.end),
            }
        })
        .value()

    if (!result.length) {
        return []
    }

    if (result[result.length - 1].start.isAfter(currDayjs)) {
        result.push(getEquivalentFutureDateFromCurrToRangeStart(result[result.length - 1]))
    } else if (currDayjs.isAfter(result[result.length - 1].end)) {
        result.push({
            start: currDayjs,
            end: currDayjs,
        })
    } else {
        result.push({
            start: result[result.length - 1].end,
            end: result[result.length - 1].end,
        })
    }

    return result
}

function getNormalizedBannerDateGaps(currDayjs: Dayjs, banner: BannerSummary): number[] {
    const dateRanges = getNormalizedDayjsBannerDates(currDayjs, banner)

    const result = []
    for (let i = 0; i < dateRanges.length - 1; i++) {
        result.push(dateRanges[i + 1].start.diff(dateRanges[i].end, 'day'))
    }

    return result
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


export function getColorClassName(p: number): string {
    if (p >= Dark9Percent) {
        return 'dark-9'
    } else if (p >= Dark8Percent) {
        return 'dark-8'
    } else if (p >= Dark7Percent) {
        return 'dark-7'
    } else if (p >= Dark6Percent) {
        return 'dark-6'
    } else if (p >= Dark5Percent) {
        return 'dark-5'
    }
    return 'dark-4'
}

export function getPercent(nom: number, denom: number): number {
    if (nom < 0) {
        return 0
    }

    return Math.max(.5, 100 * Math.max(0, nom) / Math.max(1, denom))
}

export function getFilterFunction(filterText: string): (s: { name: string }) => boolean {
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

function canShowNonFutureLastRun(currDayjs: Dayjs, banner: BannerSummary): boolean {
    return banner.dates[banner.dates.length - 1].start != ''
        && currDayjs.isBefore(dayjs.utc(banner.dates[banner.dates.length - 1].start))
        && banner.dates.length > 1
}

export function getDaysSinceRunCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: string,
): CountSummary[] {
    function canShowNonFutureLastRun(banner: BannerSummary): boolean {
        return banner.dates[banner.dates.length - 1].start != ''
            && currDayjs.isBefore(dayjs.utc(banner.dates[banner.dates.length - 1].start))
            && banner.dates.length > 1
    }

    dayjs.extend(utc);

    const currDayjs = dayjs.utc(currDate)
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => {
            if (banner.dates.length === 1 && banner.dates[0].start === '') {
                return UnknownFutureCounter
            }

            if (canShowNonFutureLastRun(banner)) {
                return currDayjs.diff(dayjs.utc(banner.dates[banner.dates.length - 2].end), 'day')
            }

            return _.last(getNormalizedBannerDateGaps(currDayjs, banner)) as number
        },
    )
}


export function getCurrentVersionPart(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDajs: Dayjs,
): VersionParts {
    let end = versionParts.length - 1
    let result: VersionParts
    let latest: BannerSummary

    do {
        result = {...versionParts[end]}
        latest = _.chain(bannerSummaries)
            .values()
            .filter((banner) => getBaseVersion(_.last(banner.versions) as string) == result.version)
            .filter((banner) => banner.dates[banner.dates.length - 1].start != '')
            .filter((banner) => currDajs.diff(
                dayjs.utc(banner.dates[banner.dates.length - 1].start, 'day')) >= 0)
            .orderBy((banner) => banner.dates[banner.dates.length - 1].start, 'desc')
            .first()
            .value()
        --end
    } while (latest === undefined)

    result.parts = getVersionPart(latest.versions[latest.versions.length - 1])

    return result
}


function isFutureNewRelease(currentVersion: VersionParts, banner: BannerSummary): boolean {
    return banner.versions.length === 1 && (
        currentVersion.version < getBaseVersion(banner.versions[0])
        || (currentVersion.version == getBaseVersion(banner.versions[0])
            && currentVersion.parts < getVersionPart(banner.versions[0]))
    )
}

// for our intents and purposes, we really just need to look at either the last or 2nd last element
function getNonFutureVersion(currentVersion: VersionParts, banner: BannerSummary): string {
    if (banner.versions.length > 1) {
        if (getBaseVersion(banner.versions[banner.versions.length - 1]) > currentVersion.version
            || (getBaseVersion(banner.versions[banner.versions.length - 1]) == currentVersion.version
                && getVersionPart(banner.versions[banner.versions.length - 1]) > currentVersion.parts)) {
            return banner.versions[banner.versions.length - 2]
        }
    }

    return banner.versions[banner.versions.length - 1]
}

export function getBannersSinceLastCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: string,
): CountSummary[] {
    dayjs.extend(utc);

    const currentVersion = getCurrentVersionPart(
        versionParts,
        bannerSummaries,
        dayjs.utc(currDate))
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => {
            if (isFutureNewRelease(currentVersion, banner)) {
                return -(getBannerGap(
                    versionParts,
                    `${currentVersion.version}.${currentVersion.parts}`,
                    banner.versions[0],
                ) + 1)
            }

            return getBannerGap(
                versionParts,
                getNonFutureVersion(currentVersion, banner),
                `${currentVersion.version}.${currentVersion.parts}`
            ) + 1
        },
    )
}

export function getPatchesSinceLastCountSummary(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: string,
): CountSummary[] {
    dayjs.extend(utc);

    // for now, can say 'today' is current (doesn't affect existing tests yet)
    const currentVersion = getCurrentVersionPart(
        versionParts,
        bannerSummaries,
        dayjs.utc(currDate))

    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner) => {
            if (isFutureNewRelease(currentVersion, banner)) {
                return -getPatchGap(
                    versionParts,
                    `${currentVersion.version}.${currentVersion.parts}`,
                    banner.versions[0],
                )
            }

            return getPatchGap(
                versionParts,
                getNonFutureVersion(currentVersion, banner),
                `${currentVersion.version}.${currentVersion.parts}`
            )
        },
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
        const average = counters.length ? _.sum(counters) / counters.length : 0
        const standardDeviation = counters.length ? Math.sqrt(
            _.sumBy(
                counters,
                (c) => Math.pow(c - average, 2)
            ) / counters.length
        ) : 0

        result.push({
            name,
            image: getImageFromName(name),
            count: counters.length + 1,
            average: _.round(average, 1),
            standardDeviation: _.round(standardDeviation, 1),
            discrepancy: counters.length + 1 != banner.versions.length,
        })
    })

    return result
}

function getDayGaps(ignore: any, banner: BannerSummary): number[] {
    const result = []
    for (let i = 0; i < banner.dates.length - 1; i++) {
        if (banner.dates[i].end == '' || banner.dates[i + 1].start == '') {
            continue
        }
        result.push(dayjs.utc(banner.dates[i + 1].start).diff(dayjs.utc(banner.dates[i].end), 'day'))
    }

    return result
}

export function getAverageDaysInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): AverageCountSummary[] {
    dayjs.extend(utc);

    return getAverageCountSummary(
        versionParts,
        bannerSummaries,
        getDayGaps,
    )
}

function getBannerGaps(versionParts: VersionParts[], banner: BannerSummary): number[] {
    const result = []
    for (let i = 0; i < banner.versions.length - 1; i++) {
        result.push(getBannerGap(versionParts, banner.versions[i], banner.versions[i + 1]))
    }

    return result
}

export function getAverageBannersInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): AverageCountSummary[] {
    return getAverageCountSummary(
        versionParts,
        bannerSummaries,
        getBannerGaps,
    )
}

function getPatchGaps(versionParts: VersionParts[], banner: BannerSummary): number[] {
    const result = []
    for (let i = 0; i < banner.versions.length - 1; i++) {
        result.push(getPatchGap(versionParts, banner.versions[i], banner.versions[i + 1]))
    }

    return result
}

export function getAveragePatchesInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): AverageCountSummary[] {
    return getAverageCountSummary(
        versionParts,
        bannerSummaries,
        getPatchGaps,
    )
}

export function getLongestDaysInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: string,
): CountSummary[] {
    dayjs.extend(utc);

    const currDayjs = dayjs.utc(currDate)
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner: BannerSummary): number => {
            return Math.max(...getNormalizedBannerDateGaps(currDayjs, banner), 0)
        },
    )
}


export function getShortestDaysInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
    currDate: string,
): CountSummary[] {
    dayjs.extend(utc);

    const currDayjs = dayjs.utc(currDate)
    return getCountSummary(
        versionParts,
        _.pickBy(bannerSummaries, (banner) => banner.versions.length > 1),
        (banner: BannerSummary): number => {
            const existingDayGaps = getDayGaps(null, banner)
            const ongoingDayGaps = getNormalizedBannerDateGaps(currDayjs, banner)

            if (!existingDayGaps.length) {
                return Math.max(0, Math.min(...ongoingDayGaps))
            }

            return Math.max(Math.min(...existingDayGaps), Math.min(...ongoingDayGaps))
        },
    )
}

function isLastVersionLatest(versionParts: VersionParts[],
                             banner: BannerSummary): boolean {
    return getBaseVersion(banner.versions[banner.versions.length - 1]) == versionParts[versionParts.length - 1].version
}

function isLastVersionLatestBanner(versionParts: VersionParts[],
                                   banner: BannerSummary): boolean {
    return banner.versions[banner.versions.length - 1] == versionParts[versionParts.length - 1].version + "." + versionParts[versionParts.length - 1].parts
}

export function getLongestBannersInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner: BannerSummary): number => {
            const ongoingBanner = {
                dates: banner.dates,
                versions: isLastVersionLatestBanner(versionParts, banner) ? banner.versions : [
                    ...banner.versions,
                    versionParts[versionParts.length - 1].version + '.' + (versionParts[versionParts.length - 1].parts + 1),
                ],
            }
            return Math.max(...getBannerGaps(versionParts, ongoingBanner), 0)
        },
    )
}

export function getShortestBannersInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        _.pickBy(bannerSummaries, (banner) => banner.versions.length > 1),
        (banner: BannerSummary): number => {
            const ongoingBanner = {
                dates: banner.dates,
                versions: isLastVersionLatestBanner(versionParts, banner) ? banner.versions : [
                    ...banner.versions,
                    versionParts[versionParts.length - 1].version + '.' + (versionParts[versionParts.length - 1].parts + 1),
                ],
            }

            const ongoingGaps = getBannerGaps(versionParts, ongoingBanner)
            if (!ongoingGaps.length) {
                return 0
            }

            if (banner.versions.length == 1) {
                return Math.min(...ongoingGaps)
            }

            return Math.max(Math.min(...getBannerGaps(versionParts, banner)), Math.min(...ongoingGaps))
        },
    )
}

export function getLongestPatchesInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        bannerSummaries,
        (banner: BannerSummary): number => {
            const ongoingBanner = {
                dates: banner.dates,
                versions: isLastVersionLatest(versionParts, banner) ? banner.versions : [
                    ...banner.versions,
                    versionParts[versionParts.length - 1].version + '.' + versionParts[versionParts.length - 1].parts,
                ],
            }

            if (isLastVersionLatest(versionParts, banner)) {
                return Math.max(...getPatchGaps(versionParts, ongoingBanner), 0)
            }

            const gaps = getPatchGaps(versionParts, ongoingBanner)
            gaps[gaps.length - 1]++
            return Math.max(...gaps, 0)
        },
    )
}

export function getShortestPatchesInBetween(
    versionParts: VersionParts[],
    bannerSummaries: { [name: string]: BannerSummary },
): CountSummary[] {
    return getCountSummary(
        versionParts,
        _.pickBy(bannerSummaries, (banner) => banner.versions.length > 1),
        (banner: BannerSummary): number => {
            const ongoingBanner = {
                dates: banner.dates,
                versions: isLastVersionLatest(versionParts, banner) ? banner.versions : [
                    ...banner.versions,
                    versionParts[versionParts.length - 1].version + '.' + versionParts[versionParts.length - 1].parts,
                ],
            }

            const gaps = getPatchGaps(versionParts, ongoingBanner)
            if (!gaps.length) {
                return 0
            }

            if (!isLastVersionLatest(versionParts, banner)) {
                gaps[gaps.length - 1]++
            }

            if (banner.versions.length == 1) {
                return Math.min(...gaps)
            }

            return Math.max(Math.min(...getPatchGaps(versionParts, banner)), Math.min(...gaps))
        },
    )
}