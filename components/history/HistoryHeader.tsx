import React, { ChangeEvent } from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { VersionParts } from "@/banners/types";
import HistorySearch from "./HistorySearch";

type Properties = {
  versionParts: VersionParts[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function HistoryHeader({ onChange, versionParts }: Properties) {
  return (
    <TableHead>
      <TableRow>
        <TableCell
          className="borderless"
          sx={{ 
            pointerEvents: "auto", 
            padding: "0 .5em",
            '& input': {
              userSelect: 'text !important',
              pointerEvents: 'auto',
            }
          }}
        >
          <HistorySearch onChange={onChange} />
        </TableCell>
        <TableCell>
          <Refresh />
        </TableCell>
        {versionParts.map(function (vp, idx) {
          return (
            <TableCell colSpan={vp.parts} key={idx}>
              {vp.version}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
