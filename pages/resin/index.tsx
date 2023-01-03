import React from "react";
import {Container, Form, Image, Radio, Table} from "semantic-ui-react";
import Head from "next/head";

type Properties = {}
type States = {
    date: number
    military: boolean
    intervalId: any
}

type Resin = {
    count: number
    date: Date
}

const MAX_RESIN = 180
const RESIN_INC_TIME_DIFF = 1000 * 60 * 8


function getTodayTomorrow(now: Date, date: Date): string {
    return now.getDate() == date.getDate() ? 'Today' : 'Tomorrow'
}

function getHumanReadable12HourTime(now: Date, date: Date): string {
    let hours = '12'
    if (date.getHours() % 12 !== 0) {
        hours = String(date.getHours() % 12)
        if (date.getHours() % 12 < 10) {
            hours = '0' + (date.getHours() % 12)
        }
    }

    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : String(date.getMinutes())
    let ampm = date.getHours() < 12 ? 'AM' : 'PM'

    return `${hours}:${minutes} ${ampm}`
}

function getHumanReadable24HourTime(now: Date, date: Date): string {
    let hours = date.getHours() < 10 ? '0' + date.getHours() : String(date.getHours())
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : String(date.getMinutes())

    return `${hours}:${minutes}`
}

function getTime(): number {
    return Math.floor(Date.now() / 1000) * 1000
}

export default class ResinHome extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            date: 0,
            military: false,
            intervalId: 0,
        }
    }

    componentDidMount = () => {
        this.setState({
            date: getTime(),
            military: false,
            intervalId: setInterval(() => this.setState({date: getTime()}), 5000),
        })
    }


    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }

    flipMilitary = () => {
        this.setState({
            military: !this.state.military
        })
    }

    getResinList = () => {
        const result: Resin[] = []
        const now = new Date(this.state.date)
        for (let i = 0; i <= MAX_RESIN; i++) {
            result.push({
                count: i,
                date: new Date(now.getTime() + (RESIN_INC_TIME_DIFF * i)),
            })
        }

        return result
    }

    render() {
        return (
            <>
                <Head>
                    <title>24H Resin Timer - Samsara</title>
                </Head>
                <Container text style={{marginTop: '2em'}} textAlign={"center"}>
                    {this.state.date &&
                        <>
                            <Form>
                                <Form.Field>
                                    <Radio toggle label='24 Hour Time'
                                           onChange={this.flipMilitary}
                                           checked={this.state.military}
                                    />
                                </Form.Field>
                            </Form>
                            <Table compact celled selectable textAlign={'center'} size={'small'}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell><Image avatar src={'/images/Resin.png'}
                                                                 alt={'Resin'}/></Table.HeaderCell>
                                        <Table.HeaderCell>Today/Tomorrow</Table.HeaderCell>
                                        <Table.HeaderCell>Time</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.getResinList().map((r, key) =>
                                        <Table.Row key={key}>
                                            <Table.Cell>{r.count}</Table.Cell>
                                            <Table.Cell>{getTodayTomorrow(new Date(this.state.date), r.date)}</Table.Cell>
                                            <Table.Cell>
                                                {this.state.military ? (
                                                    getHumanReadable24HourTime(new Date(this.state.date), r.date)
                                                ) : (
                                                    getHumanReadable12HourTime(new Date(this.state.date), r.date)
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                        </>
                    }
                </Container>
            </>
        );
    }
}