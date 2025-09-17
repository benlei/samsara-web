import { Button, Container, Typography, ButtonGroup, Box } from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";
import React, {ReactNode, useEffect, useState} from "react";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import AverageCounterSummary from "@/components/summary/stat/AverageCounterSummary";
import clsx from "clsx";
import {Order} from "@/lotypes/sort";

type Properties = {
    data: { featuredList: Featured[] }
    title: ReactNode
    type: string
}
export default function AverageRunSummaryPage(
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
        const sSortBy = localStorage.getItem('avg_sort')
        const sOrder = localStorage.getItem('avg_order')

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
            localStorage.setItem('avg_sort', newSort)
        } else {
            setOrder(order === 'desc' ? 'asc' : 'desc')
            localStorage.setItem('avg_order', order === 'desc' ? 'asc' : 'desc')
        }

    }

    return (
        <>
            <Container sx={{ mt: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {title}
                </Typography>

                <Typography variant="body1" paragraph>
                    This page shows the average wait time between a featured character or weapon{"'"}s banner runs.
                    It first sorts by the run count, then the day/banner/patch. The fewer number of runs the
                    character/weapon has, the less reliable the day/banner/patch rerun average range will be. That
                    being said, miHoYo{"'"}s methodology for reruns might really just be random.
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
                    <AverageCounterSummary
                        type={type}
                        featuredList={data.featuredList}
                        triggerSort={triggerSort}
                        sortBy={sortBy}
                        order={order}
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
