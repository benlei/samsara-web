import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";
import {Featured} from "@/banners/types";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import RunsSummaryPage from "@/components/summary/RunsSummaryPage";

export async function getStaticProps() {
    dayjs.extend(utc);
    return {
        props: {
            featuredList: YAML.parse(fs.readFileSync(path.resolve('./public/data/hsr-banners.yaml'), 'utf8')).fourStarWeapons,
        },
    };
}


export default function FourStarWeaponSummary(props: { featuredList: Featured[] }) {
    return (
        <>
            <Head>
                <title>4&#x2605; Lightcone Runs Summary - Samsara</title>
            </Head>
            <RunsSummaryPage
                title={<>4&#x2605; Lightcone Runs Summary</>}
                data={props}
                type={'lightcones'}
            />
        </>
    )
}