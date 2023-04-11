import {Card, Feed, Grid, Image} from "semantic-ui-react";
import {CountSummary, getFilterFunction} from "@/banners/summary";
import _ from "lodash";
import React from "react";
import {CommonSummaryProperties, Featured, VersionParts} from "@/banners/types";
import {chunk} from "@/banners/summaryUtils";

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
    const summary = filteredSummary.length ? filteredSummary : baseSummary
    const chunkedSummary = chunk(filteredSummary.length ? filteredSummary : baseSummary, (s) => s.count)

    return (
        <Grid className={'summary relative-row'} stackable>
            {chunkedSummary.map((summary, j) =>
                    // <Grid.Row key={j} className={'relative-row'}>
                    <Grid.Column key={j}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{summary[0].count} {summary[0].count === 1 ? singular : plural}</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Feed>
                                    {summary.map((s, k) =>
                                        <Feed.Event key={k}>
                                            <Feed.Label>
                                                <Image
                                                    // floated={'left'}
                                                    src={`/images/${type}/${s.image}.png`}
                                                    circular
                                                    alt={s.image}
                                                    // size={'tiny'}
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
                // </Grid.Row>
            )}
        </Grid>
    )
}