import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import Image from "next/image";
import {
  CountSummary,
  getBannersSinceLastCountSummary,
  getDaysSinceRunCountSummary,
  getPatchesSinceLastCountSummary,
  UnknownFutureCounter,
} from "@/banners/summary";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Featured, VersionParts } from "@/banners/types";
import { chunk } from "@/banners/summaryUtils";
import { Order } from "@/lotypes/sort";
import { getVersionPartsFromFeaturedList } from "@/banners/version";
import dayjs from "dayjs";

type Properties = {
  date: string;
  featuredList: Featured[];
  type: string;
  sortBy: string;
  order: string;
};

function getRelativeTimeText(
  s: CountSummary,
  singular: string,
  plural: string
): string {
  if (s.count == UnknownFutureCounter) {
    return "upcoming";
  }

  if (!s.count) {
    return "in progress";
  }

  if (s.count < 0) {
    return `${Math.abs(s.count)} more ` + (s.count === -1 ? singular : plural);
  }

  return `${s.count} ` + (s.count === 1 ? singular : plural) + " ago";
}

export default function RelativeBasicCounterSummary({
  featuredList,
  type,
  sortBy,
  order,
  date,
}: Properties) {
  const [now, setNow] = useState(date);
  useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now]);

  let singular: string;
  let plural: string;
  let counter: (
    versionParts: VersionParts[],
    featuredList: Featured[],
    currDate: string
  ) => CountSummary[];

  if (sortBy === "patches") {
    [singular, plural, counter] = [
      "patch",
      "patches",
      getPatchesSinceLastCountSummary,
    ];
  } else if (sortBy === "banners") {
    [singular, plural, counter] = [
      "banner",
      "banners",
      getBannersSinceLastCountSummary,
    ];
  } else {
    [singular, plural, counter] = ["day", "days", getDaysSinceRunCountSummary];
  }

  const chunkedSummary = chunk(
    _.chain(
      counter(
        getVersionPartsFromFeaturedList(featuredList, "asc"),
        featuredList,
        now
      )
    )
      .orderBy([(b) => b.count, (b) => b.name], [order, order] as Order[])
      .value(),
    (s) => s.count
  );

  return (
    <Box className={"summary relative-row"} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {chunkedSummary.map((summary, j) => (
        <Box key={j} sx={{ minWidth: 300, flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3">
                {getRelativeTimeText(summary[0], singular, plural)}
              </Typography>
            </CardContent>
            <CardContent>
              <Box>
                {summary.map((s, k) => (
                  <Box key={k} sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: 40 }}>
                    <Avatar sx={{ mr: 2, width: 32, height: 32, flexShrink: 0 }}>
                      <Image
                        src={`/images/${type}/${s.image}.png`}
                        width={32}
                        height={32}
                        alt={s.image}
                        style={{ objectFit: 'cover' }}
                      />
                    </Avatar>
                    <Typography variant="body2" sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
                      {s.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
}
