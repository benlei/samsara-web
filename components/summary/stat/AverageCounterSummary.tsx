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
import {getVersionPartsFromFeaturedList} from "@/banners/version";
import {getImageFromName} from "@/format/image";

type Properties = {
    featuredList: Featured[]
    type: string
    sortBy: string
    order: Order
    triggerSort: (newSort: string) => void
}
export default function AverageCounterSummary(
    {
        featuredList,
        type,
        sortBy,
        order,
        triggerSort
    }: Properties
) {
    const versionParts = getVersionPartsFromFeaturedList(featuredList, 'asc')

    let counter: (versionParts: VersionParts[], featuredList: Featured[]) => AverageCountSummary[]
    const [runsOrder, setRunsOrder] = useState('desc' as Order | null)

    if (sortBy === 'patches') {
        counter = getAveragePatchesInBetween
    } else if (sortBy === 'banners') {
        counter = getAverageBannersInBetween
    } else {
        counter = getAverageDaysInBetween
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

    const naFeatured = _.chain(featuredList)
        .filter((f) => f.versions.length <= 1)
        .orderBy((b) => b.name, 'asc')
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
                                className={clsx('desktop', {grey: runsOrder === null})}/>
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        className={'sortable-column clickable'}
                        onClick={() => triggerSort(sortBy)}
                    >
                        {sortBy} <Icon name={'sort'} className={'desktop'}/>
                    </Table.HeaderCell>
                    <Table.HeaderCell className={'desktop'}>
                        Range
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
                            {s.discrepancy ? s.count + 1 : s.count}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            {s.average}
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'} className={'desktop'}>
                            {getRange(s)}
                        </Table.Cell>
                    </Table.Row>
                )}

                {naFeatured.map((f, k) =>
                    <Table.Row key={k} verticalAlign={'top'} className={'not-applicable'}>
                        <Table.Cell style={{width: '35px'}}>
                            <Image size={'tiny'}
                                   circular
                                   verticalAlign='middle'
                                   src={`/images/${type}/${getImageFromName(f.name)}.png`}
                                   alt={getImageFromName(f.name)}
                                   className={'desktop'}
                            />
                            <Image size={'mini'}
                                   circular
                                   verticalAlign='middle'
                                   src={`/images/${type}/${getImageFromName(f.name)}.png`}
                                   alt={getImageFromName(f.name)}
                                   style={{display: 'none'}}
                                   className={'mobile'}
                            />
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            <Header as={'div'} size={'small'}>{f.name}</Header>
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            1
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            n/a
                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'} className={'desktop'}>
                            n/a
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}