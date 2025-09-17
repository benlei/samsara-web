import { Button, Container, Typography, ButtonGroup, Box } from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";
import React, {ReactNode, useEffect, useState} from "react";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import RelativeBasicCounterSummary from "@/components/summary/stat/RelativeBasicCounterSummary";
import clsx from "clsx";

type Properties = {
    data: { featuredList: Featured[], date: string }
    title: ReactNode
    type: string
}
export default function LastRunSummaryPage(
    {
        data,
        title,
        type,
    }: Properties
) {
    const ref = React.useRef<any>()
    const [sortBy, setSortBy] = useState('days')
    const [order, setOrder] = useState('asc')

    useEffect(() => {
        const sSortBy = localStorage.getItem('last_runs_sort')
        const sOrder = localStorage.getItem('last_runs_order')

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
            localStorage.setItem('last_runs_sort', newSort)
        } else {
            setOrder(order === 'desc' ? 'asc' : 'desc')
            localStorage.setItem('last_runs_order', order === 'desc' ? 'asc' : 'desc')
        }
    }

    return (
        <>
            <Container sx={{ mt: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {title}
                </Typography>

                <Typography variant="body1" paragraph>
                    This page lists out when the featured character or weapon was last run.
                </Typography>

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
            </Container>

            <Box ref={ref}>
                <Container sx={{ mt: 4, mb: 6 }}>
                    <RelativeBasicCounterSummary
                        date={data.date}
                        type={type}
                        sortBy={sortBy}
                        order={order}
                        featuredList={data.featuredList}
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
