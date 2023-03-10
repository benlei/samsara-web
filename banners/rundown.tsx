import {BannerResource, ResourceBanner, VersionParts} from "@/banners/types";
import _ from "lodash";
import getVersionParts, {getBaseVersion, getVersionPart} from "@/banners/version";
import {getImageFromName} from "@/format/image";


function fillPrereleaseCounter(versionParts: VersionParts[], resourceCounter: ResourceBanner, firstVersion: string): number {
    let versionIndex = versionParts.length - 1
    let countParts = 0

    while (versionIndex > -1 && versionParts[versionIndex].version != getBaseVersion(firstVersion)) {
        countParts += versionParts[versionIndex].parts
        versionIndex--;
    }

    resourceCounter.counter = Array(countParts + getVersionPart(firstVersion) - 1).fill(-1)

    return versionIndex;
}

function fillWaitCounter(versions: string[], versionIndex: number, versionParts: VersionParts[], resourceCounter: ResourceBanner) {
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

export function getRundowns(banners: BannerResource): ResourceBanner[] {
    const versionParts = getVersionParts(banners)
    const result: ResourceBanner[] = []

    for (const name of Object.keys(banners)) {
        let resourceCounter: ResourceBanner = {
            name,
            image: getImageFromName(name),
            runs: banners[name].length,
            banners: banners[name],
            counter: [],
        }

        // fill out versions before it was released
        fillWaitCounter(
            banners[name],
            fillPrereleaseCounter(versionParts, resourceCounter, banners[name][0]),
            versionParts,
            resourceCounter
        );

        resourceCounter.counter = resourceCounter.counter.reverse()
        result.push(resourceCounter)
    }

    return _.chain(result)
        .orderBy((r) => `${r.banners[r.banners.length - 1]}-${r.image}`, 'desc')
        .value()
}