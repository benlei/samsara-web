import {Table} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import {
    CommonSummaryProperties,
    getBannersSinceLastCountSummary,
    getPatchesSinceLastCountSummary,
    getRunsCountSummary
} from "@/banners/summary";
import DaysSinceLast from "@/components/summary/stat/DaysSinceLast";
import BasicCounter from "@/components/summary/stat/BasicSinceLast";
import AvgDaysBetween from "@/components/summary/stat/AvgDaysBetween";
import AvgBannersBetween from "@/components/summary/stat/AvgBannersBetween";
import AvgPatchesBetween from "@/components/summary/stat/AvgPatchesBetween";

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
                <BasicCounter {...commonProps}
                              singular={'banner ago'} plural={'banners ago'}
                              counter={getBannersSinceLastCountSummary}
                />}
            {sortBy === 'last-patch' &&
                <BasicCounter {...commonProps}
                              singular={'patch ago'} plural={'patches ago'}
                              counter={getPatchesSinceLastCountSummary}
                />}
            {sortBy === 'avg-days' && <AvgDaysBetween {...commonProps} />}
            {sortBy === 'avg-banner' && <AvgBannersBetween {...commonProps} />}
            {sortBy === 'avg-patch' && <AvgPatchesBetween {...commonProps} />}
            {sortBy === 'runs' &&
                <BasicCounter {...commonProps}
                              singular={'run'} plural={'runs'}
                              counter={getRunsCountSummary}
                />}
        </Table>
    )
}