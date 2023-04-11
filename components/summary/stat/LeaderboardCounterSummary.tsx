import {Header, Image, Table} from "semantic-ui-react";
import {getFilterFunction, LeaderboardSummary} from "@/banners/summary";
import _ from "lodash";
import React from "react";
import {CommonSummaryProperties, Featured, VersionParts} from "@/banners/types";

type Properties = {
    sortBy: string
    counter: (versionParts: VersionParts[], featuredList: Featured[]) => LeaderboardSummary[]
} & CommonSummaryProperties

export default function LeaderboardCounterSummary(
    {
        versionParts,
        featuredList,
        type,
        order,
        filterText,
        counter,
        sortBy,
    }: Properties
) {
    const baseSummary = _.chain(counter(versionParts, featuredList))
        .orderBy([
            (b) => sortBy.endsWith('patch') ? b.patches : (sortBy.endsWith('banner') ? b.banners : b.days),
            (b) => b.days,
            (b) => b.name,
        ], [order, order, order])
        .value()

    const filteredSummary = _.filter(baseSummary, getFilterFunction(filterText))
    const summary = filteredSummary.length ? filteredSummary : baseSummary

    return (
        <Table unstackable className={'summary-table'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={2} className={'active'}>Featured</Table.HeaderCell>
                    <Table.HeaderCell className={sortBy.endsWith('day') ? 'active' : ''}>Days</Table.HeaderCell>
                    <Table.HeaderCell className={sortBy.endsWith('banner') ? 'active' : ''}>Banners</Table.HeaderCell>
                    <Table.HeaderCell className={sortBy.endsWith('patch') ? 'active' : ''}>Patches</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {summary.map((s, k) =>
                    <Table.Row key={k} verticalAlign={'top'}>
                        <Table.Cell style={{width: '35px'}}>
                            <Image size={'tiny'}
                                   circular
                                   verticalAlign='middle'
                                   src={`/images/${type}/${s.image}.png`}
                                   alt={s.image}
                                   className={'desktop'}
                            />
                            <Image size={'mini'}
                                   circular
                                   verticalAlign='middle'
                                   src={`/images/${type}/${s.image}.png`}
                                   alt={s.image}
                                   style={{display: 'none'}}
                                   className={'mobile'}
                            />
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            <Header as={'div'} size={'small'}>{s.name}</Header>
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'} className={sortBy.endsWith('day') ? 'highlight' : ''}>
                            {s.days}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'} className={sortBy.endsWith('banner') ? 'highlight' : ''}>
                            {s.banners}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'} className={sortBy.endsWith('patch') ? 'highlight' : ''}>
                            {s.patches}
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}