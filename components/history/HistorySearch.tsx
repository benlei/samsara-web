import _ from "lodash";
import { TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import React, { ChangeEvent } from "react";

type Properties = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => any;
};

export default function HistorySearch({ onChange }: Properties) {
  return (
    <TextField
      placeholder="Filter name..."
      onChange={_.debounce(onChange, 250)}
      className="desktop"
      sx={{ minWidth: "16em" }}
      data-html2canvas-ignore
      autoComplete="off"
      size="small"
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
}