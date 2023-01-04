import {Container, Image, Label, LabelProps, Progress, Table} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import {BannerSummary, getResourceSummaries} from "@/banners/summary";
import dayjs from "dayjs";
import {VersionParts} from "@/banners/types";
import {ProgressProps} from "semantic-ui-react/dist/commonjs/modules/Progress/Progress";

type Properties = {
    versionParts: VersionParts[]
    banners:  { [name: string]: BannerSummary }
    type: string
    sortBy: string
    order: string,
    limitedOnly: boolean
    standard?: string[]
}


function getProgressPropsByPercent(p: number): ProgressProps {
    const result: ProgressProps = {
        percent: p,
    }

    if (p >= 50) {
        result.color = 'grey'
    } else if (p >= 15) {
        result.color = 'black'
        result.disabled = true
    } else {
        result.color = 'grey'
        result.disabled = true
    }

    return result
}

function getLabelPropsByPercent(p: number): LabelProps {
    const result: LabelProps = {}

    if (p >= 50) {
        result.color = 'grey'
    } else if (p >= 15) {
        result.color = 'black'
        result.className = 'disabled'
    } else {
        result.color = 'grey'
        result.className = 'disabled'
    }

    return result
}

export default function SummaryTable(
    {
        versionParts,
        banners,
        type,
        sortBy,
        order,
        limitedOnly,
        standard = [],

    }: Properties
) {
    const summary = _.chain(getResourceSummaries(versionParts, banners, dayjs()))
        .filter((b) => b.name != 'Keqing' && b.name != 'Tighnari')
        .orderBy((b) => b.daysSinceLastRun, 'desc')
        .value()

    const maxVal = summary[0].daysSinceLastRun

    return (
        <Container text style={{marginTop: '2em'}} textAlign={"center"}>
            <Table basic='very' celled collapsing unstackable className={'summary'}>
                <Table.Body>
                    {summary.map((s, k) =>
                        <Table.Row key={k}>
                            <Table.Cell verticalAlign={'top'}>
                                <Image avatar
                                       src={`/images/weapons/${s.image}.png`}
                                       alt={s.image}/>
                                <p>{s.name}</p>
                            </Table.Cell>
                            <Table.Cell verticalAlign={'top'}>
                                <Progress
                                    {...getProgressPropsByPercent(100 * s.daysSinceLastRun / maxVal)}
                                    size={'small'}/>

                                <Label basic {...getLabelPropsByPercent(100 * s.daysSinceLastRun / maxVal)}>
                                    {s.daysSinceLastRun}
                                    <Label.Detail>days ago</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    )
}