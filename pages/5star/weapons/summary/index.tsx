import {BannerSummary} from "@/banners/summary";
import React from "react";
import SummaryPage from "@/components/SummaryPage";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').weapons['5']
        },
    };
}


export default function FiveStarWeaponSummary(props: { banners: { [name: string]: BannerSummary } }) {

    return (
        <SummaryPage
            title={'5★ Weapon Summary'}
            data={props}
            type={'weapons'}
        />
    )
}