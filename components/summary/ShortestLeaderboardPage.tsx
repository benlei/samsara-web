import {Button, Container, Header, Icon, List, Ref} from "semantic-ui-react";
import React, {ReactNode, useState} from "react";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import LeaderboardCounterSummary from "@/components/summary/stat/LeaderboardCounterSummary";
import {getShortestStatsInBetween} from "@/banners/summary";
import {Order} from "@/lotypes/sort";
import clsx from "clsx";

type Properties = {
    data: { featuredList: Featured[], date: string }
    title: ReactNode
    type: string
}
export default function ShortestLeaderboardPage(
    {
        data,
        title,
        type,
    }: Properties
) {
    function triggerSort(newSort: string) {
        if (sortBy != newSort) {
            setSortBy(newSort)
        } else {
            setOrder(order == 'asc' ? 'desc' : 'asc')
        }
    }

    const ref = React.useRef<any>()
    const [sortBy, setSortBy] = useState('days')
    const [order, setOrder] = useState('asc' as Order)

    return (
        <>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'} as={'h1'}>{title}</Header>

                <p>
                    This page shows the shortest leaderboard for how long a character/weapon has waited for
                    a rerun, including from when they last run until now.
                </p>

                <Button.Group widths='3' className={'mobile'} style={{display: 'none'}}>
                    <Button active={sortBy == 'days'} onClick={() => triggerSort('days')}>
                        Days <Icon name={'sort'} className={clsx({hidden: sortBy != 'days'})}/>
                    </Button>
                    <Button active={sortBy == 'banners'} onClick={() => triggerSort('banners')}>
                        Banners <Icon name={'sort'} className={clsx({hidden: sortBy != 'banners'})}/>
                    </Button>
                    <Button active={sortBy == 'patches'} onClick={() => triggerSort('patches')}>
                        Patches <Icon name={'sort'} className={clsx({hidden: sortBy != 'patches'})}/>
                    </Button>
                </Button.Group>
            </Container>

            <Ref innerRef={ref}>
                <Container style={{marginTop: '2em'}}>
                    <LeaderboardCounterSummary
                        featuredList={data.featuredList}
                        type={type}
                        date={data.date}
                        sortBy={sortBy}
                        order={order}
                        triggerSort={triggerSort}
                        counter={getShortestStatsInBetween}
                    />
                </Container>
            </Ref>

            <Container style={{marginTop: '1em'}} textAlign={"center"}>
                <PngDownloadButton node={ref} name={'summary'}
                                   type={type}
                />
            </Container>
        </>
    )
}
