import {Card, Feed, Grid, Image} from "semantic-ui-react";
import {CountSummary, getFilterFunction, UnknownFutureCounter} from "@/banners/summary";
import _ from "lodash";
import React from "react";
import {CommonSummaryProperties, Featured, VersionParts} from "@/banners/types";
import {chunk} from "@/banners/summaryUtils";
import {Order} from "../../../lotypes";

type Properties = {
    date: string
    singular: string
    plural: string
    counter: (versionParts: VersionParts[], featuredList: Featured[], currDate: string) => CountSummary[]
} & CommonSummaryProperties

function getRelativeTimeText(s: CountSummary, singular: string, plural: string): string {
    if (s.count == UnknownFutureCounter) {
        return 'coming soon'
    }

    if (!s.count) {
        return 'in progress'
    }

    if (s.count < 0) {
        return `${Math.abs(s.count)} more ` + (s.count === -1 ? singular : plural)
    }

    return `${s.count} ` + (s.count === 1 ? singular : plural) + ' ago'
}

export default function RelativeBasicCounterSummary(
    {
        versionParts,
        featuredList,
        type,
        order,
        date,
        filterText,
        counter,
        singular,
        plural,
    }: Properties
) {
    const baseSummary = _.chain(counter(versionParts, featuredList, date))
        .orderBy([
            (b) => b.count,
            (b) => b.name,
        ], [order, order] as Order[])
        .value()

    const filteredSummary = _.filter(baseSummary, getFilterFunction(filterText))
    const chunkedSummary = chunk(filteredSummary.length ? filteredSummary : baseSummary, (s) => s.count)

    return (
        <Grid className={'summary relative-row'} stackable>
            {chunkedSummary.map((summary, j) =>
                <Grid.Column key={j}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{getRelativeTimeText(summary[0], singular, plural)}</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Feed>
                                {summary.map((s, k) =>
                                    <Feed.Event key={k}>
                                        <Feed.Label>
                                            <Image
                                                src={`/images/${type}/${s.image}.png`}
                                                circular
                                                alt={s.image}
                                            />
                                        </Feed.Label>
                                        <Feed.Content>
                                            <Feed.Date>
                                                {s.name}
                                            </Feed.Date>
                                        </Feed.Content>
                                    </Feed.Event>
                                )}
                            </Feed>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            )}
        </Grid>
    )
}