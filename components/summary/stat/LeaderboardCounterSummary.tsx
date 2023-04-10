import {Header, Icon, Image, Table} from "semantic-ui-react";
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
        <Table unstackable className={'leaderboard'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><Icon name={'image'}/></Table.HeaderCell>
                    <Table.HeaderCell>Featured</Table.HeaderCell>
                    <Table.HeaderCell className={sortBy.endsWith('day') ? 'active' : ''}>Days</Table.HeaderCell>
                    <Table.HeaderCell className={sortBy.endsWith('banner') ? 'active' : ''}>Banners</Table.HeaderCell>
                    <Table.HeaderCell className={sortBy.endsWith('patch') ? 'active' : ''}>Patches</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {summary.map((s, k) =>
                    <Table.Row key={k} verticalAlign={'top'}>
                        <Table.Cell style={{width: '80px'}} className={'desktop'}>
                            <Image size={'tiny'}
                                   circular
                                   verticalAlign='middle'
                                   src={`/images/${type}/${s.image}.png`}
                                   alt={s.image}/>
                        </Table.Cell>
                        <Table.Cell style={{width: '35px', display: 'none'}} className={'mobile'}>
                            <Image size={'mini'}
                                   circular
                                   verticalAlign='middle'
                                   src={`/images/${type}/${s.image}.png`}
                                   alt={s.image}/>
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            <Header as={'span'} size={'small'}>{s.name}</Header>
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            <Header size={'small'}>
                                <span className={'desktop'}>{s.days} {s.days === 1 ? 'day' : 'days'}</span>
                                <span style={{display: 'none'}} className={'mobile'}>{s.days}d</span>
                            </Header>
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            <Header size={'small'}>
                                <span className={'desktop'}>{s.banners} {s.banners === 1 ? 'banner' : 'banners'}</span>
                                <span style={{display: 'none'}} className={'mobile'}>{s.banners}b</span>
                            </Header>
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            <Header size={'small'}>
                                <span className={'desktop'}>{s.patches} {s.days === 1 ? 'patch' : 'patches'}</span>
                                <span style={{display: 'none'}} className={'mobile'}>{s.patches}p</span>
                            </Header>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}