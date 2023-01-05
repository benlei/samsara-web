import {Image, Label, Progress, Table} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import _ from "lodash";
import {BannerSummary, getResourceSummaries, ResourceSummary} from "@/banners/summary";
import dayjs, {Dayjs} from "dayjs";
import {VersionParts} from "@/banners/types";
import utc from "dayjs/plugin/utc";

type Properties = {
    filterText: string
    versionParts: VersionParts[]
    banners: { [name: string]: BannerSummary }
    type: string
    sortBy: string
    order: 'asc' | 'desc' | boolean,
    limitedOnly: boolean
    standard?: string[]
    date: string
}

const HighRange = 60
const MidRange = 25

function getColorClassName(p: number): string {
    if (p >= HighRange) {
        return 'dark'
    } else if (p >= MidRange) {
        return 'normal'
    }
    return 'light'
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
        date,
    }: Properties
) {
    dayjs.extend(utc);

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

    const [now, setNow] = useState(date)
    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    const baseSummary = _.chain(getResourceSummaries(versionParts, banners, dayjs.utc(now)))
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


    function getPercent(s: ResourceSummary): number {
        return 100 * Math.max(0, getField(s)) / Math.max(1, maxVal)
    }

    return (
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
                                percent={getPercent(s)}
                                className={getColorClassName(getPercent(s))}
                                size={'small'}/>

                            {sortBy.startsWith('avg') &&
                                <Label basic className={getColorClassName(getPercent(s))}>
                                    {s.runs}
                                    <Label.Detail>run{s.runs === 1 ? '' : 's'}</Label.Detail>
                                </Label>
                            }

                            <Label basic className={getColorClassName(getPercent(s))}>
                                {Math.max(0, getField(s))}
                                <Label.Detail>{getFieldHumanName(s, Math.max(0, getField(s)))}</Label.Detail>
                            </Label>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    )
}