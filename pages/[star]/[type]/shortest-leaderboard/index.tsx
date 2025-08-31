import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { Featured } from "@/banners/types";
import { LoadGenshinBanners, LoadHSRBanners } from "@/banners/history";
import ShortestLeaderboardPage from "@/components/summary/ShortestLeaderboardPage";
import { TypeContext } from "@/components/context";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { 
  VALID_COMBINATIONS, 
  ValidCombination,
  getPageTitle,
  getPageHeading,
  getTypeContext,
  getBannerType,
  isHSRType
} from "@/lib/dynamic-page-utils";

type PageProps = {
  star: string;
  type: string;
  featuredList: Featured[];
  date: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: ValidCombination }[] = VALID_COMBINATIONS.map(({ star, type }) => ({
    params: { star, type },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  dayjs.extend(utc);
  
  const { star, type } = params as ValidCombination;
  
  // Load appropriate banners
  const isHSR = type === "hsr-characters" || type === "lightcones";
  const banners = isHSR ? LoadHSRBanners() : LoadGenshinBanners();

  // Get featured list based on star rating and type
  let featuredList: Featured[];
  if (star === "4star") {
    if (type === "characters" || type === "hsr-characters") {
      featuredList = banners.fourStarCharacters;
    } else {
      featuredList = banners.fourStarWeapons;
    }
  } else {
    if (type === "characters" || type === "hsr-characters") {
      featuredList = banners.fiveStarCharacters;
    } else {
      featuredList = banners.fiveStarWeapons;
    }
  }

  return {
    props: {
      star,
      type,
      featuredList,
      date: dayjs.utc().toISOString().substring(0, 10),
    },
  };
};

export default function DynamicShortestLeaderboardPage({ star, type, featuredList, date }: PageProps) {
  const title = getPageTitle(star, type, "shortest-leaderboard");
  const heading = getPageHeading(star, type, "shortest-leaderboard");
  const typeContext = getTypeContext(type);
  const bannerType = getBannerType(type);
  const isHSR = isHSRType(type);

  const content = (
    <ShortestLeaderboardPage
      title={<>{heading}</>}
      data={{ featuredList, date }}
      type={bannerType}
    />
  );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {isHSR ? (
        <TypeContext.Provider value={typeContext}>
          {content}
        </TypeContext.Provider>
      ) : (
        content
      )}
    </>
  );
}
