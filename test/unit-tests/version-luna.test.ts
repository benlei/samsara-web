import { 
    isLunaVersion, 
    lunaVersionToNumeric, 
    getDisplayVersion,
    versionToNumber,
    getBaseVersion,
    getVersionPart
} from '@/banners/version';
import getVersionParts from '@/banners/version';
import { getFilterFunction } from '@/banners/summary';

describe('Luna Version Handling', () => {
    describe('isLunaVersion', () => {
        it('should identify Luna versions correctly', () => {
            expect(isLunaVersion('Luna I')).toBe(true);
            expect(isLunaVersion('Luna I.1')).toBe(true);
            expect(isLunaVersion('Luna II.2')).toBe(true);
            expect(isLunaVersion('Luna VIII')).toBe(true);
            expect(isLunaVersion('5.8')).toBe(false);
            expect(isLunaVersion('6.0')).toBe(false);
        });
    });

    describe('lunaVersionToNumeric', () => {
        it('should convert Luna versions to numeric equivalents', () => {
            expect(lunaVersionToNumeric('Luna I')).toBe('5.9');
            expect(lunaVersionToNumeric('Luna I.1')).toBe('5.9.1');
            expect(lunaVersionToNumeric('Luna I.2')).toBe('5.9.2');
            expect(lunaVersionToNumeric('Luna II')).toBe('5.10');
            expect(lunaVersionToNumeric('Luna II.1')).toBe('5.10.1');
            expect(lunaVersionToNumeric('Luna III')).toBe('5.11');
            expect(lunaVersionToNumeric('Luna VIII')).toBe('5.16');
        });

        it('should return non-Luna versions unchanged', () => {
            expect(lunaVersionToNumeric('5.8')).toBe('5.8');
            expect(lunaVersionToNumeric('5.8.1')).toBe('5.8.1');
            expect(lunaVersionToNumeric('6.0')).toBe('6.0');
        });

        it('should throw error for unknown Luna versions', () => {
            expect(() => lunaVersionToNumeric('Luna IX')).toThrow('Unknown Luna version: Luna IX');
        });
    });

    describe('getDisplayVersion', () => {
        it('should return versions unchanged for display', () => {
            expect(getDisplayVersion('Luna I')).toBe('Luna I');
            expect(getDisplayVersion('Luna I.1')).toBe('Luna I.1');
            expect(getDisplayVersion('5.8')).toBe('5.8');
        });
    });

    describe('versionToNumber with Luna versions', () => {
        it('should sort Luna versions correctly with regular versions', () => {
            const versions = ['5.8', 'Luna I', 'Luna II', '6.0', 'Luna I.1'];
            const numbers = versions.map(versionToNumber);
            
            // 5.8 = 50800, Luna I = 50900, Luna I.1 = 50901, Luna II = 51000, 6.0 = 60000
            expect(versionToNumber('5.8')).toBe(50800);
            expect(versionToNumber('Luna I')).toBe(50900);
            expect(versionToNumber('Luna I.1')).toBe(50901);
            expect(versionToNumber('Luna II')).toBe(51000);
            expect(versionToNumber('6.0')).toBe(60000);
        });
    });

    describe('getBaseVersion with Luna versions', () => {
        it('should return correct base versions for Luna versions', () => {
            expect(getBaseVersion('Luna I.1')).toBe('5.9');
            expect(getBaseVersion('Luna I.2')).toBe('5.9');
            expect(getBaseVersion('Luna II.1')).toBe('5.10');
            expect(getBaseVersion('5.8.1')).toBe('5.8');
        });
    });

    describe('getVersionPart with Luna versions', () => {
        it('should return correct version parts for Luna versions', () => {
            expect(getVersionPart('Luna I.1')).toBe(1);
            expect(getVersionPart('Luna I.2')).toBe(2);
            expect(getVersionPart('Luna II.1')).toBe(1);
            expect(getVersionPart('5.8.1')).toBe(1);
        });
    });

    describe('getVersionParts integration', () => {
        it('should properly handle mixed Luna and regular versions', () => {
            const versions = ['5.8.1', 'Luna I.1', 'Luna I.2', 'Luna II.1', '6.0.1'];
            const versionParts = getVersionParts(versions, 'asc');
            
            // Should be ordered by numeric value but display Luna versions
            expect(versionParts).toEqual([
                { version: '5.8', parts: 1 },
                { version: 'Luna I', parts: 2 },
                { version: 'Luna II', parts: 1 },
                { version: '6.0', parts: 1 }
            ]);
        });

        it('should handle descending order correctly', () => {
            const versions = ['5.8.1', 'Luna I.1', 'Luna I.2', 'Luna II.1', '6.0.1'];
            const versionParts = getVersionParts(versions, 'desc');
            
            expect(versionParts).toEqual([
                { version: '6.0', parts: 1 },
                { version: 'Luna II', parts: 1 },
                { version: 'Luna I', parts: 2 },
                { version: '5.8', parts: 1 }
            ]);
        });
    });

    describe('Luna version filtering', () => {
        const sampleData = [
            { name: 'Character A', versions: ['5.8.1', 'Luna I.1'] },
            { name: 'Character B', versions: ['Luna I.2', 'Luna II.1'] },
            { name: 'Character C', versions: ['6.0.1'] },
            { name: 'Character D', versions: ['Luna III.1'] },
        ];

        it('should filter by Luna versions correctly', () => {
            const filterFn = getFilterFunction('Luna I');
            const filtered = sampleData.filter(filterFn);
            
            expect(filtered).toEqual([
                { name: 'Character A', versions: ['5.8.1', 'Luna I.1'] },
                { name: 'Character B', versions: ['Luna I.2', 'Luna II.1'] },
            ]);
        });

        it('should filter by specific Luna versions', () => {
            const filterFn = getFilterFunction('Luna II');
            const filtered = sampleData.filter(filterFn);
            
            expect(filtered).toEqual([
                { name: 'Character B', versions: ['Luna I.2', 'Luna II.1'] },
            ]);
        });

        it('should filter by multiple Luna versions', () => {
            const filterFn = getFilterFunction('Luna II, Luna III');
            const filtered = sampleData.filter(filterFn);
            
            expect(filtered).toEqual([
                { name: 'Character B', versions: ['Luna I.2', 'Luna II.1'] },
                { name: 'Character D', versions: ['Luna III.1'] },
            ]);
        });

        it('should handle case insensitive Luna filtering', () => {
            const filterFn = getFilterFunction('luna i');
            const filtered = sampleData.filter(filterFn);
            
            expect(filtered).toEqual([
                { name: 'Character A', versions: ['5.8.1', 'Luna I.1'] },
                { name: 'Character B', versions: ['Luna I.2', 'Luna II.1'] },
            ]);
        });

        it('should still handle regular numeric version filtering', () => {
            const filterFn = getFilterFunction('5.8');
            const filtered = sampleData.filter(filterFn);
            
            expect(filtered).toEqual([
                { name: 'Character A', versions: ['5.8.1', 'Luna I.1'] },
            ]);
        });
    });
});