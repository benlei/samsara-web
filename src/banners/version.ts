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
    // Handle Luna versions as continuation of version 5
    // Luna I = 5.9, Luna II = 5.10, Luna III = 5.11, ..., Luna VIII = 5.16
    if (version.startsWith("Luna ")) {
        const romanPart = version.substring(5).split('.')[0]; // Get the Roman numeral part
        const romanToNumber: { [key: string]: number } = {
            'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 
            'VI': 6, 'VII': 7, 'VIII': 8
        };
        
        const lunaNumber = romanToNumber[romanPart];
        if (lunaNumber) {
            // Luna I = 5.9 (50900), Luna II = 5.10 (51000), etc.
            return 50000 + (8 + lunaNumber) * 100;
        }
    }
    
    let result = 0;
    let scale = 10000;
    for (const v of version.split(".")) {
        const parsed = parseInt(v);
        if (isNaN(parsed)) {
            // If we encounter non-numeric parts, return a very high number
            // to place it at the end when sorting in ascending order
            return Number.MAX_SAFE_INTEGER;
        }
        result += parsed * scale;
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