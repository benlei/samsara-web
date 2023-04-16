import React, {useEffect, useState} from "react";
import _ from "lodash";
import {
    getAverageBannersInBetween,
    getAverageDaysInBetween,
    getAveragePatchesInBetween,
    getBannersSinceLastCountSummary,
    getDaysSinceRunCountSummary,
    getLongestStatsInBetween,
    getPatchesSinceLastCountSummary,
    getRunsCountSummary,
    getShortestStatsInBetween
} from "@/banners/summary";
import RelativeBasicCounterSummary from "@/components/summary/stat/RelativeBasicCounterSummary";
import RunsCounterSummary from "./stat/RunsCounterSummary";
import AverageCounterSummary from "@/components/summary/stat/AverageCounterSummary";
import dayjs from "dayjs";
import {CommonSummaryProperties} from "@/banners/types";
import LeaderboardCounterSummary from "@/components/summary/stat/LeaderboardCounterSummary";

type Properties = {
    filterText: string
    limitedOnly: boolean
    sortBy: string
    standard?: string[]
    date: string
} & CommonSummaryProperties

export default function SummaryTable(
    {
        versionParts,
        featuredList,
        type,
        sortBy,
        order,
        limitedOnly,
        standard = [],
        filterText,
        date,
    }: Properties
): JSX.Element {
    const [now, setNow] = useState(date)
    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    const baseFeaturedList = _.chain(featuredList)
        .filter((featured) => !limitedOnly || !standard!.includes(featured.name))
        .value()

    const commonProps: CommonSummaryProperties = {
        versionParts,
        type,
        order,
        filterText,
        featuredList: baseFeaturedList,
    }

    return (
        <>
            {sortBy === 'last-day' && <RelativeBasicCounterSummary {...commonProps} date={now}
                                                                   singular={'day'} plural={'days'}
                                                                   counter={getDaysSinceRunCountSummary}
            />}
            {sortBy === 'last-banner' &&
                <RelativeBasicCounterSummary {...commonProps} date={now}
                                             singular={'banner'} plural={'banners'}
                                             counter={getBannersSinceLastCountSummary}
                />}
            {sortBy === 'last-patch' &&
                <RelativeBasicCounterSummary {...commonProps} date={now}
                                             singular={'patch'} plural={'patches'}
                                             counter={getPatchesSinceLastCountSummary}
                />}

            {sortBy.startsWith('longest') &&
                <LeaderboardCounterSummary {...commonProps}
                                           sortBy={sortBy}
                                           counter={(vp, banners) => getLongestStatsInBetween(vp, banners, now)}
                />
            }

            {sortBy.startsWith('shortest') &&
                <LeaderboardCounterSummary {...commonProps}
                                           sortBy={sortBy}
                                           counter={(vp, banners) => getShortestStatsInBetween(vp, banners, now)}
                />
            }

            {sortBy === 'avg-day' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'Day'}
                                       plural={'Days'}
                                       counter={getAverageDaysInBetween}
                />}
            {sortBy === 'avg-banner' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'Banner'}
                                       plural={'Banners'}
                                       counter={getAverageBannersInBetween}
                />}
            {sortBy === 'avg-patch' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'Patch'}
                                       plural={'Patches'}
                                       counter={getAveragePatchesInBetween}
                />}


            {sortBy === 'runs' &&
                <RunsCounterSummary {...commonProps}
                                    singular={'run'} plural={'runs'}
                                    counter={getRunsCountSummary}
                />}
        </>
    )
}