import Head from 'next/head'
import {BannerHistoryDataset} from '@/banners/types'
import React from "react";
import HistoryPage from "@/components/history/HistoryPage";
import { LoadHSRDataset } from '@/banners/history';
import { TypeContext } from '@/components/context';


export async function getStaticProps() {
    return {
        props: {
            dataset: LoadHSRDataset(),
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
                <title>4&#x2605; Lightcone Banner History - Samsara</title>
            </Head>
            <TypeContext.Provider value={{
                charactersText: 'Characters',
                characterType: 'hsr-characters',
                weaponsText: 'Lightcones',
                weaponType: 'lightcones'
            }}>
                <HistoryPage bannerType={'lightcones'}
                            title={<>4&#x2605; Lightcone Banner History</>}
                            dataset={dataset}
                            featuredList={dataset.fourStarWeapons}
                />
            </TypeContext.Provider>
        </>
    )
}
