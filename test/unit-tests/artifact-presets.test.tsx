import {RotationStorage} from "@/artifacts/types";
import {calculateDateForRotation, dateStringAsDate, getRotationIndexAndDay} from "@/artifacts/presets";

const FIXED_STORAGE: RotationStorage = {
    active: 0,
    cacheId: '',
    presets: [
        {
            name: "blah",
            fixed: true,
            fixedDays: 3,
            date: "2023/01/01",
            rotations: [
                {domain: "", characters: [], note: ""},
                {domain: "", characters: [], note: "", days: 1},
                {domain: "", characters: [], note: ""},
            ],
        }
    ]
}

const UNFIXED_STORAGE: RotationStorage = {
    active: 0,
    cacheId: '',
    presets: [
        {
            name: "blah",
            fixed: false,
            fixedDays: 3,
            date: "2023/01/01",
            rotations: [
                {domain: "", characters: [], note: "", days: 3},
                {domain: "", characters: [], note: "", days: 7},
                {domain: "", characters: [], note: "", days: 14},
            ],
        }
    ]
}

describe('getRotationIndexAndDay()', () => {
    it('should correctly calculate current rotation + day for fixed rotations of same day', async () => {
        const endDate = dateStringAsDate("2023/01/01")

        // 32 % 9 = 5, or index 1 day 2
        expect(getRotationIndexAndDay(FIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 0,
            day: 1,
        })
    });

    it('should correctly calculate current rotation + day for fixed rotations 2nd rotation', async () => {
        const endDate = dateStringAsDate("2023/01/05")

        // 32 % 9 = 5, or index 1 day 2
        expect(getRotationIndexAndDay(FIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 1,
            day: 2,
        })
    });

    it('should correctly calculate current rotation + day for fixed rotations 3rd rotation', async () => {
        const endDate = dateStringAsDate("2023/01/09")

        expect(getRotationIndexAndDay(FIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 2,
            day: 3,
        })
    });

    it('should correctly calculate current rotation + day for fixed rotations', async () => {
        const endDate = dateStringAsDate("2023/02/01")

        expect(getRotationIndexAndDay(FIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 1,
            day: 2,
        })
    });

    it('should correctly calculate current rotation + day for unfixed rotations of same day', async () => {
        const endDate = dateStringAsDate("2023/01/01")

        expect(getRotationIndexAndDay(UNFIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 0,
            day: 1,
        })
    });

    it('should correctly calculate current rotation + day for unfixed rotations 2nd rotation', async () => {
        const endDate = dateStringAsDate("2023/01/05")

        expect(getRotationIndexAndDay(UNFIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 1,
            day: 2,
        })
    });

    it('should correctly calculate current rotation + day for unfixed rotations 3rd rotation', async () => {
        const endDate = dateStringAsDate("2023/01/14")

        expect(getRotationIndexAndDay(UNFIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 2,
            day: 4,
        })
    });

    it('should correctly calculate current rotation + day for unfixed rotations', async () => {
        const endDate = dateStringAsDate("2023/02/01")

        expect(getRotationIndexAndDay(UNFIXED_STORAGE.presets[0], endDate)).toEqual({
            index: 1,
            day: 5,
        })
    });
})


describe('calculateDateForRotation()', () => {
    it('should correctly calculate date for fixed rotations of same day', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(FIXED_STORAGE.presets[0], 0, 1, currDate)))
            .toEqual(new Date("2023/02/01"))
    });

    it('should correctly calculate date for fixed rotations of day 3', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(FIXED_STORAGE.presets[0], 0, 3, currDate)))
            .toEqual(new Date("2023/01/30"))
    });

    it('should correctly calculate date for fixed rotations of day 1 of 2nd rotation', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(FIXED_STORAGE.presets[0], 1, 1, currDate)))
            .toEqual(new Date("2023/01/29"))
    });

    it('should correctly calculate date for fixed rotations of day 3 of 3rd rotation', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(FIXED_STORAGE.presets[0], 2, 3, currDate)))
            .toEqual(new Date("2023/01/24"))
    });


    it('should correctly calculate date for unfixed rotations of same day', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(UNFIXED_STORAGE.presets[0], 0, 1, currDate)))
            .toEqual(new Date("2023/02/01"))
    });

    it('should correctly calculate date for unfixed rotations of day 3', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(UNFIXED_STORAGE.presets[0], 0, 3, currDate)))
            .toEqual(new Date("2023/01/30"))
    });

    it('should correctly calculate date for unfixed rotations of day 4 of 2nd rotation', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(UNFIXED_STORAGE.presets[0], 1, 4, currDate)))
            .toEqual(new Date("2023/01/26"))
    });

    it('should correctly calculate date for unfixed rotations of day 11 of 3rd rotation', async () => {
        const currDate = new Date("2023/02/01")

        expect(new Date(calculateDateForRotation(UNFIXED_STORAGE.presets[0], 2, 11, currDate)))
            .toEqual(new Date("2023/01/12"))
    });
})