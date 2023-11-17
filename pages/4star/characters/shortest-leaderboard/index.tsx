import { LoadGenshinBanners } from "@/banners/history";
import { Featured } from "@/banners/types";
import ShortestLeaderboardPage from "@/components/summary/ShortestLeaderboardPage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";

export async function getStaticProps() {
  dayjs.extend(utc);

  return {
    props: {
      featuredList: LoadGenshinBanners().fourStarCharacters,
      date: dayjs.utc().toISOString().substring(0, 10),
    },
  };
}

export default function FourStarCharacterSummary(props: {
  featuredList: Featured[];
  date: string;
}) {
  return (
    <>
      <Head>
        <title>4&#x2605; Character Shortest Rerun Leaderboard - Samsara</title>
      </Head>
      <ShortestLeaderboardPage
        title={<>4&#x2605; Character Shortest Rerun Leaderboard</>}
        data={props}
        type={"characters"}
      />
    </>
  );
}
