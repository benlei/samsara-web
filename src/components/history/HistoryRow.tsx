import {
  BannerHistoryDataset,
  DetailedFeaturedHistory,
  FeaturedHistory,
} from "@/banners/types";
import React, { useEffect, useState } from "react";
import { TableRow, TableCell, Popover, Avatar } from "@mui/material";
import HistoryFeaturedPopover from "@/components/history/HistoryFeaturedPopover";
import HistoryImageCounter from "@/components/history/HistoryImageCounter";

type Properties = {
  rundown: DetailedFeaturedHistory;
  bannerType: string;
  featuredList: FeaturedHistory[];
  dataset: BannerHistoryDataset;
};

export default function HistoryRow({
  rundown,
  bannerType,
  dataset,
}: Properties): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  let versionIndex = 0;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <TableRow>
      <TableCell>
        <span onClick={handleClick} style={{ cursor: 'pointer' }}>
          <span className={"desktop"}>{rundown.name}</span>{" "}
          <Avatar
            src={`/images/${bannerType}/${rundown.image}.png`}
            alt={rundown.image}
            sx={{ 
              width: 32, 
              height: 32,
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          />
        </span>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <HistoryFeaturedPopover type={bannerType} rundown={rundown} />
        </Popover>
      </TableCell>
      <TableCell className={"hc-0"}>
        <div className={"runs"}>{rundown.runs}</div>
      </TableCell>
      {rundown.counter.map((c, cI) => (
        <TableCell key={cI} className={"hc-" + Math.max(0, Math.min(25, c))}>
          <HistoryImageCounter
            type={bannerType}
            dataset={dataset}
            rundown={rundown}
            counter={c}
            versionIndex={c === 0 ? versionIndex++ : versionIndex}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}
