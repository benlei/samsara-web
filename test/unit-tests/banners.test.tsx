import 'jest';
import getVersionParts from "@/banners/versions";

describe('getVersionParts', () => {
    it('should get all version parts', async () => {
        const banners = require('@/data/banners.json')
        const versionParts = getVersionParts(banners.characters["5"])
        expect(versionParts.length).toBeGreaterThanOrEqual(15)
    });
});
