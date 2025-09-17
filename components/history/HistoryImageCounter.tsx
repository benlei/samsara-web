import { BannerHistoryDataset, DetailedFeaturedHistory, FeaturedHistory, PopoverFeaturedHistory } from "@/banners/types";
import React, { useContext, useState } from "react";
import { Avatar, Box, Popover, Typography, Grid, Container } from "@mui/material";
import { getBaseVersion, getVersionPart } from "@/banners/version";
import _ from "lodash";
import { getImageFromName } from "@/format/image";
import { chunk } from "@/banners/summaryUtils";
import clsx from "clsx";
import { TypeContext } from "../context";
import Image from "next/image";

type Properties = {
  type: string;
  dataset: BannerHistoryDataset;
  rundown: DetailedFeaturedHistory;
  counter: number;
  versionIndex: number;
};

export default function HistoryImageCounter({
  type,
  dataset,
  rundown,
  counter,
  versionIndex,
}: Properties): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (counter === -1) {
    return <div></div>;
  }

  if (counter !== 0) {
    return <div>{counter}</div>;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // When counter is 0, show the character image with clickable popover
  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '32px'
      }}>
        <Avatar
          src={`/images/${type}/${rundown.image}.png`}
          alt={rundown.image}
          onClick={handleClick}
          sx={{ 
            width: 24, 
            height: 24,
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        />
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            maxWidth: 600,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
      >
        <VersionPopover
          dataset={dataset}
          rundown={rundown}
          type={type}
          version={rundown.versions[rundown.versions.length - versionIndex - 1]}
        />
      </Popover>
    </>
  );
}

type PopoverProperties = {
  version: string;
  type: string;
  dataset: BannerHistoryDataset;
  rundown: DetailedFeaturedHistory;
};

function VersionPopover({
  version,
  type,
  dataset,
  rundown,
}: PopoverProperties): React.ReactElement {
  function getSameVersion(history: FeaturedHistory[], stars: number): PopoverFeaturedHistory[] {
    return _.chain(history)
      .filter((h) => _.includes(
        h.versions.map((v) => getBaseVersion(v)),
        getBaseVersion(version)
      ))
      .map((h) => {
        return {
          stars,
          image: getImageFromName(h.name),
          name: h.name,
          version: _.chain(h.versions)
            .filter((v) => getBaseVersion(v) === getBaseVersion(version))
            .first()
            .value(),
        };
      })
      .value();
  }

  const featuredCharacters = chunk(
    _.chain([
      ...getSameVersion(dataset.fiveStarCharacters, 5),
      ...getSameVersion(dataset.fourStarCharacters, 4),
    ])
      .orderBy([
        (h) => h.version,
        (h) => h.stars,
        (h) => h.name,
      ], ['asc', 'desc', 'asc'])
      .value(),
    (f) => f.version,
  );

  const featuredWeapons = chunk(
    _.chain([
      ...getSameVersion(dataset.fiveStarWeapons, 5),
      ...getSameVersion(dataset.fourStarWeapons, 4),
    ])
      .orderBy([
        (h) => h.version,
        (h) => h.stars,
        (h) => h.name,
      ], ['asc', 'desc', 'asc'])
      .value(),
    (f) => f.version,
  );

  const {
    charactersText,
    characterType,
    weaponsText,
    weaponType
  } = useContext(TypeContext);

  return (
    <Container sx={{ p: 2, maxWidth: 600 }}>
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', maxHeight: 350 }}>
        <Box sx={{ flex: 1 }}>
          {featuredCharacters.map((fc, k) => (
            <Box key={k} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontSize: '0.9rem' }}>
                {getBaseVersion(fc[0].version)} {charactersText} ({getVersionPart(fc[0].version)})
              </Typography>
              {fc.map((f, l) => (
                <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Avatar
                    src={`/images/${characterType}/${f.image}.png`}
                    alt={f.image}
                    sx={{ 
                      width: 24, 
                      height: 24,
                      border: f.stars === 5 ? '2px solid #ffa726' : '2px solid #ab47bc'
                    }}
                  />
                  <Typography variant="body2">{f.name}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        <Box sx={{ flex: 1 }}>
          {featuredWeapons.map((fc, k) => (
            <Box key={k} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontSize: '0.9rem' }}>
                {getBaseVersion(fc[0].version)} {weaponsText} ({getVersionPart(fc[0].version)})
              </Typography>
              {fc.map((f, l) => (
                <Box key={l} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Avatar
                    src={`/images/${weaponType}/${f.image}.png`}
                    alt={f.image}
                    sx={{ 
                      width: 24, 
                      height: 24,
                      border: f.stars === 5 ? '2px solid #ffa726' : '2px solid #ab47bc'
                    }}
                  />
                  <Typography variant="body2">{f.name}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
