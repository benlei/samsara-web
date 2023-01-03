import ClonedList from "@/artifacts/list";

describe('ClonedList', () => {
    it('should insert() to appropriate location', async () => {
        expect(ClonedList.insert(['a', 'b', 'c'], 0, 'z')).toEqual(['z', 'a', 'b', 'c'])
        expect(ClonedList.insert(['a', 'b', 'c'], 1, 'z')).toEqual(['a', 'z', 'b', 'c'])
        expect(ClonedList.insert(['a', 'b', 'c'], 2, 'z')).toEqual(['a', 'b', 'z', 'c'])
        expect(ClonedList.insert(['a', 'b', 'c'], 3, 'z')).toEqual(['a', 'b', 'c', 'z'])
    });

    it('should set() an index to update its value', async () => {
        expect(ClonedList.set(['a', 'b', 'c'], 0, 'z')).toEqual(['z', 'b', 'c'])
        expect(ClonedList.set(['a', 'b', 'c'], 1, 'z')).toEqual(['a', 'z', 'c'])
        expect(ClonedList.set(['a', 'b', 'c'], 2, 'z')).toEqual(['a', 'b', 'z'])
    });

    it('should move() elements to new positions', async () => {
        expect(ClonedList.move(['a', 'b', 'c'], 0, 0)).toEqual(['a', 'b', 'c'])
        expect(ClonedList.move(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c'])
        expect(ClonedList.move(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
        expect(ClonedList.move(['a', 'b', 'c'], 1, 0)).toEqual(['b', 'a', 'c'])
        expect(ClonedList.move(['a', 'b', 'c'], 1, 1)).toEqual(['a', 'b', 'c'])
        expect(ClonedList.move(['a', 'b', 'c'], 1, 2)).toEqual(['a', 'c', 'b'])
        expect(ClonedList.move(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
        expect(ClonedList.move(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'c', 'b'])
        expect(ClonedList.move(['a', 'b', 'c'], 2, 2)).toEqual(['a', 'b', 'c'])
    });

    it('should remove() elements at specific indices', async () => {
        expect(ClonedList.remove(['a', 'b', 'c'], 0)).toEqual(['b', 'c'])
        expect(ClonedList.remove(['a', 'b', 'c'], 1)).toEqual(['a', 'c'])
        expect(ClonedList.remove(['a', 'b', 'c'], 2)).toEqual(['a', 'b'])
    });
})
