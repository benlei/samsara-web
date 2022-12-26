import {BannerResource, ResourceCounter, VersionParts} from "@/banners/types";
import _ from "lodash";
import getVersionParts, {getBaseVersion, getVersionPart} from "@/banners/version";

function getImageFromName(name: string) {
    return name.replaceAll(/[^a-zA-Z0-9\-]/ig, '')
        .replaceAll(/ /g, '-')
        .replaceAll(/--+/g, '-');
}

function fillPrereleaseCounter(versionParts: VersionParts[], resourceCounter: ResourceCounter, firstVersion: string): number {
    let versionIndex = versionParts.length - 1
    while (versionIndex > -1 && versionParts[versionIndex].version != getBaseVersion(firstVersion)) {
        resourceCounter.counter = [
            ...resourceCounter.counter,
            ...Array(versionParts[versionIndex].parts).fill(-1)
        ]
        versionIndex--;
    }

    const versionPart = getVersionPart(firstVersion)

    resourceCounter.counter = [
        ...resourceCounter.counter,
        ...Array(versionPart - 1).fill(-1),
    ]
    return versionIndex;
}

export function getRundown(banners: BannerResource): ResourceCounter[] {
    const versionParts = getVersionParts(banners)
    const result: ResourceCounter[] = []

    for (const name of Object.keys(banners)) {
        let resourceCounter: ResourceCounter = {
            name,
            image: getImageFromName(name),
            counter: [],
        }



        // fill out versions before it was released
        let versionIndex = fillPrereleaseCounter(versionParts, resourceCounter, banners[name][0]);
        let waitParts = 0;
        let start = getVersionPart(banners[name][0]);
        let bannerVersionIndex = 0;
        while (versionIndex > -1) {
            let currBaseVersion: string = "0";
            let currVersionPart: number = 999;
            if (bannerVersionIndex != banners[name].length) {
                currBaseVersion = getBaseVersion(banners[name][bannerVersionIndex])
                currVersionPart = getVersionPart(banners[name][bannerVersionIndex])
            }

            for (let i = start; i <= versionParts[versionIndex].parts; i++) {
                if (currBaseVersion == versionParts[versionIndex].version && i == currVersionPart) {
                    resourceCounter.counter.push(0)
                    waitParts = 1
                    bannerVersionIndex++;
                } else {
                    resourceCounter.counter.push(waitParts++)
                }
            }
            versionIndex--;
            start = 1
        }


        resourceCounter.counter = resourceCounter.counter.reverse()
        result.push(resourceCounter)
    }


    return _.chain(result)
        .orderBy((rc) => banners[rc.name][0], 'desc')
        .value()
}