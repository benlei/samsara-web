import {Container, Image, Label, LabelProps, Progress, Table} from "semantic-ui-react";
import {BannerSummary, getResourceSummaries} from "@/banners/summary";
import getVersionParts from "@/banners/version";
import _ from "lodash";
import dayjs from "dayjs";
import React from "react";
import {ProgressProps} from "semantic-ui-react/dist/commonjs/modules/Progress/Progress";

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


    /**
     * TODO (SEE BELOW)
     * - still need to be able to change what to sort by + direction
     * - still need to be able to filter by name.
     */
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

    return (
        <Container text style={{marginTop: '2em'}} textAlign={"center"}>
            <Table basic='very' celled collapsing unstackable className={'summary'}>
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