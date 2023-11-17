import Head from "next/head";
import { BannerHistoryDataset } from "@/banners/types";
import React from "react";
import HistoryPage from "@/components/history/HistoryPage";
import { LoadHSRHistory } from "@/banners/history";
import { TypeContext } from "@/components/context";

export async function getStaticProps() {
  return {
    props: {
      dataset: LoadHSRHistory(),
    },
  };
}

type Properties = {
  dataset: BannerHistoryDataset;
};

export default function FiveStarCharactersHome({ dataset }: Properties) {
  return (
    <>
      <Head>
        <title>5&#x2605; HSR Character Banner History - Samsara</title>
      </Head>
      <TypeContext.Provider
        value={{
          charactersText: "Characters",
          characterType: "hsr-characters",
          weaponsText: "Lightcones",
          weaponType: "lightcones",
        }}
      >
        <HistoryPage
          bannerType={"hsr-characters"}
          title={<>5&#x2605; HSR Character Banner History</>}
          dataset={dataset}
          featuredList={dataset.fiveStarCharacters}
        />
      </TypeContext.Provider>
    </>
  );
}
