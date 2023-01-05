import {Image, Label, Progress, Table} from "semantic-ui-react";
import {CommonSummaryProperties, getColorClassName, getDaysSinceRunCountSummary, getFilterFunction, getPercent} from "@/banners/summary";
import _ from "lodash";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";

type Properties = {
    date: string
} & CommonSummaryProperties

export default function DaysSinceLast(
    {
        versionParts,
        banners,
        type,
        order,
        date,
        filterText,
    }: Properties
) {
    const [now, setNow] = useState(date)
    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    const baseSummary = _.chain(getDaysSinceRunCountSummary(versionParts, banners, date))
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
                            <Label.Detail>day{s.count === 1 ? '' : 's'} ago</Label.Detail>
                        </Label>
                    </Table.Cell>
                </Table.Row>
            )}
        </Table.Body>
    )
}