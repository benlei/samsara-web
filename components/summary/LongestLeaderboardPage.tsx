import { Button, Container, Typography, ButtonGroup, Box } from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";
import React, {ReactNode, useEffect, useState} from "react";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import LeaderboardCounterSummary from "@/components/summary/stat/LeaderboardCounterSummary";
import {getLongestStatsInBetween} from "@/banners/summary";
import clsx from "clsx";
import {Order} from "@/lotypes/sort";

type Properties = {
    data: { featuredList: Featured[], date: string }
    title: ReactNode
    type: string
}
export default function LongestLeaderboardPage(
    {
        data,
        title,
        type,
    }: Properties
) {
    const ref = React.useRef<any>()
    const [sortBy, setSortBy] = useState('days')
    const [order, setOrder] = useState('desc' as Order)

    useEffect(() => {
        const sSortBy = localStorage.getItem('long_sort')
        const sOrder = localStorage.getItem('long_order')

        if (sSortBy == 'days' || sSortBy == 'banners' || sSortBy == 'patches') {
            setSortBy(sSortBy)
        }

        if (sOrder == 'asc' || sOrder == 'desc') {
            setOrder(sOrder)
        }
    }, [sortBy, order])

    function triggerSort(newSort: string) {
        if (sortBy != newSort) {
            setSortBy(newSort)
            localStorage.setItem('long_sort', newSort)
        } else {
            setOrder(order === 'desc' ? 'asc' : 'desc')
            localStorage.setItem('long_order', order === 'desc' ? 'asc' : 'desc')
        }
    }

    return (
        <>
            <Container sx={{ mt: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {title}
                </Typography>

                <Typography variant="body1" paragraph>
                    This page shows the longest leaderboard for how long a character/weapon has waited for
                    a rerun, including from when they last run until now.
                </Typography>

                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <ButtonGroup variant="contained" fullWidth>
                        <Button 
                            variant={sortBy === 'days' ? 'contained' : 'outlined'}
                            onClick={() => triggerSort('days')}
                        >
                            Days {sortBy === 'days' && <SortIcon sx={{ ml: 1 }} />}
                        </Button>
                        <Button 
                            variant={sortBy === 'banners' ? 'contained' : 'outlined'}
                            onClick={() => triggerSort('banners')}
                        >
                            Banners {sortBy === 'banners' && <SortIcon sx={{ ml: 1 }} />}
                        </Button>
                        <Button 
                            variant={sortBy === 'patches' ? 'contained' : 'outlined'}
                            onClick={() => triggerSort('patches')}
                        >
                            Patches {sortBy === 'patches' && <SortIcon sx={{ ml: 1 }} />}
                        </Button>
                    </ButtonGroup>
                </Box>
            </Container>

            <Box ref={ref}>
                <Container sx={{ mt: 4, mb: 6 }}>
                    <LeaderboardCounterSummary
                        featuredList={data.featuredList}
                        type={type}
                        date={data.date}
                        triggerSort={triggerSort}
                        sortBy={sortBy}
                        order={order}
                        counter={getLongestStatsInBetween}
                    />
                </Container>
            </Box>

            <Container sx={{ mt: 2, textAlign: 'center' }}>
                <PngDownloadButton node={ref} name={'summary'}
                                   type={type}
                />
            </Container>
        </>
    )
}
