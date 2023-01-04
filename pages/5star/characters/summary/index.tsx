import {BannerSummary} from "@/banners/summary";
import getVersionParts from "@/banners/version";
import _ from "lodash";
import React, {useState} from "react";
import SummaryOptions from "@/components/summary/SummaryOptions";
import SummaryTable from "@/components/summary/SummaryTable";
import {Container, Header} from "semantic-ui-react";
import Head from "next/head";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').characters['5']
        },
    };
}


export default function FiveStarCharacterSummary(props: { banners: { [name: string]: BannerSummary } }) {
    const [sortBy, setSortBy] = useState('last-day')
    const [order, setOrder] = useState('desc')
    const [limitedOnly, setLimitedOnly] = useState(true)
    const [filterText, setFilterText] = useState("")

    const versionParts = getVersionParts(
        _.chain(props.banners)
            .mapValues((b) => b.versions)
            .value(),
        'asc',
    )


    /**
     * TODO (SEE BELOW)
     * - still need to be able to filter by name.
     */


    return (
        <>
            <Head>
                <title>5&#x2605; Character Summary - Samsara</title>
            </Head>

            <Container text style={{marginTop: '2em'}}>
                <Header size={'medium'}>5&#x2605; Character Summary</Header>
            </Container>

            <SummaryOptions
                sortBy={sortBy} order={order} limitedOnly={limitedOnly} filterText={filterText}
                setOrder={setOrder} setSortBy={setSortBy} setLimitedOnly={setLimitedOnly} setFilterText={setFilterText}
            />

            <SummaryTable
                sortBy={sortBy} order={order as 'desc' | 'asc'} limitedOnly={limitedOnly} filterText={filterText}
                type={'characters'} banners={props.banners} versionParts={versionParts}
                standard={['Keqing', 'Tighnari']}
            />

        </>
    )
}