import {Container, Header, Ref} from "semantic-ui-react";
import SummaryOptions from "@/components/summary/SummaryOptions";
import React, {useEffect, useState} from "react";
import getVersionParts from "@/banners/version";
import _ from "lodash";
import {BannerSummary} from "@/banners/summary";
import PngDownloadButton from "@/components/PngDownloadButton";
import SummaryTable from "@/components/summary/SummaryTable";

type Properties = {
    data: { banners: { [name: string]: BannerSummary }, date: string }
    title: string
    type: string
    standard?: string[]
}
export default function SummaryPage(
    {
        data,
        title,
        type,
        standard = [],
    }: Properties
) {
    const [sortBy, setSortBy] = useState('last-day')
    const [order, setOrder] = useState('desc')
    const [limitedOnly, setLimitedOnly] = useState(true)
    const [filterText, setFilterText] = useState("")
    const [expand, setExpand] = useState(true)

    const versionParts = getVersionParts(
        _.chain(data.banners)
            .mapValues((b) => b.versions)
            .value(),
        'asc',
    )

    const [isMounted, setIsMounted] = React.useState(false)

    const ref = React.useRef<any>()
    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])
    return (
        <>
            <Container text={!expand} style={{marginTop: '2em'}}>
                <Header size={'medium'}>{title}</Header>
            </Container>

            <Container text={!expand} style={{marginTop: '1em'}}>
                <SummaryOptions
                    sortBy={sortBy} order={order} limitedOnly={limitedOnly} showLimitedOnly={!!standard?.length}
                    setOrder={setOrder} setSortBy={setSortBy} setLimitedOnly={setLimitedOnly}
                    setFilterText={setFilterText}
                    expand={expand} setExpand={setExpand}
                />
            </Container>

            <Ref innerRef={ref}>
                <Container text={!expand} style={{marginTop: '1em'}} textAlign={"center"}>
                    <SummaryTable
                        sortBy={sortBy} order={order as 'desc' | 'asc'} limitedOnly={limitedOnly}
                        filterText={filterText}
                        type={type} banners={data.banners} versionParts={versionParts}
                        standard={standard}
                        date={data.date}
                    />
                </Container>
            </Ref>

            <Container text={!expand} style={{marginTop: '1em'}} textAlign={"center"}>
                <PngDownloadButton node={ref} name={'summary'}/>
            </Container>
        </>
    )
}