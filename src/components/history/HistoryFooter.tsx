import React from "react";
import { TableFooter, TableRow, TableCell } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { VersionParts } from "@/banners/types";

type Properties = {
  versionParts: VersionParts[];
};

export default function HistoryFooter({ versionParts }: Properties) {
  return (
    <TableFooter>
      <TableRow>
        <TableCell className="borderless" />
        <TableCell>
          <Refresh />
        </TableCell>
        {versionParts.map((vp, idx) => (
          <TableCell colSpan={vp.parts} key={idx}>
            {vp.version}
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );
}