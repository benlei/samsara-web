import {Card, Grid, Header, Image} from "semantic-ui-react";
import {CountSummary, getFilterFunction, UnknownFutureCounter} from "@/banners/summary";
import _ from "lodash";
import React from "react";
import {CommonSummaryProperties, Featured, VersionParts} from "@/banners/types";

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

function chunkSummary(summary: CountSummary[]): CountSummary[][] {
    const result: CountSummary[][] = [[]]
    let lastValue = summary[0].count

    for (const s of summary) {
        if (lastValue === s.count) {
            result[result.length - 1].push(s)
        } else {
            result.push([s])
            lastValue = s.count
        }
    }

    return result
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
        ], [order, order])
        .value()

    const filteredSummary = _.filter(baseSummary, getFilterFunction(filterText))
    const maxVal = baseSummary[order == 'desc' ? 0 : baseSummary.length - 1].count
    const chunkedSummary = chunkSummary(filteredSummary.length ? filteredSummary : baseSummary)

    return (
        <>
            {chunkedSummary.map((summary, j) =>
                <Grid.Row key={j} columns={3}>
                    <Grid.Column width={16}>
                        <Header size='medium'>{getRelativeTimeText(summary[0], singular, plural)}</Header>
                    </Grid.Column>
                    {summary.map((s, k) =>
                        <Grid.Column key={j}>
                            <Card fluid>
                                <Card.Content>

                                    <Image
                                        floated={'left'}
                                        src={`/images/${type}/${s.image}.png`}
                                        circular
                                        alt={s.image}
                                        size={'tiny'}
                                    />
                                    <Card.Meta>
                                        {s.name}
                                    </Card.Meta>
                                    {s.count > 0 &&
                                        <Card.Meta>
                                            last seen in {s.lastPatch}
                                        </Card.Meta>
                                    }
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    )}
                </Grid.Row>
            )}

        </>
    )
}