import {Button, Container, Header, Icon, Ref} from "semantic-ui-react";
import React, {ReactNode, useEffect, useState} from "react";
import getVersionParts from "@/banners/version";
import _ from "lodash";
import PngDownloadButton from "@/components/PngDownloadButton";
import {CommonSummaryProperties, Featured} from "@/banners/types";
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
    standard?: string[]
}
export default function LastRunSummaryPage(
    {
        data,
        title,
        type,
        standard = [],
    }: Properties
) {
    const ref = React.useRef<any>()
    const [sortBy, setSortBy] = useState('days')
    const [order, setOrder] = useState('asc')
    const [limitedOnly, setLimitedOnly] = useState(true)
    const [filterText, setFilterText] = useState("")
    const [isMounted, setIsMounted] = React.useState(false)
    const [now, setNow] = useState(data.date)


    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])

    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    const versionParts = getVersionParts(
        _.chain(data.featuredList)
            .map((featured) => featured.versions)
            .flatten()
            .value(),
        'asc',
    )

    const baseFeaturedList = _.chain(data.featuredList)
        .filter((featured) => !limitedOnly || !standard!.includes(featured.name))
        .value()

    const commonProps: CommonSummaryProperties = {
        versionParts,
        type,
        filterText,
        order,
        featuredList: baseFeaturedList,
    }

    function triggerSort(newSort: string) {
        if (sortBy != newSort) {
            setSortBy(newSort)
        } else {
            setOrder(order == 'asc' ? 'desc' : 'asc')
        }
    }

    function Summary(): JSX.Element {
        if (sortBy == 'patches') {
            return <RelativeBasicCounterSummary {...commonProps} date={now}
                                                singular={'patch'} plural={'patches'}
                                                counter={getPatchesSinceLastCountSummary}
            />
        } else if (sortBy == 'banners') {
            return <RelativeBasicCounterSummary {...commonProps} date={now}
                                                singular={'banner'} plural={'banners'}
                                                counter={getBannersSinceLastCountSummary}
            />
        }

        return <RelativeBasicCounterSummary {...commonProps} date={now}
                                            singular={'day'} plural={'days'}
                                            counter={getDaysSinceRunCountSummary}
        />
    }

    return (
        <>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'}>{title}</Header>
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
