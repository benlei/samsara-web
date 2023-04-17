import Head from 'next/head'
import {BannerHistoryDataset} from '@/banners/types'
import React from "react";
import HistoryPage from "@/components/history/HistoryPage";
import LoadDataset from '@/banners/history';


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

export default function FourStarWeaponsHome({dataset}: Properties) {
    return (
        <>
            <Head>
                <title>4&#x2605; Weapon Banner History - Samsara</title>
            </Head>
            <HistoryPage bannerType={'weapons'}
                         title={<>4&#x2605; Weapon Banner History</>}
                         dataset={dataset}
                         featuredList={dataset.fourStarWeapons}
            />
        </>
    )
}
