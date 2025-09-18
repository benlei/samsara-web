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
      sx={{ 
        minWidth: "16em",
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
          color: 'text.primary',
          '& fieldset': {
            borderColor: 'divider',
          },
          '&:hover fieldset': {
            borderColor: 'text.secondary',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
          '& input': {
            color: 'text.primary',
            userSelect: 'text !important',
            pointerEvents: 'auto',
          },
          '& input::placeholder': {
            color: 'text.disabled',
            opacity: 1,
          },
        },
        '& .MuiInputAdornment-root': {
          color: 'text.secondary',
        },
      }}
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