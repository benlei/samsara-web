import {Table} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import {
    CommonSummaryProperties,
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
        banners,
        type,
        sortBy,
        order,
        limitedOnly,
        standard = [],
        filterText,
        date,
    }: Properties
) {
    const baseBanners = _.chain(banners)
        .pickBy((b, name) => !limitedOnly || !standard!.includes(name))
        .value()

    const commonProps: CommonSummaryProperties = {
        versionParts,
        type,
        order,
        filterText,
        banners: baseBanners,
    }

    return (
        <Table basic='very' celled collapsing unstackable className={'summary'}>
            {sortBy === 'last-day' && <RelativeBasicCounterSummary {...commonProps} date={date}
                                                                   singular={'day'} plural={'days'}
                                                                   counter={getDaysSinceRunCountSummary}
            />}
            {sortBy === 'last-banner' &&
                <RelativeBasicCounterSummary {...commonProps} date={date}
                                     singular={'banner'} plural={'banners'}
                                     counter={getBannersSinceLastCountSummary}
                />}
            {sortBy === 'last-patch' &&
                <RelativeBasicCounterSummary {...commonProps} date={date}
                                     singular={'patch'} plural={'patches'}
                                     counter={getPatchesSinceLastCountSummary}
                />}
            {sortBy === 'longest-day' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'day'} plural={'days'}
                                     counter={(vp, banners) => getLongestDaysInBetween(vp, banners, date)}
                />}
            {sortBy === 'shortest-day' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'day'} plural={'days'}
                                     counter={(vp, banners) => getShortestDaysInBetween(vp, banners, date)}
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