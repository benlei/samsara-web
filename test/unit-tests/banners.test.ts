import 'jest';
import _ from "lodash";
import getVersionParts, {versionToNumber} from "@/banners/version";
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

    it('should sort Luna I, Luna II, and versions 6.0-6.2 correctly', () => {
        const testVersions = [
            "5.8.1", "5.8.2",
            "Luna I.1", "Luna I.2", 
            "Luna II.1", "Luna II.2",
            "6.0.1", "6.0.2",
            "6.1.1", "6.1.2",
            "6.2.1", "6.2.2"
        ];
        
        const versionParts = getVersionParts(testVersions, 'asc');
        const versionOrder = versionParts.map(v => v.version);
        
        // Expected order: 5.8, Luna I (5.9), Luna II (5.10), 6.0, 6.1, 6.2
        expect(versionOrder).toEqual([
            "5.8", "Luna I", "Luna II", "6.0", "6.1", "6.2"
        ]);
    });

    it('should sort Luna I, Luna II, and versions 6.0-6.2 correctly in descending order', () => {
        const testVersions = [
            "5.8.1", "5.8.2",
            "Luna I.1", "Luna I.2", 
            "Luna II.1", "Luna II.2",
            "6.0.1", "6.0.2",
            "6.1.1", "6.1.2",
            "6.2.1", "6.2.2"
        ];
        
        const versionParts = getVersionParts(testVersions, 'desc');
        const versionOrder = versionParts.map(v => v.version);
        
        // Expected order (descending): 6.2, 6.1, 6.0, Luna II (5.10), Luna I (5.9), 5.8
        expect(versionOrder).toEqual([
            "6.2", "6.1", "6.0", "Luna II", "Luna I", "5.8"
        ]);
    });

    it('should handle all Luna versions I through VIII correctly', () => {
        const testVersions = [
            "5.8.1", "5.8.2",
            "Luna I.1", "Luna II.1", "Luna III.1", "Luna IV.1",
            "Luna V.1", "Luna VI.1", "Luna VII.1", "Luna VIII.1",
            "6.0.1", "6.0.2"
        ];
        
        const versionParts = getVersionParts(testVersions, 'asc');
        const versionOrder = versionParts.map(v => v.version);
        
        // Luna I = 5.9, Luna II = 5.10, ..., Luna VIII = 5.16
        expect(versionOrder).toEqual([
            "5.8", "Luna I", "Luna II", "Luna III", "Luna IV", 
            "Luna V", "Luna VI", "Luna VII", "Luna VIII", "6.0"
        ]);
    });

    it('should handle all Luna versions I through VIII correctly in descending order', () => {
        const testVersions = [
            "5.8.1", "5.8.2",
            "Luna I.1", "Luna II.1", "Luna III.1", "Luna IV.1",
            "Luna V.1", "Luna VI.1", "Luna VII.1", "Luna VIII.1",
            "6.0.1", "6.0.2"
        ];
        
        const versionParts = getVersionParts(testVersions, 'desc');
        const versionOrder = versionParts.map(v => v.version);
        
        // Descending: 6.0, Luna VIII (5.16), ..., Luna I (5.9), 5.8
        expect(versionOrder).toEqual([
            "6.0", "Luna VIII", "Luna VII", "Luna VI", "Luna V", 
            "Luna IV", "Luna III", "Luna II", "Luna I", "5.8"
        ]);
    });

    it('should handle unknown non-numeric versions by placing them at the end', () => {
        const testVersions = [
            "5.8.1", "5.8.2",
            "Luna I.1", "Luna I.2", 
            "Luna II.1", "Luna II.2",
            "6.0.1", "6.0.2",
            "Unknown.1", "Unknown.2"
        ];
        
        const versionParts = getVersionParts(testVersions, 'asc');
        const versionOrder = versionParts.map(v => v.version);
        
        // Unknown versions should come after all known versions
        expect(versionOrder).toEqual([
            "5.8", "Luna I", "Luna II", "6.0", "Unknown"
        ]);
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
    it('should have Keqing at least once', async () => {
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
        expect(rundown.runs).toBeGreaterThan(0)
        expect(_.chain(rundown.counter)
            .filter((v) => v == 0)
            .value()
            .length).toBeGreaterThan(0)

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
