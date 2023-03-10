import 'jest';
import _ from "lodash";
import getVersionParts from "@/banners/version";
import {getRundowns} from "@/banners/rundown";

describe('getVersionParts', () => {
    it('should get all version parts', async () => {
        const banners = require('@/data/banners.json')
        const versionParts = getVersionParts(_.mapValues(banners.characters["5"], (v) => v.versions))
        expect(versionParts.length).toBeGreaterThanOrEqual(15)
    });

    it('should end with 1.0', async () => {
        const banners = require('@/data/banners.json')
        const versionParts = getVersionParts(_.mapValues(banners.characters["5"], (v) => v.versions))
        expect(versionParts[versionParts.length - 1].version).toEqual("1.0")
        expect(versionParts[versionParts.length - 1].parts).toEqual(2)
    });

    it('should have 3 parts for 1.3', async () => {
        const banners = require('@/data/banners.json')
        const versionParts = getVersionParts(_.mapValues(banners.characters["5"], (v) => v.versions))
        expect(versionParts[versionParts.length - 4].parts).toEqual(3)
    });
});


describe('getRundown()', () => {
    it('should have last element as Venti', async () => {
        const banners = require('@/data/banners.json')
        const rundown = _.chain(getRundowns(_.mapValues(banners.characters["5"], (v) => v.versions)))
            .filter((r) => r.name == 'Venti')
            .first()
            .value()
        expect(rundown.name).toEqual("Venti")
        expect(rundown.image).toEqual("Venti")
        expect(rundown.runs).toBeGreaterThan(3)
        expect(rundown.counter.length).toBeGreaterThan(40)
        expect(_.chain(rundown.counter)
            .filter((v) => v == 0)
            .value()
            .length).toBeGreaterThan(3)
        expect(rundown.counter.slice(-28)).toEqual([
            0, 17, 16, 15, 14, 13, 12,
            11, 10, 9, 8,  7,  6,  5,  4,  3,  2,
            1,  0, 8, 7,  6,  5,  4,  3,  2,  1, 0
        ])
    });
    it('should have Keqing once', async () => {
        const banners = require('@/data/banners.json')
        const rundown = _.chain(getRundowns(_.mapValues(banners.characters["5"], (v) => v.versions)))
            .filter((r) => r.name == 'Keqing')
            .first()
            .value()
        expect(rundown.name).toEqual("Keqing")
        expect(rundown.counter.length).toBeGreaterThan(40)
        expect(rundown.runs).toEqual(1)
        expect(_.chain(rundown.counter)
            .filter((v) => v == 0)
            .value()
            .length).toEqual(1)

        expect(rundown.counter.slice(-9)).toEqual([
            1, 0, -1, -1, -1, -1, -1, -1, -1
        ])
    });


    it('Ensure yanfei looks about right', async () => {
        const banners = require('@/data/banners.json')
        const rundown = _.chain(getRundowns(_.mapValues(banners.characters["4"], (v) => v.versions)))
            .filter((r) => r.name == 'Yanfei')
            .first()
            .value()

        expect(rundown.name).toEqual("Yanfei")
        expect(_.chain(rundown.counter)
            .filter((v) => v == 0)
            .value()
            .length).toBeGreaterThan(5)
    });
})