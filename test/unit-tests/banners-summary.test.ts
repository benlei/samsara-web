import {Featured, VersionParts} from "@/banners/types";
import {
    getAverageBannersInBetween,
    getAverageDaysInBetween,
    getAveragePatchesInBetween,
    getBannerGap,
    getBannersSinceLastCountSummary,
    getCurrentVersionPart,
    getDaysSinceRunCountSummary,
    getLongestStatsInBetween,
    getPatchesSinceLastCountSummary,
    getPatchGap,
    getRunsCountSummary,
    getShortestStatsInBetween
} from "@/banners/summary";
import dayjs from "dayjs";
import _ from "lodash";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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

const BannerSummariesDummyData: Featured[] = [
    {
        "name": "Venti",
        "versions": ["1.0.1", "1.4.1", "2.6.1", "3.1.1"],
        "dates": [
            {"start": "2020-09-28", "end": "2020-10-18"},
            {"start": "2021-03-17", "end": "2021-04-06"},
            {"start": "2022-03-30", "end": "2022-04-19"},
            {"start": "2022-09-28", "end": "2022-10-14"}
        ]
    },
    {
        "name": "Hu Tao",
        "versions": ["1.3.3", "2.2.2"],
        "dates": [
            {"start": "2021-03-02", "end": "2021-03-16"},
            {"start": "2021-11-02", "end": "2021-11-23"},
        ]
    },
    {
        "name": "Yoimiya",
        "versions": ["2.0.2", "2.8.2", "3.2.1"],
        "dates": [
            {"start": "2021-08-10", "end": "2021-08-31"},
            {"start": "2022-08-02", "end": "2022-08-23"},
            {"start": "2022-11-02", "end": "2022-11-18"}
        ]
    },
    {
        "name": "Fake",
        "versions": ["2.0.2"],
        "dates": [
            {"start": "2021-08-10", "end": ""},
        ]
    },
]

const BannerSummariesWithOverallDummyData: Featured[] = [
    {
        "name": "Venti",
        "versions": ["1.0.1", "1.4.1", "2.6.1", "3.1.1"],
        "dates": [
            {"start": "2020-09-28", "end": "2020-10-18"},
            {"start": "2021-03-17", "end": "2021-04-06"},
            {"start": "2022-03-30", "end": "2022-04-19"},
            {"start": "2022-09-28", "end": "2022-10-14"}
        ]
    },
    {
        "name": "Hu Tao",
        "versions": ["1.3.3", "2.2.2"],
        "dates": [
            {"start": "2021-03-02", "end": "2021-03-16"},
            {"start": "2021-11-02", "end": "2021-11-23"},
        ]
    },
    {
        "name": "Yoimiya",
        "versions": ["2.0.2", "2.8.2", "3.1.2"],
        "dates": [
            {"start": "2021-08-10", "end": "2021-08-31"},
            {"start": "2022-08-02", "end": "2022-08-23"},
            {"start": "2022-11-02", "end": "2022-11-18"}
        ]
    },
]

const VersionPartsDummyDataWithFuture: VersionParts[] = [
    ...VersionPartsDummyData,
    {version: '3.9', parts: 2},
    {version: '4.0', parts: 2},
]

const BannerSummariesDummyDataWithFuture: Featured[] = [
    ...BannerSummariesDummyData,
    {
        "name": "Fake2",
        "versions": ['3.9.1', '4.0.1'],
        "dates": [
            {"start": "2022-06-01", "end": "2022-06-24"},
            {"start": "2023-06-01", "end": ""}
        ]
    },
    {
        "name": "Fake3",
        "versions": ['3.9.1', '4.0.2'],
        "dates": [
            {"start": "2022-06-01", "end": "2022-06-24"},
            {"start": "", "end": ""}
        ]
    },
    {
        "name": "Fake4",
        "versions": ['3.9.1', '4.0.2'],
        "dates": [
            {"start": "2022-12-01", "end": "2022-12-24"},
            {"start": "2023-01-01", "end": "2023-01-24"}
        ]
    }
]


