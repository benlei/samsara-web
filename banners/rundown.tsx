import {BannerResource, ResourceCounter} from "@/banners/types";
import _ from "lodash";
import getVersionParts, {getBaseVersion, getVersionPart} from "@/banners/version";

export function getRundown(banners: BannerResource): ResourceCounter[] {
    const versionParts = getVersionParts(banners)
    const result: ResourceCounter[] = []

    for (const name of Object.keys(banners)) {
        let waitParts = -1;
        let versionIndex = versionParts.length - 1;
        let resourceCounter: ResourceCounter = {
            name,
            image: name.replaceAll(/[^a-zA-Z0-9\-]/ig, '')
                .replaceAll(/ /g, '-')
                .replaceAll(/--+/g, '-'),
            counter: [],
        }


        const baseVersion = getBaseVersion(banners[name][0])

        // fill out versions before it was released
        while (versionIndex > -1 && versionParts[versionIndex].version != baseVersion) {
            resourceCounter.counter = [
                ...resourceCounter.counter,
                ...Array(versionParts[versionIndex].parts).fill(-1)
            ]
            versionIndex--;
        }

        const versionPart = getVersionPart(banners[name][0])
        // fill out parts they didn't show up in as well
        resourceCounter.counter = [
            ...resourceCounter.counter,
            ...Array(versionPart - 1).fill(-1),
        ]

        let bannerVersionIndex = 0;
        let start = versionPart;
        while (versionIndex > -1) {
            let currBaseVersion: string = "0"
            if (bannerVersionIndex != banners[name].length) {
                currBaseVersion = getBaseVersion(banners[name][bannerVersionIndex])
            }

            for (let i = start; i <= versionParts[versionIndex].parts; i++) {
                if (currBaseVersion == versionParts[versionIndex].version && i == versionPart) {
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