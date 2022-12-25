import {BannerResource, VersionParts} from "@/banners/types";
import _ from "lodash";

type VersionCount = {
    [version: string]: number
}


function getBaseVersion(version: string): string {
    return version.substring(0, version.lastIndexOf('.'))
}

function getVersionPart(version: string): number {
    return parseInt(version.substring(version.lastIndexOf('.') + 1))
}

export default function getVersionParts(banners: BannerResource): VersionParts[] {
    const versionCounts: VersionCount = {}
    for (const characterName of Object.keys(banners)) {
        for (const version of banners[characterName]) {
            versionCounts[getBaseVersion(version)] = Math.max(
                versionCounts[getBaseVersion(version)] || 0,
                getVersionPart(version),
            )
        }
    }

    return _.chain(versionCounts)
        .transform(function (res: VersionParts[], parts: number, version: string) {
            res.push({version, parts})
            return true;
        }, [])
        .orderBy((vp: VersionParts) => vp.version, 'desc')
        .value()
}