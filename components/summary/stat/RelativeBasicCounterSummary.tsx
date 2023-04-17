import {Card, Feed, Grid, Image} from "semantic-ui-react";
import {
    CountSummary,
    getBannersSinceLastCountSummary,
    getDaysSinceRunCountSummary,
    getPatchesSinceLastCountSummary,
    UnknownFutureCounter
} from "@/banners/summary";
import _ from "lodash";
import React, {useEffect, useState} from "react";
import {Featured, VersionParts} from "@/banners/types";
import {chunk} from "@/banners/summaryUtils";
import {Order} from "@/lotypes/sort";
import {getVersionPartsFromFeaturedList} from "@/banners/version";
import dayjs from "dayjs";

type Properties = {
    date: string
    featuredList: Featured[]
    type: string
    sortBy: string
    order: string
}

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
        featuredList,
        type,
        sortBy,
        order,
        date,
    }: Properties
) {
    const [now, setNow] = useState(date)
    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    let singular: string
    let plural: string
    let counter: (versionParts: VersionParts[], featuredList: Featured[], currDate: string) => CountSummary[]

    if (sortBy === 'patches') {
        [singular, plural, counter] = ['patch', 'patches', getPatchesSinceLastCountSummary]
    } else if (sortBy === 'banners') {
        [singular, plural, counter] = ['banner', 'banners', getBannersSinceLastCountSummary]
    } else {
        [singular, plural, counter] = ['day', 'days', getDaysSinceRunCountSummary]
    }

    const chunkedSummary = chunk(
        _.chain(counter(getVersionPartsFromFeaturedList(featuredList, 'asc'), featuredList, date))
            .orderBy([
                (b) => b.count,
                (b) => b.name,
            ], [order, order] as Order[])
            .value(),
        (s) => s.count,
    )

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