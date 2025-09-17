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
import {LeaderboardSummary} from "@/banners/summary";
import _ from "lodash";
import React, {useEffect, useState} from "react";
import {Featured, VersionParts} from "@/banners/types";
import {getVersionPartsFromFeaturedList} from "@/banners/version";
import {Order} from "@/lotypes/sort";
import clsx from "clsx";
import dayjs from "dayjs";
import {getImageFromName} from "@/format/image";

type Properties = {
    featuredList: Featured[]
    type: string
    date: string
    order: Order
    sortBy: string
    triggerSort: (newSort: string) => void
    counter: (versionParts: VersionParts[], featuredList: Featured[], date: string) => LeaderboardSummary[]
}

export default function LeaderboardCounterSummary(
    {
        featuredList,
        type,
        counter,
        date,
        sortBy,
        order,
        triggerSort,
    }: Properties
) {
    const [now, setNow] = useState(date as string)
    const summary = _.chain(counter(getVersionPartsFromFeaturedList(featuredList, 'asc'), featuredList, now))
        .orderBy([
            (b) => sortBy === 'patches' ? b.patches : (sortBy === 'banners' ? b.banners : b.days),
            (b) => b.days,
            (b) => b.name,
        ], [order, order, order])
        .value()

    useEffect(() => setNow(dayjs.utc().toISOString().substring(0, 10)), [now])

    const shown = _.chain(summary)
        .map((s) => s.name)
        .value()

    const naList = _.chain(featuredList)
        .filter((f) => !_.includes(shown, f.name))
        .orderBy((b) => b.name, 'asc')
        .value()

    return (
        <TableContainer component={Paper} className={'summary-table'}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Featured</TableCell>
                        <TableCell
                            sx={{ 
                                cursor: 'pointer',
                                display: sortBy !== 'days' ? { xs: 'none', sm: 'table-cell' } : 'table-cell'
                            }}
                            onClick={() => triggerSort('days')}
                        >
                            Days {sortBy === 'days' && <SortIcon sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }} />}
                        </TableCell>
                        <TableCell
                            sx={{ 
                                cursor: 'pointer',
                                display: sortBy !== 'banners' ? { xs: 'none', sm: 'table-cell' } : 'table-cell'
                            }}
                            onClick={() => triggerSort('banners')}
                        >
                            Banners {sortBy === 'banners' && <SortIcon sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }} />}
                        </TableCell>
                        <TableCell
                            sx={{ 
                                cursor: 'pointer',
                                display: sortBy !== 'patches' ? { xs: 'none', sm: 'table-cell' } : 'table-cell'
                            }}
                            onClick={() => triggerSort('patches')}
                        >
                            Patches {sortBy === 'patches' && <SortIcon sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }} />}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {summary.map((s, k) =>
                        <TableRow key={k}>
                            <TableCell sx={{ width: '35px' }}>
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
                                <Typography variant="body2" fontWeight="medium">{s.name}</Typography>
                            </TableCell>
                            <TableCell sx={{ display: sortBy !== 'days' ? { xs: 'none', sm: 'table-cell' } : 'table-cell' }}>
                                {s.days}
                            </TableCell>
                            <TableCell sx={{ display: sortBy !== 'banners' ? { xs: 'none', sm: 'table-cell' } : 'table-cell' }}>
                                {s.banners}
                            </TableCell>
                            <TableCell sx={{ display: sortBy !== 'patches' ? { xs: 'none', sm: 'table-cell' } : 'table-cell' }}>
                                {s.patches}
                            </TableCell>
                        </TableRow>
                    )}

                    {naList.map((f, k) =>
                        <TableRow key={k} sx={{ opacity: 0.6 }}>
                            <TableCell sx={{ width: '35px' }}>
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
                                <Typography variant="body2" fontWeight="medium">{f.name}</Typography>
                            </TableCell>
                            <TableCell sx={{ display: sortBy !== 'days' ? { xs: 'none', sm: 'table-cell' } : 'table-cell' }}>
                                n/a
                            </TableCell>
                            <TableCell sx={{ display: sortBy !== 'banners' ? { xs: 'none', sm: 'table-cell' } : 'table-cell' }}>
                                n/a
                            </TableCell>
                            <TableCell sx={{ display: sortBy !== 'patches' ? { xs: 'none', sm: 'table-cell' } : 'table-cell' }}>
                                n/a
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}