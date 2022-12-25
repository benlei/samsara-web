import 'jest';
import getVersionParts from "@/banners/versions";

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
