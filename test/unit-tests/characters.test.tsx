import {getCharacters} from "@/characters/characters";

describe('getCharacters()', () => {
    it('should include one-offs', async () => {
        const data: string[] = [
            ...Object.keys(require('@/data/banners.json').characters['5']),
            ...Object.keys(require('@/data/banners.json').characters['4']),
        ]
        const characters = getCharacters(data)

        expect(data.length).toEqual(Object.keys(characters).length - 2)
        expect(Object.keys(characters)).toContain('Traveler')
        expect(Object.keys(characters)).toContain('Aloy')
    });

    it('should have Yae Miko', async () => {
        const data: string[] = [
            ...Object.keys(require('@/data/banners.json').characters['5']),
            ...Object.keys(require('@/data/banners.json').characters['4']),
        ]
        const characters = getCharacters(data)

        expect(characters['Yae Miko']).toEqual({
            name: 'Yae Miko',
            image: 'Yae-Miko',
        })
    });
})
