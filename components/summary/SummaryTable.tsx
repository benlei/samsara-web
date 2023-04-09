import {Table} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import _ from "lodash";
import {
    getAverageBannersInBetween,
    getAverageDaysInBetween,
    getAveragePatchesInBetween,
    getBannersSinceLastCountSummary,
    getDaysSinceRunCountSummary,
    getLongestBannersInBetween,
    getLongestDaysInBetween, getLongestPatchesInBetween,
    getPatchesSinceLastCountSummary,
    getRunsCountSummary, getShortestBannersInBetween,
    getShortestDaysInBetween, getShortestPatchesInBetween
} from "@/banners/summary";
import RelativeBasicCounterSummary from "@/components/summary/stat/RelativeBasicCounterSummary";
import BasicCounterSummary from "./stat/BasicCounterSummary";
import AverageCounterSummary from "@/components/summary/stat/AverageCounterSummary";
import dayjs from "dayjs";
import {CommonSummaryProperties} from "@/banners/types";

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
) {
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
        <Table basic='very' celled collapsing unstackable className={'summary'}>
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
            {sortBy === 'longest-day' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'day'} plural={'days'}
                                     counter={(vp, banners) => getLongestDaysInBetween(vp, banners, now)}
                />}
            {sortBy === 'shortest-day' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'day'} plural={'days'}
                                     counter={(vp, banners) => getShortestDaysInBetween(vp, banners, now)}
                />}
            {sortBy === 'longest-banner' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'banner'} plural={'banners'}
                                     counter={getLongestBannersInBetween}
                />}
            {sortBy === 'shortest-banner' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'banner'} plural={'banners'}
                                     counter={getShortestBannersInBetween}
                />}
            {sortBy === 'longest-patch' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'patch'} plural={'patches'}
                                     counter={getLongestPatchesInBetween}
                />}
            {sortBy === 'shortest-patch' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'patch'} plural={'patches'}
                                     counter={getShortestPatchesInBetween}
                />}
            {sortBy === 'avg-day' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'day'} plural={'days'}
                                       counter={getAverageDaysInBetween}
                />}
            {sortBy === 'avg-banner' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'banner'} plural={'banners'}
                                       counter={getAverageBannersInBetween}
                />}
            {sortBy === 'avg-patch' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'patch'} plural={'patches'}
                                       counter={getAveragePatchesInBetween}
                />}
            {sortBy === 'runs' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'run'} plural={'runs'}
                                     counter={getRunsCountSummary}
                />}
        </Table>
    )
}