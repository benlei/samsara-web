import {Featured, VersionParts} from "@/banners/types";
import _ from "lodash";
import {Order} from "@/lotypes/sort";

type VersionCount = {
    [version: string]: number
}


export function getBaseVersion(version: string): string {
    return version.substring(0, version.lastIndexOf('.'))
}

export function getVersionPart(version: string): number {
    return parseInt(version.substring(version.lastIndexOf('.') + 1))
}

export function versionToNumber(version: string): number {
    let result = 0;
    let scale = 10000;
    for (const v of version.split(".")) {
        result += parseInt(v) * scale
        scale /= 100;
    }

    return result;
}

export default function getVersionParts(versions: string[], order: Order = 'desc'): VersionParts[] {


    const versionCounts: VersionCount = {}
    for (const version of versions) {
        versionCounts[getBaseVersion(version)] = Math.max(
            versionCounts[getBaseVersion(version)] || 0,
            getVersionPart(version),
        )
    }

    return _.chain(versionCounts)
        .transform((res: VersionParts[], parts: number, version: string) => res.push({version, parts}), [])
        .orderBy((v: VersionParts) => versionToNumber(v.version), order)
        .value()
}


export function getVersionPartsFromFeaturedList(featuredList: Featured[], order: Order): VersionParts[] {
    return getVersionParts(
        _.chain(featuredList)
            .map((featured) => featured.versions)
            .flatten()
            .value(),
        order,
    )
}