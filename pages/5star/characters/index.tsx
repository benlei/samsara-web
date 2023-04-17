import Head from 'next/head'
import {BannerHistoryDataset} from '@/banners/types'
import React from "react";
import HistoryPage from "@/components/history/HistoryPage";
import LoadDataset from "@/banners/history";


export async function getStaticProps() {
    return {
        props: {
            dataset: LoadDataset(),
        },
    };
}

type Properties = {
    dataset: BannerHistoryDataset
}

export default function FiveStarCharactersHome({dataset}: Properties) {
    return (
        <>
            <Head>
                <title>5&#x2605; Character Banner History - Samsara</title>
            </Head>
            <HistoryPage bannerType={'characters'}
                         title={<>5&#x2605; Character Banner History</>}
                         dataset={dataset}
                         featuredList={dataset.fiveStarCharacters}
            />
        </>
    )
}
