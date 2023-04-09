import {Image, Label, Progress, Table} from "semantic-ui-react";
import {
    CountSummary,
    getColorClassName,
    getFilterFunction,
    getPercent
} from "@/banners/summary";
import _ from "lodash";
import React from "react";
import {BannerSummary, CommonSummaryProperties, Featured, VersionParts} from "@/banners/types";

type Properties = {
    singular: string
    plural: string
    counter: (versionParts: VersionParts[], featuredList: Featured[]) => CountSummary[]
} & CommonSummaryProperties

export default function BasicCounterSummary(
    {
        versionParts,
        featuredList,
        type,
        order,
        filterText,
        singular,
        plural,
        counter,
    }: Properties
) {
    const baseSummary = _.chain(counter(versionParts, featuredList))
        .orderBy([
            (b) => b.count,
            (b) => b.name,
        ], [order, order])
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
                            <Label.Detail>
                                {s.count === 1 ? singular : plural}
                            </Label.Detail>
                        </Label>
                    </Table.Cell>
                </Table.Row>
            )}
        </Table.Body>
    )
}