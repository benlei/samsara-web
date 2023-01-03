import {getCharacters} from "@/characters/characters";

describe('getCharacters()', () => {
    it('should have same number of elements as input', async () => {
        const data: string[] = require('@/data/characters.json')
        const characters = getCharacters(data)

        expect(data.length).toEqual(Object.keys(characters).length)
    });

    it('should have Yae Miko', async () => {
        const data: string[] = require('@/data/characters.json')
        const characters = getCharacters(data)

        expect(characters['Yae Miko']).toEqual({
            name: 'Yae Miko',
            image: 'Yae-Miko',
        })
    });
})
