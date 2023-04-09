import {Container, Header, Ref} from "semantic-ui-react";
import SummaryOptions from "@/components/summary/SummaryOptions";
import React, {ReactNode, useEffect, useState} from "react";
import getVersionParts from "@/banners/version";
import _ from "lodash";
import PngDownloadButton from "@/components/PngDownloadButton";
import SummaryTable from "@/components/summary/SummaryTable";
import {BannerSummary, Featured} from "@/banners/types";

type Properties = {
    data: { featuredList: Featured[], date: string }
    title: ReactNode
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
        _.chain(data.featuredList)
            .map((featured) => featured.versions)
            .flatten()
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
                <Header size={'large'}>{title}</Header>
            </Container>

            <Container text={!expand} style={{marginTop: '1em'}}>
                <SummaryOptions
                    sortBy={sortBy} order={order} limitedOnly={limitedOnly} showLimitedOnly={!!standard?.length}
                    setOrder={setOrder} setSortBy={setSortBy} setLimitedOnly={setLimitedOnly}
                    setFilterText={setFilterText}
                    expand={expand} setExpand={setExpand}
                    latestVersionPart={versionParts[versionParts.length - 1]}
                />
            </Container>

            <Ref innerRef={ref}>
                <Container text={!expand} style={{marginTop: '1em'}}>
                    <SummaryTable
                        sortBy={sortBy} order={order as 'desc' | 'asc'} limitedOnly={limitedOnly}
                        filterText={filterText}
                        type={type} featuredList={data.featuredList} versionParts={versionParts}
                        standard={standard}
                        date={data.date}
                    />
                </Container>
            </Ref>

            <Container text={!expand} style={{marginTop: '1em'}} textAlign={"center"}>
                <PngDownloadButton node={ref} name={'summary'}
                                   type={type}
                />
            </Container>
        </>
    )
}