describe('getPatchGap', () => {
    it('should get the correct patch difference', async () => {
        expect(getPatchGap(VersionPartsDummyData, "1.0.1", "2.0.1"))
            .toEqual(7)

        expect(getPatchGap(VersionPartsDummyData, "1.0.2", "2.0.1"))
            .toEqual(7)

        expect(getPatchGap(VersionPartsDummyData, "1.5.1", "3.2.1"))
            .toEqual(13)
    });
})

describe('getBannerGap', () => {
    it('should get the correct banner differences', async () => {
        expect(getBannerGap(VersionPartsDummyData, "1.0.1", "1.1.1"))
            .toEqual(1)

        expect(getBannerGap(VersionPartsDummyData, "1.0.1", "1.1.2"))
            .toEqual(2)

        expect(getBannerGap(VersionPartsDummyData, "1.0.1", "2.0.1"))
            .toEqual(14)

        expect(getBannerGap(VersionPartsDummyData, "1.0.2", "2.0.1"))
            .toEqual(13)

        expect(getBannerGap(VersionPartsDummyData, "1.5.1", "3.2.1"))
            .toEqual(25)
    });

    it('should return 0 if current banner is 3.2.1', async () => {
        expect(getBannerGap(VersionPartsDummyData, "3.2.1", "3.2.2"))
            .toEqual(0)
    });

    it('should return -1 if current banner is 3.2.2 to 3.2.2', async () => {
        expect(getBannerGap(VersionPartsDummyData, "3.2.2", "3.2.2"))
            .toEqual(-1)
    });
})

describe('getDaysSinceRunCountSummary', () => {
    it('should return the number of days since last run', () => {
        expect(_.orderBy(
            getDaysSinceRunCountSummary(VersionPartsDummyData, BannerSummariesDummyDataWithFuture, "2023-01-03"),
            (b) => b.name,
            'asc'
        ))
            .toEqual(_.orderBy([
                    {
                        "name": "Fake",
                        "image": "Fake",
                        "count": 490,
                    },
                    {
                        "name": "Fake2",
                        "image": "Fake2",
                        "count": 193,
                    },
                    {
                        "name": "Fake3",
                        "image": "Fake3",
                        "count": 193,
                    },
                    {
                        "name": "Fake4",
                        "image": "Fake4",
                        "count": 0,
                    },
                    {
                        "name": "Hu Tao",
                        "image": "Hu-Tao",
                        "count": 406,
                    },
                    {
                        "name": "Venti",
                        "image": "Venti",
                        "count": 81,
                    },
                    {
                        "name": "Yoimiya",
                        "image": "Yoimiya",
                        "count": 46,
                    },
                ],
                (b) => b.name,
                'asc',
            ))
    })
})

describe('getBannersSinceLastCountSummary', () => {
    it('should return the number of banners since last run', () => {
        expect(_.orderBy(
            getBannersSinceLastCountSummary(VersionPartsDummyData, BannerSummariesDummyData, "2024-01-01"),
            (b) => b.name,
            'asc'
        ))
            .toEqual(_.orderBy([
                    {
                        "name": "Fake",
                        "image": "Fake",
                        "count": 21,
                    },
                    {
                        "name": "Hu Tao",
                        "image": "Hu-Tao",
                        "count": 17,
                    },
                    {
                        "name": "Venti",
                        "image": "Venti",
                        "count": 2,
                    },
                    {
                        "name": "Yoimiya",
                        "image": "Yoimiya",
                        "count": 0,
                    },
                ],
                (b) => b.name,
                'asc',
            ))
    })
})

describe('getPatchesSinceLastCountSummary', () => {
    it('should return the number of patches since last run', () => {
        expect(_.orderBy(
            getPatchesSinceLastCountSummary(VersionPartsDummyData, BannerSummariesDummyData, "2024-01-01"),
            (b) => b.name,
            'asc'
        ))
            .toEqual(_.orderBy([
                    {
                        "name": "Fake",
                        "image": "Fake",
                        "count": 11,
                    },
                    {
                        "name": "Hu Tao",
                        "image": "Hu-Tao",
                        "count": 9,
                    },
                    {
                        "name": "Venti",
                        "image": "Venti",
                        "count": 1,
                    },
                    {
                        "name": "Yoimiya",
                        "image": "Yoimiya",
                        "count": 0,
                    },
                ],
                (b) => b.name,
                'asc',
            ))
    })
})

