import {addOneOffCharacters, getCharacters} from "@/characters/characters";
import _ from "lodash";

describe('getCharacters()', () => {
    it('should have same number of inputs as outputs', async () => {
        const data: string[] = [
            ...Object.keys(require('@/data/banners.json').characters['5']),
            ...Object.keys(require('@/data/banners.json').characters['4']),
        ]
        const characters = getCharacters(data)

        expect(data.length).toEqual(Object.keys(characters).length)
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

describe('addOneOffCharacters()', () => {
    it('should add in one offs', async () => {
        const data: string[] = addOneOffCharacters([
            ...Object.keys(require('@/data/banners.json').characters['5']),
            ...Object.keys(require('@/data/banners.json').characters['4']),
        ])
        expect(data).toContain('Traveler')
        expect(data).toContain('Aloy')
    });

    it('should not cause dups', async () => {
        const data: string[] = addOneOffCharacters(addOneOffCharacters([
            ...Object.keys(require('@/data/banners.json').characters['5']),
            ...Object.keys(require('@/data/banners.json').characters['4']),
        ]))
        expect(_.filter(data, (d) => d == 'Traveler').length).toEqual(1)
    });
})