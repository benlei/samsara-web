import {Header, Icon, Image, Table} from "semantic-ui-react";
import {
    AverageCountSummary,
    getAverageBannersInBetween,
    getAverageDaysInBetween,
    getAveragePatchesInBetween
} from "@/banners/summary";
import {Featured, VersionParts} from "@/banners/types";
import _ from "lodash";
import React, {useState} from "react";
import {Order} from "@/lotypes/sort";
import clsx from "clsx";

type Properties = {
    versionParts: VersionParts[]
    featuredList: Featured[]
    type: string
    sortBy: string
}
export default function AverageCounterSummary(
    {
        versionParts,
        featuredList,
        type,
        sortBy,
    }: Properties
) {
    let plural: string
    let counter: (versionParts: VersionParts[], featuredList: Featured[]) => AverageCountSummary[]
    const [order, setOrder] = useState('desc' as Order)
    const [runsOrder, setRunsOrder] = useState('desc' as Order | null)

    if (sortBy === 'patches') {
        [plural, counter] = ['Patches', getAveragePatchesInBetween]
    } else if (sortBy === 'banners') {
        [plural, counter] = ['Banners', getAverageBannersInBetween]
    } else {
        [plural, counter] = ['Days', getAverageDaysInBetween]
    }

    function getRange(stat: AverageCountSummary): string {
        if (stat.standardDeviation > 0) {
            return `${_.round(stat.average - stat.standardDeviation, 1)} to ${_.round(stat.average + stat.standardDeviation, 1)}`
        }

        return `n/a`
    }

    const summary = _.chain(counter(versionParts, featuredList))
        .filter((b) => b.average > 0)
        .orderBy([
            (b) => runsOrder !== null ? b.count : 0,
            (b) => b.average,
            (b) => b.standardDeviation,
            (b) => b.name,
        ], [runsOrder === null ? 'desc' : runsOrder as Order, order, order, order])
        .value()

    return (
        <Table unstackable className={'summary-table'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={2} className={'active'}>Featured</Table.HeaderCell>
                    <Table.HeaderCell
                        className={'sortable-column clickable'}
                        onClick={() => setRunsOrder(runsOrder === 'desc' ? 'asc' : (runsOrder === 'asc' ? null : 'desc'))}
                    >
                        <Icon name={'redo'}
                              className={clsx({grey: runsOrder === null})}
                        /><Icon name={'sort'}
                                className={clsx({grey: runsOrder === null})}/>
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        className={'sortable-column clickable'}
                        onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
                    >
                        <Icon name={'hashtag'}/><Icon name={'sort'}/>
                    </Table.HeaderCell>
                    <Table.HeaderCell>Range</Table.HeaderCell>
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
                            {s.discrepancy ? s.count + 1 : s.count}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            {s.average}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            {getRange(s)}
                        </Table.Cell>

                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}