describe('getRunsCountSummary', () => {
    it('should return the runs for each character', () => {
        expect(_.orderBy(
            getRunsCountSummary(VersionPartsDummyData, BannerSummariesDummyData),
            (b) => b.name,
            'asc'
        ))
            .toEqual(_.orderBy([
                    {
                        "name": "Fake",
                        "image": "Fake",
                        "count": 1,
                    },
                    {
                        "name": "Hu Tao",
                        "image": "Hu-Tao",
                        "count": 2,
                    },
                    {
                        "name": "Venti",
                        "image": "Venti",
                        "count": 4,
                    },
                    {
                        "name": "Yoimiya",
                        "image": "Yoimiya",
                        "count": 3,
                    },
                ],
                (b) => b.name,
                'asc',
            ))
    })
})


describe('getAverageDaysInBetween', () => {
    it('should return the avg days stats for each character', () => {
        expect(_.orderBy(
            getAverageDaysInBetween(VersionPartsDummyData, BannerSummariesDummyData),
            (b) => b.name,
            'asc'
        ))
            .toEqual(_.orderBy([
                    {
                        "name": "Fake",
                        "image": "Fake",
                        "average": 0,
                        "standardDeviation": 0,
                        "discrepancy": false,
                        "count": 1
                    },
                    {
                        "name": "Hu Tao",
                        "image": "Hu-Tao",
                        "average": 231,
                        "standardDeviation": 0,
                        "discrepancy": false,
                        "count": 2
                    },
                    {
                        "name": "Venti",
                        "image": "Venti",
                        "average": 223.3,
                        "standardDeviation": 95.3,
                        "discrepancy": false,
                        "count": 4
                    },
                    {
                        "name": "Yoimiya",
                        "image": "Yoimiya",
                        "average": 203.5,
                        "standardDeviation": 132.5,
                        "discrepancy": false,
                        "count": 3
                    },
                ],
                (b) => b.name,
                'asc',
            ))
    })
})


describe('getAverageBannersInBetween', () => {
    it('should return the avg banners stats for each character', () => {
        expect(_.orderBy(
            getAverageBannersInBetween(VersionPartsDummyData, BannerSummariesDummyData),
            (b) => b.name,
            'asc'
        ))
            .toEqual(_.orderBy([
                    {
                        "name": "Fake",
                        "image": "Fake",
                        "average": 0,
                        "standardDeviation": 0,
                        "discrepancy": false,
                        "count": 1
                    },
                    {
                        "name": "Hu Tao",
                        "image": "Hu-Tao",
                        "average": 11,
                        "standardDeviation": 0,
                        "discrepancy": false,
                        "count": 2
                    },
                    {
                        "name": "Venti",
                        "image": "Venti",
                        "average": 10.7,
                        "standardDeviation": 4.5,
                        "discrepancy": false,
                        "count": 4
                    },
                    {
                        "name": "Yoimiya",
                        "image": "Yoimiya",
                        "average": 9.5,
                        "standardDeviation": 5.5,
                        "discrepancy": false,
                        "count": 3
                    },
                ],
                (b) => b.name,
                'asc',
            ))
    })
})


describe('getAveragePatchesInBetween', () => {
    it('should return the avg patches stats for each character', () => {
        expect(_.orderBy(
            getAveragePatchesInBetween(VersionPartsDummyData, BannerSummariesDummyData),
            (b) => b.name,
            'asc'
        ))
            .toEqual(_.orderBy([
                    {
                        "name": "Fake",
                        "image": "Fake",
                        "average": 0,
                        "standardDeviation": 0,
                        "discrepancy": false,
                        "count": 1
                    },
                    {
                        "name": "Hu Tao",
                        "image": "Hu-Tao",
                        "average": 6,
                        "standardDeviation": 0,
                        "discrepancy": false,
                        "count": 2
                    },
                    {
                        "name": "Venti",
                        "image": "Venti",
                        "average": 5.7,
                        "standardDeviation": 2.4,
                        "discrepancy": false,
                        "count": 4
                    },
                    {
                        "name": "Yoimiya",
                        "image": "Yoimiya",
                        "average": 5.5,
                        "standardDeviation": 2.5,
                        "discrepancy": false,
                        "count": 3
                    },
                ],
                (b) => b.name,
                'asc',
            ))
    })
})

