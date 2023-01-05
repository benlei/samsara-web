import {BannerSummary} from "@/banners/summary";
import React from "react";
import SummaryPage from "@/components/SummaryPage";
import dayjs from "dayjs";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').weapons['4'],
            date: dayjs().toISOString()
        },
    };
}


export default function FourStarWeaponSummary(props: { banners: { [name: string]: BannerSummary }, date: string }) {

    return (
        <SummaryPage
            title={'4★ Weapon Summary'}
            data={props}
            type={'weapons'}
        />
    )
}