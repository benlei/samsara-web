import 'jest';
import _ from "lodash";
import getVersionParts from "@/banners/version";
import {getRundown} from "@/banners/rundown";

describe('getVersionParts', () => {
    it('should get all version parts', async () => {
        const banners = require('@/data/banners.json')
        const versionParts = getVersionParts(banners.characters["5"])
        expect(versionParts.length).toBeGreaterThanOrEqual(15)
    });

    it('should end with 1.0', async () => {
        const banners = require('@/data/banners.json')
        const versionParts = getVersionParts(banners.characters["5"])
        expect(versionParts[versionParts.length - 1].version).toEqual("1.0")
        expect(versionParts[versionParts.length - 1].parts).toEqual(2)
    });

    it('should have 3 parts for 1.3', async () => {
        const banners = require('@/data/banners.json')
        const versionParts = getVersionParts(banners.characters["5"])
        expect(versionParts[versionParts.length - 4].parts).toEqual(3)
    });
});


describe('getRundown()', () => {
    it('should have last element as Venti', async () => {
        const banners = require('@/data/banners.json')
        const rundown = getRundown(banners.characters["5"])
        expect(rundown[rundown.length - 1].name).toEqual("Venti")
        expect(rundown[rundown.length - 1].image).toEqual("Venti")
        expect(rundown[rundown.length - 1].counter.length).toBeGreaterThan(40)
        expect(_.chain(rundown[rundown.length - 1].counter)
            .filter((v) => v == 0)
            .value()
            .length).toBeGreaterThan(3)
        expect(rundown[rundown.length - 1].counter.slice(-28)).toEqual([
            0, 17, 16, 15, 14, 13, 12,
            11, 10, 9, 8,  7,  6,  5,  4,  3,  2,
            1,  0, 8, 7,  6,  5,  4,  3,  2,  1, 0
        ])
    });
    it('should have Keqing once', async () => {
        const banners = require('@/data/banners.json')
        const rundown = getRundown(banners.characters["5"])
        expect(rundown[rundown.length - 8].name).toEqual("Keqing")
        expect(rundown[rundown.length - 8].counter.length).toBeGreaterThan(40)
        expect(_.chain(rundown[rundown.length - 8].counter)
            .filter((v) => v == 0)
            .value()
            .length).toEqual(1)

        expect(rundown[rundown.length - 8].counter.slice(-9)).toEqual([
            1, 0, -1, -1, -1, -1, -1, -1, -1
        ])
    });
})