describe('getLongestStatsInBetween()', () => {
    it('should provide longest stats in between', () => {
        expect(_.orderBy(
            getLongestStatsInBetween(VersionPartsDummyDataWithFuture, BannerSummariesDummyDataWithFuture, "2023-01-03"),
            (b) => b.name,
            'asc'
        ))
            .toEqual([
                {
                    "name": "Fake",
                    "image": "Fake",
                    "days": 490,
                    "banners": 26,
                    "patches": 14
                },
                {
                    "name": "Fake2",
                    "image": "Fake2",
                    "days": 342,
                    "banners": 1,
                    "patches": 1
                },
                {
                    "name": "Fake3",
                    "image": "Fake3",
                    "days": 193,
                    "banners": 2,
                    "patches": 1
                },
                {
                    "name": "Fake4",
                    "image": "Fake4",
                    "days": 8,
                    "banners": 2,
                    "patches": 1
                },
                {
                    "name": "Hu Tao",
                    "image": "Hu-Tao",
                    "days": 406,
                    "banners": 22,
                    "patches": 12
                },
                {
                    "name": "Venti",
                    "image": "Venti",
                    "days": 358,
                    "banners": 17,
                    "patches": 9
                },
                {
                    "name": "Yoimiya",
                    "image": "Yoimiya",
                    "days": 336,
                    "banners": 15,
                    "patches": 8
                },
            ])
    })
})


describe('getShortestStatsInBetween()', () => {
    it('should provide shortest stats in between', () => {
        expect(_.orderBy(
            getShortestStatsInBetween(VersionPartsDummyDataWithFuture, BannerSummariesDummyDataWithFuture, "2023-01-03"),
            (b) => b.name,
            'asc'
        ))
            .toEqual([
                {name: 'Fake2', image: 'Fake2', days: 342, banners: 1, patches: 1},
                {name: 'Fake3', image: 'Fake3', days: 193, banners: 2, patches: 1},
                {name: 'Fake4', image: 'Fake4', days: 8, banners: 2, patches: 1},
                {
                    name: 'Hu Tao',
                    image: 'Hu-Tao',
                    days: 231,
                    banners: 11,
                    patches: 6
                },
                {name: 'Venti', image: 'Venti', days: 150, banners: 7, patches: 4},
                {
                    name: 'Yoimiya',
                    image: 'Yoimiya',
                    days: 71,
                    banners: 4,
                    patches: 3
                }
            ])
    })
})

describe('getCurrentVersionPart', () => {
    it('should determine latest patch on day of patch', () => {
        expect(getCurrentVersionPart(VersionPartsDummyData, BannerSummariesDummyData, dayjs.utc("2022-11-02")))
            .toEqual({version: "3.2", parts: 1})
    })

    it('should determine latest patch between old banner and new of same patch', () => {
        expect(getCurrentVersionPart(VersionPartsDummyData, BannerSummariesWithOverallDummyData, dayjs.utc("2022-11-01")))
            .toEqual({version: "3.1", parts: 1})

        expect(getCurrentVersionPart(VersionPartsDummyData, BannerSummariesWithOverallDummyData, dayjs.utc("2022-11-02")))
            .toEqual({version: "3.1", parts: 2})

        expect(getCurrentVersionPart(VersionPartsDummyData, BannerSummariesWithOverallDummyData, dayjs.utc("2022-11-05")))
            .toEqual({version: "3.1", parts: 2})
    })

    it('should determine latest patch a few days after patch', () => {
        expect(getCurrentVersionPart(VersionPartsDummyData, BannerSummariesDummyData, dayjs.utc("2022-11-05")))
            .toEqual({version: "3.2", parts: 1})
    })

    it('should determine latest patch when there are future patches', () => {
        expect(getCurrentVersionPart(VersionPartsDummyData, BannerSummariesDummyData, dayjs.utc("2021-11-02")))
            .toEqual({version: "2.2", parts: 2})
    })
})
