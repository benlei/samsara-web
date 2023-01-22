import {Image, Label, Progress, Table} from "semantic-ui-react";
import {
    BannerSummary,
    CommonSummaryProperties,
    CountSummary,
    getColorClassName,
    getFilterFunction,
    getPercent,
    UnknownFutureCounter
} from "@/banners/summary";
import _ from "lodash";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {VersionParts} from "@/banners/types";

type Properties = {
    date: string
    singular: string
    plural: string
    counter: (versionParts: VersionParts[], bannerSummaries: { [name: string]: BannerSummary }, currDate: string) => CountSummary[]
} & CommonSummaryProperties

export default function RelativeBasicCounterSummary(
    {
        versionParts,
        banners,
        type,
        order,
        date,
        filterText,
        counter,
        singular,
        plural,
    }: Properties
) {
    const [now, setNow] = useState(date)
    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    const baseSummary = _.chain(counter(versionParts, banners, date))
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


                        <Label basic className={getColorClassName(getPercent(s.count, maxVal))}
                               style={s.count === UnknownFutureCounter ? {display: 'none'} : {}}>
                            {s.count === 0 ? (
                                <Label.Detail>
                                    now
                                </Label.Detail>
                            ) : (
                                <>
                                    {Math.abs(s.count)}
                                    <Label.Detail>
                                        {s.count < 0 ?
                                            'more ' + (s.count === -1 ? singular : plural)
                                            : (s.count === 1 ? singular : plural) + ' ago'
                                        }
                                    </Label.Detail>
                                </>
                            )}

                        </Label>
                    </Table.Cell>
                </Table.Row>
            )}
        </Table.Body>
    )
}