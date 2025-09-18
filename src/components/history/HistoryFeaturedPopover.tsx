import { DetailedFeaturedHistory } from "@/banners/types";
import { Card, CardContent, Typography, Chip, Avatar, Box } from "@mui/material";
import React from "react";
import { getBaseVersion } from "@/banners/version";

type Property = {
  rundown: DetailedFeaturedHistory;
  type: string;
};

export default function HistoryFeaturedPopover({ rundown, type }: Property) {
  return (
    <Card className="history-featured-popover" sx={{ minWidth: 275 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            src={`/images/${type}/${rundown.image}.png`}
            alt={rundown.image}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {rundown.name}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {rundown.versions.map((v, k) => (
                <Chip key={k} label={getBaseVersion(v)} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}