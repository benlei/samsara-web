import {Container, Image, Label, LabelProps, Progress, Table} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import {BannerSummary, getResourceSummaries, ResourceSummary} from "@/banners/summary";
import dayjs from "dayjs";
import {VersionParts} from "@/banners/types";
import {ProgressProps} from "semantic-ui-react/dist/commonjs/modules/Progress/Progress";

type Properties = {
    filterText: string
    versionParts: VersionParts[]
    banners: { [name: string]: BannerSummary }
    type: string
    sortBy: string
    order: 'asc' | 'desc' | boolean,
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
        filterText,
    }: Properties
) {
    function getField(b: ResourceSummary): number {
        switch (sortBy) {
            default:
            case 'last-day':
                return b.daysSinceLastRun
            case 'last-banner':
                return b.bannersSinceLastRun
            case 'last-patch':
                return b.patchesSinceLastRun
            case 'avg-days':
                return b.avgDaysInterval
            case 'avg-banner':
                return b.avgBannerGapInterval
            case 'avg-patch':
                return b.avgPatchGapInterval
            case 'runs':
                return b.runs
        }
    }

    function getFieldHumanName(b: ResourceSummary, count: number): string {
        switch (sortBy) {
            default:
            case 'last-day':
                return 'day' + (count === 1 ? '' : 's') + ' ago'
            case 'last-banner':
                return 'banner' + (count == 1 ? '' : 's') + ' ago'
            case 'last-patch':
                return 'patch' + (count === 1 ? '' : 'es') + ' ago'
            case 'avg-days':
                return 'avg. days'
            case 'avg-banner':
                return 'avg. banners'
            case 'avg-patch':
                return 'avg. patches'
            case 'runs':
                return 'run' + (count === 1 ? '' : 's')
        }
    }

    function getFilterFunction(): (s: ResourceSummary) => boolean {
        if (!filterText.trim().length) {
            return () => true
        }

        if (filterText.startsWith('/') && filterText.endsWith('/')) {
            try {
                const re = new RegExp(filterText.substring(1, filterText.length - 1), 'i')
                return (s: ResourceSummary) => re.test(s.name)
            } catch (ignore) {

            }
        }

        return (s: ResourceSummary) => s.name.toLowerCase().includes(filterText!.toLowerCase())
    }

    const baseSummary = _.chain(getResourceSummaries(versionParts, banners, dayjs()))
        .filter((b) => !limitedOnly || !standard!.includes(b.name))
        .filter((b) => !sortBy.startsWith('avg') || getField(b) > 0)
        .orderBy([
            (b) => getField(b),
            (b) => sortBy.startsWith('avg') ? b.runs : b.name,
            (b) => b.name,
        ], order)
        .value()

    const filteredSummary = _.filter(baseSummary, getFilterFunction())
    const summary = filteredSummary.length ? filteredSummary : baseSummary
    const maxVal = getField(baseSummary[order == 'desc' ? 0 : baseSummary.length - 1])

    return (
        <Container text style={{marginTop: '1em'}} textAlign={"center"}>
            <Table basic='very' celled collapsing unstackable className={'summary'}>
                <Table.Body>
                    {summary.map((s, k) =>
                        <Table.Row key={k}>
                            <Table.Cell verticalAlign={'top'}>
                                <Image avatar
                                       src={`/images/${type}/${s.image}.png`}
                                       alt={s.image}/>
                                <p>{s.name}</p>
                            </Table.Cell>
                            <Table.Cell verticalAlign={'top'}>
                                <Progress
                                    {...getProgressPropsByPercent(100 * Math.max(0, getField(s)) / Math.max(1, maxVal))}
                                    size={'small'}/>

                                {sortBy.startsWith('avg') &&
                                    <Label
                                        basic {...getLabelPropsByPercent(100 * Math.max(0, getField(s)) / Math.max(1, maxVal))}>
                                        {s.runs}
                                        <Label.Detail>run{s.runs === 1 ? '' : 's'}</Label.Detail>
                                    </Label>
                                }

                                <Label
                                    basic {...getLabelPropsByPercent(100 * Math.max(0, getField(s)) / Math.max(1, maxVal))}>
                                    {Math.max(0, getField(s))}
                                    <Label.Detail>{getFieldHumanName(s, Math.max(0, getField(s)))}</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    )
}