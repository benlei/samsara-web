import {Button, Container, Header, Icon, Ref} from "semantic-ui-react";
import React, {ReactNode, useEffect, useState} from "react";
import {getVersionPartsFromFeaturedList} from "@/banners/version";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import dayjs from "dayjs";
import {
    getBannersSinceLastCountSummary,
    getDaysSinceRunCountSummary,
    getPatchesSinceLastCountSummary
} from "@/banners/summary";
import RelativeBasicCounterSummary from "@/components/summary/stat/RelativeBasicCounterSummary";
import clsx from "clsx";

type Properties = {
    data: { featuredList: Featured[], date: string }
    title: ReactNode
    type: string
}
export default function LastRunSummaryPage(
    {
        data,
        title,
        type,
    }: Properties
) {
    const ref = React.useRef<any>()
    const [sortBy, setSortBy] = useState('days')
    const [order, setOrder] = useState('asc')
    const [now, setNow] = useState(data.date)

    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    const versionParts = getVersionPartsFromFeaturedList(data.featuredList, 'asc')

    function triggerSort(newSort: string) {
        if (sortBy != newSort) {
            setSortBy(newSort)
        } else {
            setOrder(order == 'asc' ? 'desc' : 'asc')
        }
    }

    function Summary(): JSX.Element {
        if (sortBy == 'patches') {
            return <RelativeBasicCounterSummary
                date={now}
                versionParts={versionParts}
                type={type}
                order={order}
                featuredList={data.featuredList}
                singular={'patch'} plural={'patches'}
                counter={getPatchesSinceLastCountSummary}
            />
        } else if (sortBy == 'banners') {
            return <RelativeBasicCounterSummary
                date={now}
                versionParts={versionParts}
                type={type}
                order={order}
                featuredList={data.featuredList}
                singular={'banner'} plural={'banners'}
                counter={getBannersSinceLastCountSummary}
            />
        }

        return <RelativeBasicCounterSummary
            date={now}
            versionParts={versionParts}
            type={type}
            order={order}
            featuredList={data.featuredList}
            singular={'day'} plural={'days'}
            counter={getDaysSinceRunCountSummary}
        />
    }

    return (
        <>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'} as={'h1'}>{title}</Header>

                <p>This page lists out when the featured character or weapon was last run.</p>

                <Button.Group widths='3'>
                    <Button active={sortBy == 'days'} onClick={() => triggerSort('days')}>
                        Days <Icon name={'sort'} className={clsx({hidden: sortBy != 'days'})}/>
                    </Button>
                    <Button active={sortBy == 'banners'} onClick={() => triggerSort('banners')}>
                        Banners <Icon name={'sort'} className={clsx({hidden: sortBy != 'banners'})}/>
                    </Button>
                    <Button active={sortBy == 'patches'} onClick={() => triggerSort('patches')}>
                        Patches <Icon name={'sort'} className={clsx({hidden: sortBy != 'patches'})}/>
                    </Button>
                </Button.Group>
            </Container>

            <Ref innerRef={ref}>
                <Container style={{marginTop: '2em'}}>
                    <Summary/>
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
