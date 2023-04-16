import {Button, Container, Header, Icon, Ref} from "semantic-ui-react";
import React, {ReactNode, useState} from "react";
import {getVersionPartsFromFeaturedList} from "@/banners/version";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import clsx from "clsx";
import AverageCounterSummary from "@/components/summary/stat/AverageCounterSummary";
import {Order} from "@/lotypes/sort";

type Properties = {
    data: { featuredList: Featured[], date: string }
    title: ReactNode
    type: string
}
export default function AverageRunSummaryPage(
    {
        data,
        title,
        type,
    }: Properties
) {
    const ref = React.useRef<any>()
    const versionParts = getVersionPartsFromFeaturedList(data.featuredList, 'asc')
    const [sortBy, setSortBy] = useState('days')

    function triggerSort(newSort: string) {
        if (sortBy != newSort) {
            setSortBy(newSort)
        }
    }

    return (
        <>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'} as={'h1'}>{title}</Header>

                <p>
                    This page shows the average wait time between a featured character or weapon's banner runs.
                    It first sorts by the run count, then the day/banner/patch. The fewer number of runs the
                    character/weapon has, the less reliable the day/banner/patch rerun average range will be. That
                    being said, miHoYo's methodology for reruns might really just be random.
                </p>

                <Button.Group widths='3'>
                    <Button active={sortBy == 'days'} onClick={() => triggerSort('days')}>
                        Days
                    </Button>
                    <Button active={sortBy == 'banners'} onClick={() => triggerSort('banners')}>
                        Banners
                    </Button>
                    <Button active={sortBy == 'patches'} onClick={() => triggerSort('patches')}>
                        Patches
                    </Button>
                </Button.Group>
            </Container>

            <Ref innerRef={ref}>
                <Container style={{marginTop: '2em'}}>
                    <AverageCounterSummary
                        versionParts={versionParts}
                        type={type}
                        featuredList={data.featuredList}
                        sortBy={sortBy}
                    />
                </Container>
            </Ref>

            <Container style={{marginTop: '1em'}} textAlign={"center"}>
                <PngDownloadButton node={ref} name={'summary'}
                                   type={type}
                />
            </Container>
        </>
    )
}
