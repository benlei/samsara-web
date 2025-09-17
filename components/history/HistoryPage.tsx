import React, { ReactNode, useRef, useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import HistoryOptions from "@/components/history/HistoryOptions";
import BannerTable from "@/components/history/BannerTable";
import { BannerHistoryDataset, FeaturedHistory } from "@/banners/types";
import ScrollContainer from "react-indiana-drag-scroll";
import PngDownloadButton from "@/components/PngDownloadButton";

type Properties = {
  dataset: BannerHistoryDataset;
  featuredList: FeaturedHistory[];
  bannerType: string;
  title: ReactNode;
};

export default function HistoryPage({
  dataset,
  featuredList,
  bannerType,
  title,
}: Properties) {
  const [sortBy, setSortByState] = useState("last");
  const [order, setOrderState] = useState("desc");
  const componentRef = useRef<any>();

  useEffect(() => {
    try {
      const savedSortBy = localStorage.getItem("history_sort");
      const savedOrder = localStorage.getItem("history_order");

      if (savedSortBy === "last" || savedSortBy === "first" || savedSortBy === "runs-last") {
        setSortByState(savedSortBy);
      }

      if (savedOrder === "asc" || savedOrder === "desc") {
        setOrderState(savedOrder);
      }
    } catch (error) {
      // Gracefully handle localStorage errors by continuing with default values
      console.warn("Failed to load preferences from localStorage:", error);
    }
  }, []);

  const setSortBy = (v: string) => {
    setSortByState(v);
    try {
      localStorage.setItem("history_sort", v);
    } catch (error) {
      // Gracefully handle localStorage errors - state is still updated
      console.warn("Failed to save sort preference to localStorage:", error);
    }
  };

  const setOrder = (v: string) => {
    setOrderState(v);
    try {
      localStorage.setItem("history_order", v);
    } catch (error) {
      // Gracefully handle localStorage errors - state is still updated
      console.warn("Failed to save order preference to localStorage:", error);
    }
  };

  return (
    <>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body1" paragraph>
          This page shows the banner history of featured characters/weapons.
          By default it sorts by when the featured character/weapon was last
          run, but you can also sort it by when the character/weapon was first
          run (in order), or by the total number of times it was run.
        </Typography>

        <Typography variant="body1" paragraph>
          For search/filtering you can input a comma separated list of names,
          and/or versions that you are interested in. For example you can
          search <code>aya</code> in the 5 star character history page to show the history of
          characters with &quot;aya&quot; in their name, such as Ayato and Ayaka.
          More over you can search <code>3.6, 3.2, 2.1, 2.5</code> to show all characters/weapons that were run in versions 2.1,
          2.5, 3.2, and 3.6.
        </Typography>

        <HistoryOptions
          order={order}
          setOrder={setOrder}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </Container>

      <Container sx={{ mt: 2 }}>
        <ScrollContainer
          className="scroll-container"
          hideScrollbars={false}
          ignoreElements="input"
        >
          <Box ref={componentRef}>
            <BannerTable
              bannerType={bannerType}
              dataset={dataset}
              featuredList={featuredList}
              order={order}
              sortBy={sortBy}
            />
          </Box>
        </ScrollContainer>
      </Container>

      <Container sx={{ mt: 4, textAlign: "center" }}>
        <PngDownloadButton
          node={componentRef}
          name="banner-history"
          type={bannerType}
        />
      </Container>
    </>
  );
}
