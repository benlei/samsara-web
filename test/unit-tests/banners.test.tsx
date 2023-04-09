import 'jest';
import _ from "lodash";
import getVersionParts from "@/banners/version";
import {getRundowns} from "@/banners/rundown";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import {Featured, FeaturedHistory} from "@/banners/types";

describe('getVersionParts', () => {
    it('should get all version parts', async () => {
        const versionParts = getVersionParts(
            _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fiveStarCharacters as Featured[])
                .map((v) => v.versions)
                .flatten()
                .value()
        )
        expect(versionParts.length).toBeGreaterThanOrEqual(15)
    });

    it('should end with 1.0', async () => {
        const versionParts = getVersionParts(
            _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fiveStarCharacters as Featured[])
                .map((v) => v.versions)
                .flatten()
                .value()
        )
        expect(versionParts[versionParts.length - 1].version).toEqual("1.0")
        expect(versionParts[versionParts.length - 1].parts).toEqual(2)
    });

    it('should have 3 parts for 1.3', async () => {
        const versionParts = getVersionParts(
            _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fiveStarCharacters as Featured[])
                .map((v) => v.versions)
                .flatten()
                .value()
        )
        expect(versionParts[versionParts.length - 4].parts).toEqual(3)
    });
});


describe('getRundown()', () => {
    it('should have last element as Venti', async () => {
        const rundown = _.chain(getRundowns(
            _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fiveStarCharacters)
                .map((featured) => _.omit(featured, 'dates'))
                .value() as FeaturedHistory[],
        ))
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
            11, 10, 9, 8, 7, 6, 5, 4, 3, 2,
            1, 0, 8, 7, 6, 5, 4, 3, 2, 1, 0
        ])
    });
    it('should have Keqing once', async () => {
        const rundown = _.chain(getRundowns(
            _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fiveStarCharacters)
                .map((featured) => _.omit(featured, 'dates'))
                .value() as FeaturedHistory[],
        ))
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
        const rundown = _.chain(
            getRundowns(
                _.chain(YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fourStarCharacters)
                    .map((featured) => _.omit(featured, 'dates'))
                    .value() as FeaturedHistory[],
            )
        )
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