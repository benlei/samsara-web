import {Image, Label, Progress, Table} from "semantic-ui-react";
import {
    CommonSummaryProperties, getBannersSinceLastCountSummary,
    getColorClassName,
    getDaysSinceRunCountSummary,
    getFilterFunction,
    getPercent
} from "@/banners/summary";
import _ from "lodash";
import React from "react";

export default function BannersSinceLast(
    {
        versionParts,
        banners,
        type,
        order,
        filterText,
    }: CommonSummaryProperties
) {
    const baseSummary = _.chain(getBannersSinceLastCountSummary(versionParts, banners))
        .orderBy([
            (b) => b.count,
            (b) => b.name,
        ], order)
        .value()

    const filteredSummary = _.filter(baseSummary, getFilterFunction(filterText))
    const maxVal = baseSummary[order == 'desc' ? 0 : baseSummary.length - 1].count
    const summary = filteredSummary.length ? filteredSummary : baseSummary

    return (
        <Table.Body>
            {summary.map((s, k) =>
                <Table.Row key={k}>
                    <Table.Cell verticalAlign={'top'}>
                        <Image avatar
                               src={`/images/${type}/${s.image}.png`}
                               alt={s.image}/>
                        <p>{s.name}</p>
                    </Table.Cell>
                    <Table.Cell verticalAlign={'top'}>
                        <Progress
                            percent={getPercent(s.count, maxVal)}
                            className={getColorClassName(getPercent(s.count, maxVal))}
                            size={'small'}/>

                        <Label basic className={getColorClassName(getPercent(s.count, maxVal))}>
                            {s.count}
                            <Label.Detail>banner{s.count === 1 ? '' : 's'} ago</Label.Detail>
                        </Label>
                    </Table.Cell>
                </Table.Row>
            )}
        </Table.Body>
    )
}