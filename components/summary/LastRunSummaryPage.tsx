import {Button, Container, Header, Icon, Ref} from "semantic-ui-react";
import React, {ReactNode, useEffect, useState} from "react";
import {getVersionPartsFromFeaturedList} from "@/banners/version";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import dayjs from "dayjs";
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

    function triggerSort(newSort: string) {
        if (sortBy != newSort) {
            setSortBy(newSort)
        } else {
            setOrder(order == 'asc' ? 'desc' : 'asc')
        }
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
                    <RelativeBasicCounterSummary
                        date={data.date}
                        type={type}
                        sortBy={sortBy}
                        order={order}
                        featuredList={data.featuredList}
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
