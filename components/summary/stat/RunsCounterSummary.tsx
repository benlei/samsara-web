import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { getRunsCountSummary } from "@/banners/summary";
import _ from "lodash";
import React from "react";
import { Featured } from "@/banners/types";
import { chunk } from "@/banners/summaryUtils";
import { Order } from "@/lotypes/sort";
import { getVersionPartsFromFeaturedList } from "@/banners/version";
import Image from "next/image";

type Properties = {
    featuredList: Featured[]
    type: string
    order: Order
}

export default function RunsCounterSummary(
    {
        featuredList,
        type,
        order,
    }: Properties
) {
    const chunkedSummary = chunk(
        _.chain(getRunsCountSummary(getVersionPartsFromFeaturedList(featuredList, 'asc'), featuredList))
            .orderBy([
                (b) => b.count,
                (b) => b.name,
            ], [order, order])
            .value(),
        (s) => s.count,
    )

    return (
        <Box className={'summary relative-row'} sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {chunkedSummary.map((summary, j) =>
                <Box key={j} sx={{ minWidth: 300, flex: '1 1 300px' }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="h3">
                                {summary[0].count} Run{summary[0].count !== 1 && 's'}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Box>
                                {summary.map((s, k) =>
                                    <Box key={k} sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: 40 }}>
                                        <Avatar sx={{ mr: 2, width: 32, height: 32, flexShrink: 0 }}>
                                            <Image
                                                src={`/images/${type}/${s.image}.png`}
                                                width={32}
                                                height={32}
                                                alt={s.image}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </Avatar>
                                        <Typography variant="body2" sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
                                            {s.name}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    )
}