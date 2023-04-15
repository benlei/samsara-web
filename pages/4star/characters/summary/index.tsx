import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";
import {Featured} from "@/banners/types";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import LastRunSummaryPage from "@/components/summary/LastRunSummaryPage";

export async function getStaticProps() {
    dayjs.extend(utc);

    return {
        props: {
            featuredList: YAML.parse(fs.readFileSync(path.resolve('./public/data/banners.yaml'), 'utf8')).fourStarCharacters,
            date: dayjs.utc().toISOString().substring(0, 10)
        },
    };
}


export default function FourStarCharacterSummary(props: { featuredList: Featured[], date: string }) {
    return (
        <>
            <Head>
                <title>4&#x2605; Character Summary - Samsara</title>
            </Head>
            <LastRunSummaryPage
                title={<>4&#x2605; Character Summary</>}
                data={props}
                type={'characters'}
            />
        </>
    )
}