import {BannerSummary} from "@/banners/summary";
import React from "react";
import SummaryPage from "@/components/SummaryPage";
import dayjs from "dayjs";

export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').characters['4'],
            date: dayjs().toISOString()
        },
    };
}


export default function FourStarCharacterSummary(props: { banners: { [name: string]: BannerSummary }, date: string }) {

    return (
        <SummaryPage
            title={'4★ Character Summary'}
            data={props}
            type={'characters'}
        />
    )
}