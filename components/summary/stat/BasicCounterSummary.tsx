import {Header, Icon, Image, Table} from "semantic-ui-react";
import {CountSummary, getFilterFunction} from "@/banners/summary";
import _ from "lodash";
import React from "react";
import {CommonSummaryProperties, Featured, VersionParts} from "@/banners/types";

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

    return (
        <Table stackable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><Icon name={'image'} /></Table.HeaderCell>
                    <Table.HeaderCell>Featured</Table.HeaderCell>
                    <Table.HeaderCell>Count</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {summary.map((s, k) =>
                    <Table.Row key={k} verticalAlign={'top'}>
                        <Table.Cell style={{width: '80px'}}>
                            <Image size={'tiny'}
                                   circular
                                // floated={'left'}
                                   verticalAlign='middle'
                                   src={`/images/${type}/${s.image}.png`}
                                   alt={s.image}/>                        </Table.Cell>
                        <Table.Cell verticalAlign={'top'}>
                            <Header as={'span'} size={'small'}>{s.name}</Header>
                        </Table.Cell>
                        <Table.Cell>
                            <Header size={'small'}>{s.count} {s.count === 1 ? singular : plural}</Header>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}