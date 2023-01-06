import {Table} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import {
    CommonSummaryProperties, getAverageDaysInBetween,
    getBannersSinceLastCountSummary,
    getPatchesSinceLastCountSummary,
    getRunsCountSummary
} from "@/banners/summary";
import DaysSinceLast from "@/components/summary/stat/DaysSinceLast";
import BasicCounterSummary from "./stat/BasicCounterSummary";
import AverageCounterSummary from "@/components/summary/stat/AverageCounterSummary";

type Properties = {
    filterText: string
    limitedOnly: boolean
    sortBy: string
    standard?: string[]
    date: string
} & CommonSummaryProperties

export default function NewSummaryTable(
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
            {sortBy === 'last-day' && <DaysSinceLast {...commonProps} date={date}/>}
            {sortBy === 'last-banner' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'banner ago'} plural={'banners ago'}
                                     counter={getBannersSinceLastCountSummary}
                />}
            {sortBy === 'last-patch' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'patch ago'} plural={'patches ago'}
                                     counter={getPatchesSinceLastCountSummary}
                />}
            {sortBy === 'avg-days' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'day'} plural={'days'}
                                       counter={getAverageDaysInBetween}
                />}
            {sortBy === 'avg-banner' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'banner'} plural={'banners'}
                                       counter={getAverageDaysInBetween}
                />}
            {sortBy === 'avg-patch' &&
                <AverageCounterSummary {...commonProps}
                                       singular={'patch'} plural={'patches'}
                                       counter={getAverageDaysInBetween}

                />}
            {sortBy === 'runs' &&
                <BasicCounterSummary {...commonProps}
                                     singular={'run'} plural={'runs'}
                                     counter={getRunsCountSummary}
                />}
        </Table>
    )
}