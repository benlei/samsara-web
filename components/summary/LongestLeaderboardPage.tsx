import {Container, Header, List, Ref} from "semantic-ui-react";
import React, {ReactNode} from "react";
import PngDownloadButton from "@/components/PngDownloadButton";
import {Featured} from "@/banners/types";
import LeaderboardCounterSummary from "@/components/summary/stat/LeaderboardCounterSummary";
import {getLongestStatsInBetween} from "@/banners/summary";

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

    return (
        <>
            <Container style={{marginTop: '2em'}}>
                <Header size={'large'} as={'h1'}>{title}</Header>

                <p>
                    This page shows the longest leaderboard for how long a character/weapon has waited for
                    a rerun, including from when they last run until now.
                </p>

                <p className={'mobile'} style={{display: 'none'}}>
                    The columns titled {`"D", "B", and "P"`} means the following:
                </p>
                <List className={'mobile'} style={{display: 'none'}} bulleted>
                    <List.Item>{`"D" stands for "Days"`}.</List.Item>
                    <List.Item>{`"B" stands for "Banners"`}.</List.Item>
                    <List.Item>{`"P" stands for "Patches"`}.</List.Item>
                </List>
            </Container>

            <Ref innerRef={ref}>
                <Container style={{marginTop: '2em'}}>
                    <LeaderboardCounterSummary
                        featuredList={data.featuredList}
                        type={type}
                        date={data.date}
                        counter={getLongestStatsInBetween}
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
