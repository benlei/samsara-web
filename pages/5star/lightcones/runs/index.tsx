import { LoadHSRBanners } from "@/banners/history";
import { Featured } from "@/banners/types";
import RunsSummaryPage from "@/components/summary/RunsSummaryPage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";

export async function getStaticProps() {
  dayjs.extend(utc);
  return {
    props: {
      featuredList: LoadHSRBanners().fiveStarWeapons,
    },
  };
}

export default function FiveStarWeaponSummary(props: {
  featuredList: Featured[];
}) {
  return (
    <>
      <Head>
        <title>5&#x2605; Lightcone Reruns Summary - Samsara</title>
      </Head>
      <RunsSummaryPage
        title={<>5&#x2605; Lightcone Reruns Summary</>}
        data={props}
        type={"lightcones"}
      />
    </>
  );
}
