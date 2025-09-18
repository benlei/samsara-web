import React from "react";
import { ButtonGroup, Button, Box } from "@mui/material";
import { Sort } from "@mui/icons-material";
import { BannerFilterSortOptions, BannerOptionSetters } from "@/banners/types";

type Properties = BannerFilterSortOptions & BannerOptionSetters;

export default function HistoryOptions(props: Properties) {
  const triggerSort = (newSort: string) => {
    if (newSort !== props.sortBy) {
      props.setSortBy(newSort);
    } else {
      props.setOrder(props.order === "desc" ? "asc" : "desc");
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <ButtonGroup variant="outlined" fullWidth>
        <Button
          onClick={() => triggerSort("last")}
          variant={props.sortBy === "last" ? "contained" : "outlined"}
          startIcon={props.sortBy === "last" ? <Sort /> : undefined}
        >
          Latest
        </Button>
        <Button
          onClick={() => triggerSort("first")}
          variant={props.sortBy === "first" ? "contained" : "outlined"}
          startIcon={props.sortBy === "first" ? <Sort /> : undefined}
        >
          Oldest
        </Button>
        <Button
          onClick={() => triggerSort("runs-last")}
          variant={props.sortBy === "runs-last" ? "contained" : "outlined"}
          startIcon={props.sortBy === "runs-last" ? <Sort /> : undefined}
        >
          Total Runs
        </Button>
      </ButtonGroup>
    </Box>
  );
}