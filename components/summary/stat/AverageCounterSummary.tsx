import {Header, Image, Table} from "semantic-ui-react";
import {AverageCountSummary, getFilterFunction} from "@/banners/summary";
import {CommonSummaryProperties, Featured, VersionParts} from "@/banners/types";
import _ from "lodash";
import React from "react";

type Properties = {
    singular: string
    plural: string
    counter: (versionParts: VersionParts[], featuredList: Featured[]) => AverageCountSummary[]
} & CommonSummaryProperties
export default function AverageCounterSummary(
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
    function getRange(stat: AverageCountSummary): string {
        if (stat.standardDeviation > 0) {
            return `${_.round(stat.average - stat.standardDeviation, 1)} ~ ${_.round(stat.average + stat.standardDeviation, 1)}`
        }

        return `n/a`
    }

    const baseSummary = _.chain(counter(versionParts, featuredList))
        .filter((b) => b.average > 0)
        .orderBy([
            (b) => b.average,
            (b) => b.standardDeviation,
            (b) => b.count,
            (b) => b.name,
        ], [order, order, order, order])
        .value()

    const filteredSummary = _.filter(baseSummary, getFilterFunction(filterText))
    const summary = filteredSummary.length ? filteredSummary : baseSummary

    return (
        <Table unstackable className={'summary-table'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan={2} className={'active'}>Featured</Table.HeaderCell>
                    <Table.HeaderCell>Runs</Table.HeaderCell>
                    <Table.HeaderCell>{plural}</Table.HeaderCell>
                    <Table.HeaderCell>{singular} Range</Table.HeaderCell>
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
                        <Table.Cell verticalAlign={'top'} >
                            {getRange(s)}
                        </Table.Cell>

                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}