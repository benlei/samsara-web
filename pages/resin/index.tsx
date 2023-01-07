import React from "react";
import {Container, Form, Image, Radio, Table} from "semantic-ui-react";
import Head from "next/head";
import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";

type Properties = {}
type States = {
    date: string
    military: boolean
    intervalId: any
    utc: boolean
}

type Resin = {
    count: number
    date: Dayjs
}

const MAX_RESIN = 180

export default class ResinHome extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        dayjs.extend(utc);

        this.state = {
            date: dayjs.utc().toISOString(),
            utc: true,
            military: false,
            intervalId: 0,
        }
    }

    getDate = (date: string = this.state.date): Dayjs => {
        if (this.state.utc) {
            dayjs.extend(utc);
            return dayjs.utc(date)
        }

        return dayjs(date)
    }
    getTodayTomorrow = (date: Dayjs): string => {
        return this.getDate().isSame(date, 'date') ? 'Today' : 'Tomorrow'
    }

    componentDidMount = () => {
        this.setState({
            date: this.getDate(dayjs().toISOString()).toISOString(),
            military: false,
            utc: false,
            intervalId: setInterval(() => this.setState({
                date: this.getDate(dayjs().toISOString()).toISOString()
            }), 5000),
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
        const now = this.getDate()
        for (let i = 0; i <= MAX_RESIN; i++) {
            result.push({
                count: i,
                date: now.add(8 * i, 'minutes'),
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
                                    <Table.Cell>{this.getTodayTomorrow(r.date)}</Table.Cell>
                                    <Table.Cell>
                                        {this.state.military ? (
                                            r.date.format('HH:mm')
                                        ) : (
                                            r.date.format('hh:mm A')
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </Container>
            </>
        );
    }
}