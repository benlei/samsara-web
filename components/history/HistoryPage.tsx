import React, { ReactNode, useRef, useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import HistoryOptions from "@/components/history/HistoryOptions";
import BannerTable from "@/components/history/BannerTable";
import { BannerHistoryDataset, FeaturedHistory } from "@/banners/types";
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
        <Box
          ref={componentRef}
          sx={{
            overflow: 'auto',
            cursor: 'grab',
            userSelect: 'none',
            '&:active': {
              cursor: 'grabbing',
            },
            '&::-webkit-scrollbar': {
              height: '8px',
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'grey.100',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.400',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'grey.600',
              },
            },
          }}
          onMouseDown={(e) => {
            // Don't start drag if clicking on input elements or buttons
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || 
                target.tagName === 'BUTTON' || 
                target.tagName === 'TEXTAREA' ||
                target.closest('input') ||
                target.closest('button') ||
                target.closest('textarea')) {
              return;
            }

            const box = e.currentTarget;
            const startX = e.pageX - box.offsetLeft;
            const startY = e.pageY - box.offsetTop;
            const scrollLeft = box.scrollLeft;
            const scrollTop = box.scrollTop;

            const handleMouseMove = (e: MouseEvent) => {
              e.preventDefault();
              const x = e.pageX - box.offsetLeft;
              const y = e.pageY - box.offsetTop;
              const walkX = (x - startX) * 2; // Scroll speed multiplier
              const walkY = (y - startY) * 2;
              box.scrollLeft = scrollLeft - walkX;
              box.scrollTop = scrollTop - walkY;
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <BannerTable
            bannerType={bannerType}
            dataset={dataset}
            featuredList={featuredList}
            order={order}
            sortBy={sortBy}
          />
        </Box>
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
