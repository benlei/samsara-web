import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  IconButton, 
  Typography 
} from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";
import Image from "next/image";
import {
  AverageCountSummary,
  getAverageBannersInBetween,
  getAverageDaysInBetween,
  getAveragePatchesInBetween,
} from "@/banners/summary";
import { Featured, VersionParts } from "@/banners/types";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Order } from "@/lotypes/sort";
import clsx from "clsx";
import { getVersionPartsFromFeaturedList } from "@/banners/version";
import { getImageFromName } from "@/format/image";

type Properties = {
  featuredList: Featured[];
  type: string;
  sortBy: string;
  order: Order;
  triggerSort: (newSort: string) => void;
};
export default function AverageCounterSummary({
  featuredList,
  type,
  sortBy,
  order,
  triggerSort,
}: Properties) {
  const versionParts = getVersionPartsFromFeaturedList(featuredList, "asc");

  let counter: (
    versionParts: VersionParts[],
    featuredList: Featured[]
  ) => AverageCountSummary[];
  const [runsOrder, setRunsOrder] = useState("desc" as Order | "none");

  if (sortBy === "patches") {
    counter = getAveragePatchesInBetween;
  } else if (sortBy === "banners") {
    counter = getAverageBannersInBetween;
  } else {
    counter = getAverageDaysInBetween;
  }

  function triggerRunsOrder() {
    if (runsOrder == "desc") {
      setRunsOrder("asc");
      localStorage.setItem("avg_runs_order", "asc");
    } else if (runsOrder == "asc") {
      setRunsOrder("none");
      localStorage.setItem("avg_runs_order", "none");
    } else {
      setRunsOrder("desc");
      localStorage.setItem("avg_runs_order", "desc");
    }
  }

  useEffect(() => {
    const sRunsOrder = localStorage.getItem("avg_runs_order");
    if (sRunsOrder == "asc" || sRunsOrder == "desc" || sRunsOrder == "none") {
      setRunsOrder(sRunsOrder);
    }
  }, [runsOrder]);

  function getRange(stat: AverageCountSummary): string {
    if (stat.standardDeviation > 0) {
      return `${_.round(stat.average - stat.standardDeviation, 1)} to ${_.round(
        stat.average + stat.standardDeviation,
        1
      )}`;
    }

    return `n/a`;
  }

  const summary = _.chain(counter(versionParts, featuredList))
    .filter((b) => b.average > 0)
    .orderBy(
      [
        (b) => (runsOrder !== "none" ? b.count : 0),
        (b) => b.average,
        (b) => b.standardDeviation,
        (b) => b.name,
      ],
      [
        runsOrder === "none" ? "desc" : (runsOrder as Order),
        order,
        order,
        order,
      ]
    )
    .value();

  const naFeatured = _.chain(featuredList)
    .filter((f) => f.versions.length <= 1)
    .orderBy((b) => b.name, "asc")
    .value();

  return (
    <TableContainer component={Paper} className={"summary-table"}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
              Featured
            </TableCell>
            <TableCell
              sx={{ cursor: 'pointer' }}
              onClick={() => triggerRunsOrder()}
            >
              <IconButton size="small">
                <SortIcon color={runsOrder === "none" ? "disabled" : "primary"} />
              </IconButton>
            </TableCell>
            <TableCell
              sx={{ cursor: 'pointer' }}
              onClick={() => triggerSort(sortBy)}
            >
              {sortBy} <SortIcon sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }} />
            </TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Range</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summary.map((s, k) => (
            <TableRow key={k}>
              <TableCell sx={{ width: "35px" }}>
                <Avatar sx={{ width: 32, height: 32, display: { xs: 'none', sm: 'block' } }}>
                  <Image
                    src={`/images/${type}/${s.image}.png`}
                    width={32}
                    height={32}
                    alt={s.image}
                  />
                </Avatar>
                <Avatar sx={{ width: 24, height: 24, display: { xs: 'block', sm: 'none' } }}>
                  <Image
                    src={`/images/${type}/${s.image}.png`}
                    width={24}
                    height={24}
                    alt={s.image}
                  />
                </Avatar>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {s.name}
                </Typography>
              </TableCell>
              <TableCell>
                {s.count} {s.discrepancy ? "+1" : ""}
              </TableCell>
              <TableCell>{s.average}</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                {getRange(s)}
              </TableCell>
            </TableRow>
          ))}

          {naFeatured.map((f, k) => (
            <TableRow key={k} sx={{ opacity: 0.6 }}>
              <TableCell sx={{ width: "35px" }}>
                <Avatar sx={{ width: 32, height: 32, display: { xs: 'none', sm: 'block' } }}>
                  <Image
                    src={`/images/${type}/${getImageFromName(f.name)}.png`}
                    width={32}
                    height={32}
                    alt={getImageFromName(f.name)}
                  />
                </Avatar>
                <Avatar sx={{ width: 24, height: 24, display: { xs: 'block', sm: 'none' } }}>
                  <Image
                    src={`/images/${type}/${getImageFromName(f.name)}.png`}
                    width={24}
                    height={24}
                    alt={getImageFromName(f.name)}
                  />
                </Avatar>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {f.name}
                </Typography>
              </TableCell>
              <TableCell>1</TableCell>
              <TableCell>n/a</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                n/a
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
