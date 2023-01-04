import {Container, Image, Label, Progress, Table} from "semantic-ui-react";
import {BannerSummary, getResourceSummaries, ResourceSummary} from "@/banners/summary";
import getVersionParts from "@/banners/version";
import _ from "lodash";
import dayjs from "dayjs";
import React from "react";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').characters['5']
        },
    };
}

export default function FiveStarBannerSummary(props: { banners: { [name: string]: BannerSummary } }) {
    const versionParts = getVersionParts(
        _.chain(props.banners)
            .mapValues((b) => b.versions)
            .value(),
        'asc',
    )

    const summary = _.chain(getResourceSummaries(versionParts, props.banners, dayjs()))
        .filter((b) => b.name != 'Keqing' && b.name != 'Tighnari')
        .orderBy((b) => b.daysSinceLastRun, 'desc')
        .value()

    const maxVal = summary[0].daysSinceLastRun


    function hasAverages(s: ResourceSummary): boolean {
        return s.avgBannerGapInterval + s.avgPatchGapInterval + s.avgPatchGapInterval > -3
    }

    return (
        <Container text style={{marginTop: '2em'}} textAlign={"center"}>
            <Table basic='very' celled collapsing unstackable className={'summary'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell style={{width: '100rem'}}>Length</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {summary.map((s, k) =>
                        <Table.Row key={k}>
                            <Table.Cell verticalAlign={'top'}>
                                <Image avatar
                                       src={`/images/characters/${s.image}.png`}
                                       alt={s.image}/>
                                <p>{s.name}</p>
                            </Table.Cell>
                            <Table.Cell verticalAlign={'top'}>
                                <Progress percent={100 * s.daysSinceLastRun / maxVal}
                                          size={'small'} color={'black'} disabled/>

                                {s.avgDaysInterval != -1 &&
                                    <Label basic>
                                        {s.avgDaysInterval}
                                        <Label.Detail>days (avg)</Label.Detail>
                                    </Label>
                                }

                                <Label basic>
                                    {s.daysSinceLastRun}
                                    <Label.Detail>days ago</Label.Detail>
                                </Label>
                                {/*<Label basic>*/}
                                {/*    {s.bannersSinceLastRun}*/}
                                {/*    <Label.Detail>Banners</Label.Detail>*/}
                                {/*</Label>*/}
                                {/*<Label basic>*/}
                                {/*    {s.patchesSinceLastRun}*/}
                                {/*    <Label.Detail>Patches</Label.Detail>*/}
                                {/*</Label>*/}

                                {/*{s.avgBannerGapInterval != -1 &&*/}
                                {/*    <Label basic>*/}
                                {/*        {s.avgBannerGapInterval}*/}
                                {/*        <Label.Detail>Banners</Label.Detail>*/}
                                {/*    </Label>*/}
                                {/*}*/}

                                {/*{s.avgPatchGapInterval != -1 &&*/}
                                {/*    <Label basic>*/}
                                {/*        {s.avgPatchGapInterval}*/}
                                {/*        <Label.Detail>Patches</Label.Detail>*/}
                                {/*    </Label>*/}
                                {/*}*/}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </Container>
    )
}