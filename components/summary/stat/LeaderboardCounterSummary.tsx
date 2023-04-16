import {Header, Icon, Image, Table} from "semantic-ui-react";
import {LeaderboardSummary} from "@/banners/summary";
import _ from "lodash";
import React, {useState} from "react";
import {Featured, VersionParts} from "@/banners/types";
import {getVersionPartsFromFeaturedList} from "@/banners/version";
import {Order} from "@/lotypes/sort";
import clsx from "clsx";

type Properties = {
    featuredList: Featured[]
    type: string
    counter: (versionParts: VersionParts[], featuredList: Featured[]) => LeaderboardSummary[]
}

export default function LeaderboardCounterSummary(
    {
        featuredList,
        type,
        counter,
    }: Properties
) {
    function triggerSort(newSort: string) {
        if (sortBy != newSort) {
            setSortBy(newSort)
        } else {
            setOrder(order == 'asc' ? 'desc' : 'asc')
        }
    }

    const [sortBy, setSortBy] = useState('days')
    const [order, setOrder] = useState('desc' as Order)
    const summary = _.chain(counter(getVersionPartsFromFeaturedList(featuredList, 'asc'), featuredList))
        .orderBy([
            (b) => sortBy === 'patches' ? b.patches : (sortBy === 'banners' ? b.banners : b.days),
            (b) => b.days,
            (b) => b.name,
        ], [order, order, order])
        .value()

    return (
        <Table unstackable className={'summary-table'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={2} className={'active'}>Featured</Table.HeaderCell>
                    <Table.HeaderCell
                        className={'clickable sortable-column'}
                        onClick={() => triggerSort('days')}
                    >
                        <span className={'desktop'}>Days <Icon name={'sort'} className={clsx({hidden: sortBy !== 'days'})}/></span>
                        <span className={'mobile'} style={{display: 'none'}}>D <Icon name={'sort'} className={clsx({hidden: sortBy !== 'days'})}/></span>
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        className={'clickable sortable-column'}
                        onClick={() => triggerSort('banners')}
                    >
                        <span className={'desktop'}>Banners <Icon name={'sort'} className={clsx({hidden: sortBy !== 'banners'})}/></span>
                        <span className={'mobile'} style={{display: 'none'}}>B <Icon name={'sort'} className={clsx({hidden: sortBy !== 'banners'})}/></span>
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        className={'clickable sortable-column'}
                        onClick={() => triggerSort('patches')}
                    >
                        <span className={'desktop'}>Patches <Icon name={'sort'} className={clsx({hidden: sortBy !== 'patches'})}/></span>
                        <span className={'mobile'} style={{display: 'none'}}>P <Icon name={'sort'} className={clsx({hidden: sortBy !== 'patches'})}/></span>
                    </Table.HeaderCell>
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
                        <Table.Cell verticalAlign={'top'}>
                            {s.days}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            {s.banners}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            {s.patches}
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}