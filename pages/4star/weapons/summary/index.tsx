import {BannerSummary} from "@/banners/summary";
import React from "react";
import SummaryPage from "@/components/SummaryPage";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').weapons['4']
        },
    };
}


export default function FourStarWeaponSummary(props: { banners: { [name: string]: BannerSummary } }) {

    return (
        <SummaryPage
            title={'4★ Weapon Summary'}
            data={props}
            type={'weapons'}
        />
    )
}