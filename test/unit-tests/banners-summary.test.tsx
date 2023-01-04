import {VersionParts} from "@/banners/types";
import {
    BannerSummary,
    getAvgBannerGapInterval,
    getAvgDayInterval,
    getAvgPatchGapInterval,
    getBannerGap,
    getBannerPatchGap,
    getResourceSummaries
} from "@/banners/summary";
import dayjs from "dayjs";

const VersionPartsDummyData: VersionParts[] = [
    {version: '1.0', parts: 2},
    {version: '1.1', parts: 2},
    {version: '1.2', parts: 2},
    {version: '1.3', parts: 3},
    {version: '1.4', parts: 2},
    {version: '1.5', parts: 2},
    {version: '1.6', parts: 2},
    {version: '2.0', parts: 2},
    {version: '2.1', parts: 2},
    {version: '2.2', parts: 2},
    {version: '2.3', parts: 2},
    {version: '2.4', parts: 2},
    {version: '2.5', parts: 2},
    {version: '2.6', parts: 2},
    {version: '2.7', parts: 2},
    {version: '2.8', parts: 2},
    {version: '3.0', parts: 2},
    {version: '3.1', parts: 2},
    {version: '3.2', parts: 2},
]

const BannerSummariesDummyData: { [name: string]: BannerSummary } = {
    "Venti": {
        "versions": ["1.0.1", "1.4.1", "2.6.1", "3.1.1"],
        "dates": [
            {"start": "2020-09-28", "end": "2020-10-18"},
            {"start": "2021-03-17", "end": "2021-04-06"},
            {"start": "2022-03-30", "end": "2022-04-19"},
            {"start": "2022-09-28", "end": "2022-10-14"}
        ]
    },
    "Hu Tao": {
        "versions": ["1.3.3", "2.2.2"],
        "dates": [
            {"start": "2021-03-02", "end": "2021-03-16"},
            {"start": "2021-11-02", "end": "2021-11-23"},
        ]
    },
    "Yoimiya": {
        "versions": ["2.0.2", "2.8.2", "3.2.1"],
        "dates": [
            {"start": "2021-08-10", "end": "2021-08-31"},
            {"start": "2022-08-02", "end": "2022-08-23"},
            {"start": "2022-11-02", "end": "2022-11-18"}
        ]
    },
    "Fake": {
        "versions": ["2.0.2"],
        "dates": [
            {"start": "2021-08-10", "end": "2021-08-31"},
        ]
    },
}

describe('getBannerPatchGap', () => {
    it('should get the correct patch difference', async () => {
        expect(getBannerPatchGap(VersionPartsDummyData, "1.0.1", "2.0.1"))
            .toEqual(7)

        expect(getBannerPatchGap(VersionPartsDummyData, "1.0.2", "2.0.1"))
            .toEqual(7)

        expect(getBannerPatchGap(VersionPartsDummyData, "1.5.1", "3.2.1"))
            .toEqual(13)
    });
})

describe('getBannerGap', () => {
    it('should get the correct banner differences', async () => {
        expect(getBannerGap(VersionPartsDummyData, "1.0.1", "2.0.1"))
            .toEqual(14)

        expect(getBannerGap(VersionPartsDummyData, "1.0.2", "2.0.1"))
            .toEqual(13)

        expect(getBannerGap(VersionPartsDummyData, "1.5.1", "3.2.1"))
            .toEqual(25)
    });
})
describe('getAvgPatchGapInterval', () => {
    it('should get the avg patch gap for a character', async () => {
        expect(getAvgPatchGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Hu Tao"]))
            .toEqual(6)

        expect(getAvgPatchGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Venti"]))
            .toEqual(5.667)

        expect(getAvgPatchGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Yoimiya"]))
            .toEqual(5.5)
    });

    it('should return -1 when character has only ran once', async () => {
        expect(getAvgPatchGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Fake"]))
            .toEqual(-1)
    });
})

describe('getAvgBannerGapInterval', () => {
    it('should get the avg banner gap for a character', async () => {
        expect(getAvgBannerGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Hu Tao"]))
            .toEqual(11)

        expect(getAvgBannerGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Venti"]))
            .toEqual(10.667)

        expect(getAvgBannerGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Yoimiya"]))
            .toEqual(9.5)
    });

    it('should return -1 when character has only ran once', async () => {
        expect(getAvgBannerGapInterval(VersionPartsDummyData, BannerSummariesDummyData["Fake"]))
            .toEqual(-1)
    });
})

describe('getAvgDayInterval', () => {
    it('should get the avg day interval for a character', async () => {
        expect(getAvgDayInterval(BannerSummariesDummyData["Hu Tao"]))
            .toEqual(231)

        expect(getAvgDayInterval(BannerSummariesDummyData["Venti"]))
            .toEqual(223.333)

        expect(getAvgDayInterval(BannerSummariesDummyData["Yoimiya"]))
            .toEqual(203.5)
    });

    it('should return -1 when character has only ran once', async () => {
        expect(getAvgDayInterval(BannerSummariesDummyData["Fake"]))
            .toEqual(-1)
    });
})


describe('getResourceSummaries', () => {
    it('should get resource summary correctly', async () => {
        expect(getResourceSummaries(VersionPartsDummyData, BannerSummariesDummyData, dayjs("2023-01-03")))
            .toEqual({
                "Fake": {
                    "name": "Fake",
                    "image": "Fake",
                    "avgBannerGapInterval": -1,
                    "avgDaysInterval": -1,
                    "avgPatchGapInterval": -1,
                    "daysSinceLastRun": 490,
                    "runs": 1
                },
                "Hu Tao": {
                    "name": "Hu Tao",
                    "image": "Hu-Tao",
                    "avgBannerGapInterval": 11,
                    "avgDaysInterval": 231,
                    "avgPatchGapInterval": 6,
                    "daysSinceLastRun": 406,
                    "runs": 2
                },
                "Venti": {
                    "name": "Venti",
                    "image": "Venti",
                    "avgBannerGapInterval": 10.667,
                    "avgDaysInterval": 223.333,
                    "avgPatchGapInterval": 5.667,
                    "daysSinceLastRun": 81,
                    "runs": 4
                },
                "Yoimiya": {
                    "name": "Yoimiya",
                    "image": "Yoimiya",
                    "avgBannerGapInterval": 9.5,
                    "avgDaysInterval": 203.5,
                    "avgPatchGapInterval": 5.5,
                    "daysSinceLastRun": 46,
                    "runs": 3
                }
            })
    });
})