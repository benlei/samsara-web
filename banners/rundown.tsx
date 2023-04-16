import {FeaturedHistory, DetailedFeaturedHistory, VersionParts} from "@/banners/types";
import _ from "lodash";
import getVersionParts, {getBaseVersion, getVersionPart} from "@/banners/version";
import {getImageFromName} from "@/format/image";


function fillPrereleaseCounter(versionParts: VersionParts[], resourceCounter: DetailedFeaturedHistory, firstVersion: string): number {
    let versionIndex = versionParts.length - 1
    let countParts = 0

    while (versionIndex > -1 && versionParts[versionIndex].version != getBaseVersion(firstVersion)) {
        countParts += versionParts[versionIndex].parts
        versionIndex--;
    }

    resourceCounter.counter = Array(countParts + getVersionPart(firstVersion) - 1).fill(-1)

    return versionIndex;
}

function fillWaitCounter(versions: string[], versionIndex: number, versionParts: VersionParts[], resourceCounter: DetailedFeaturedHistory) {
    let waitParts = 0;
    let start = getVersionPart(versions[0]);
    let bannerVersionIndex = 0;

    while (versionIndex > -1) {
        const currBaseVersion: string = getBaseVersion(versions[bannerVersionIndex] || "99.99.99");
        const currVersionPart: number = getVersionPart(versions[bannerVersionIndex] || "99.99.99");

        if (currBaseVersion == versionParts[versionIndex].version && start == currVersionPart) {
            resourceCounter.counter.push(0)
            waitParts = 1
            bannerVersionIndex++;
        } else {
            resourceCounter.counter.push(waitParts++)
        }

        start++;
        if (start > versionParts[versionIndex].parts) {
            start = 1;
            versionIndex--;
        }
    }
}

export function getRundowns(featuredList: FeaturedHistory[]): DetailedFeaturedHistory[] {
    const versionParts = getVersionParts(
        _.chain(featuredList)
            .map((featured) => featured.versions)
            .flatten()
            .value()
    )
    const result: DetailedFeaturedHistory[] = []

    for (const featured of featuredList) {
        let resourceCounter: DetailedFeaturedHistory = {
            name: featured.name,
            image: getImageFromName(featured.name),
            runs: featured.versions.length,
            versions: featured.versions,
            counter: [],
        }

        // fill out versions before it was released
        fillWaitCounter(
            featured.versions,
            fillPrereleaseCounter(versionParts, resourceCounter, featured.versions[0]),
            versionParts,
            resourceCounter
        );

        resourceCounter.counter = resourceCounter.counter.reverse()
        result.push(resourceCounter)
    }

    return result
}