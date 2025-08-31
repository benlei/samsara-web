import {Featured, VersionParts} from "@/banners/types";
import _ from "lodash";
import {Order} from "@/lotypes/sort";

type VersionCount = {
    [version: string]: number
}

// Roman numeral to number mapping for Luna versions
const ROMAN_TO_NUMBER: { [key: string]: number } = {
    'I': 1,
    'II': 2,
    'III': 3,
    'IV': 4,
    'V': 5,
    'VI': 6,
    'VII': 7,
    'VIII': 8
};

// Helper function to check if a version is a Luna version
export function isLunaVersion(version: string): boolean {
    return version.startsWith('Luna ');
}

// Convert Luna version to its numeric equivalent (e.g., "Luna I" -> "5.9", "Luna II" -> "5.10")
export function lunaVersionToNumeric(version: string): string {
    if (!isLunaVersion(version)) {
        return version;
    }
    
    // Extract the roman numeral part (e.g., "Luna I.1" -> "I")
    const parts = version.replace('Luna ', '').split('.');
    const romanNumeral = parts[0];
    const patch = parts.length > 1 ? `.${parts[1]}` : '';
    
    const lunaNumber = ROMAN_TO_NUMBER[romanNumeral];
    if (!lunaNumber) {
        throw new Error(`Unknown Luna version: ${version}`);
    }
    
    // Luna I = 5.9, Luna II = 5.10, etc.
    const numericVersion = `5.${8 + lunaNumber}${patch}`;
    return numericVersion;
}

// Get the display version (keeps Luna versions as-is, returns others unchanged)
export function getDisplayVersion(version: string): string {
    return version;
}


export function getBaseVersion(version: string): string {
    // Convert Luna versions to numeric equivalents for processing
    const numericVersion = lunaVersionToNumeric(version);
    return numericVersion.substring(0, numericVersion.lastIndexOf('.'))
}

export function getVersionPart(version: string): number {
    // Convert Luna versions to numeric equivalents for processing
    const numericVersion = lunaVersionToNumeric(version);
    return parseInt(numericVersion.substring(numericVersion.lastIndexOf('.') + 1))
}

export function versionToNumber(version: string): number {
    // Convert Luna versions to numeric equivalents for sorting
    const numericVersion = lunaVersionToNumeric(version);
    let result = 0;
    let scale = 10000;
    for (const v of numericVersion.split(".")) {
        result += parseInt(v) * scale
        scale /= 100;
    }

    return result;
}

export default function getVersionParts(versions: string[], order: Order = 'desc'): VersionParts[] {
    const versionCounts: VersionCount = {}
    for (const version of versions) {
        const baseVersion = getBaseVersion(version);
        versionCounts[baseVersion] = Math.max(
            versionCounts[baseVersion] || 0,
            getVersionPart(version),
        )
    }

    // Create version parts but keep original display versions
    const versionParts: VersionParts[] = [];
    for (const [baseVersion, parts] of Object.entries(versionCounts)) {
        // Find the original version string that corresponds to this base version
        const originalVersion = versions.find(v => getBaseVersion(v) === baseVersion);
        if (originalVersion) {
            // Use the display version (Luna versions stay as Luna)
            const displayBase = isLunaVersion(originalVersion) ? 
                originalVersion.replace(/\.\d+$/, '') : baseVersion;
            versionParts.push({ version: displayBase, parts });
        }
    }

    return _.chain(versionParts)
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