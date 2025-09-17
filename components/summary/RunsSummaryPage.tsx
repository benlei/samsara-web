import { Button, Container, Typography, Box } from "@mui/material";
import { Sort } from "@mui/icons-material";
import React, { ReactNode, useEffect, useState, useRef } from "react";
import PngDownloadButton from "@/components/PngDownloadButton";
import { Featured } from "@/banners/types";
import RunsCounterSummary from "@/components/summary/stat/RunsCounterSummary";
import { Order } from "@/lotypes/sort";

type Properties = {
  data: { featuredList: Featured[] };
  title: ReactNode;
  type: string;
};

export default function RunsSummaryPage({ data, title, type }: Properties) {
  const ref = useRef<any>();
  const [order, setOrder] = useState<Order>("desc");

  useEffect(() => {
    try {
      const sOrder = localStorage.getItem("runs_order");

      if (sOrder === "asc" || sOrder === "desc") {
        setOrder(sOrder);
      }
    } catch (error) {
      // Gracefully handle localStorage errors by continuing with default values
      console.warn("Failed to load runs order preference from localStorage:", error);
    }
  }, []);

  function triggerSort() {
    const newOrder: Order = order === "desc" ? "asc" : "desc";
    setOrder(newOrder);
    try {
      localStorage.setItem("runs_order", newOrder);
    } catch (error) {
      // Gracefully handle localStorage errors - state is still updated
      console.warn("Failed to save runs order preference to localStorage:", error);
    }
  }

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body1" paragraph>
          This page lists out the total runs of featured character/weapons.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button
            onClick={triggerSort}
            variant="contained"
            startIcon={<Sort />}
            fullWidth
            sx={{ maxWidth: 200 }}
          >
            Runs
          </Button>
        </Box>
      </Container>

      <Box ref={ref}>
        <Container sx={{ mt: 4 }}>
          <RunsCounterSummary
            type={type}
            order={order}
            featuredList={data.featuredList}
          />
        </Container>
      </Box>

      <Container sx={{ mt: 2, textAlign: "center" }}>
        <PngDownloadButton node={ref} name="summary" type={type} />
      </Container>
    </>
  );
}
