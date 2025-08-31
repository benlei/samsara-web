import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { BannerHistoryDataset } from "@/banners/types";
import LoadGenshinHistory, { LoadHSRHistory } from "@/banners/history";
import HistoryPage from "@/components/history/HistoryPage";
import { TypeContext } from "@/components/context";
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
  dataset: BannerHistoryDataset;
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
  const { star, type } = params as ValidCombination;
  
  // Load appropriate dataset
  const isHSR = type === "hsr-characters" || type === "lightcones";
  const dataset = isHSR ? LoadHSRHistory() : LoadGenshinHistory();

  return {
    props: {
      star,
      type,
      dataset,
    },
  };
};

const getFeaturedList = (dataset: BannerHistoryDataset, star: string, type: string) => {
  if (star === "4star") {
    if (type === "characters" || type === "hsr-characters") {
      return dataset.fourStarCharacters;
    } else {
      return dataset.fourStarWeapons;
    }
  } else {
    if (type === "characters" || type === "hsr-characters") {
      return dataset.fiveStarCharacters;
    } else {
      return dataset.fiveStarWeapons;
    }
  }
};

export default function DynamicIndexPage({ star, type, dataset }: PageProps) {
  const title = getPageTitle(star, type);
  const heading = getPageHeading(star, type);
  const typeContext = getTypeContext(type);
  const bannerType = getBannerType(type);
  const isHSR = isHSRType(type);
  const featuredList = getFeaturedList(dataset, star, type);

  const content = (
    <HistoryPage
      bannerType={bannerType}
      title={<>{heading}</>}
      dataset={dataset}
      featuredList={featuredList}
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
