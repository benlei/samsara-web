import {Card, Feed, Grid, Image} from "semantic-ui-react";
import {getRunsCountSummary} from "@/banners/summary";
import _ from "lodash";
import React from "react";
import {Featured} from "@/banners/types";
import {chunk} from "@/banners/summaryUtils";
import {Order} from "@/lotypes/sort";
import {getVersionPartsFromFeaturedList} from "@/banners/version";

type Properties = {
    featuredList: Featured[]
    type: string
    order: Order
}

export default function RunsCounterSummary(
    {
        featuredList,
        type,
        order,
    }: Properties
) {
    const chunkedSummary = chunk(
        _.chain(getRunsCountSummary(getVersionPartsFromFeaturedList(featuredList, 'asc'), featuredList))
            .orderBy([
                (b) => b.count,
                (b) => b.name,
            ], [order, order])
            .value(),
        (s) => s.count,
    )

    return (
        <Grid className={'summary relative-row'} stackable>
            {chunkedSummary.map((summary, j) =>
                <Grid.Column key={j}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{summary[0].count} Run{summary[0].count !== 1 && 's'}</Card.Header>
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