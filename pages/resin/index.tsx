import React from "react";
import {Container, Form, Image, Radio, Table} from "semantic-ui-react";

type Properties = {}
type States = {
    date: Date
    military: boolean
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

export default class ResinPageComponent extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            date: new Date(),
            military: false,
        }
    }

    componentDidMount = () => {
        this.setState({
            date: new Date(),
            military: false,
        })

        setInterval(() => this.setState({date: new Date()}), 5000)
    }

    flipMilitary = () => {
        this.setState({
            military: !this.state.military
        })
    }

    render() {
        const resin: Resin[] = []
        const now = this.state.date
        for (let i = 0; i <= MAX_RESIN; i++) {
            resin.push({
                count: i,
                date: new Date(now.getTime() + (RESIN_INC_TIME_DIFF * i)),
            })
        }

        return (
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
                            <Table.HeaderCell><Image avatar src={'/images/Resin.png'} alt={'Resin'}/></Table.HeaderCell>
                            <Table.HeaderCell>Today/Tomorrow</Table.HeaderCell>
                            <Table.HeaderCell>Time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {resin.map((r, key) =>
                            <Table.Row key={key}>
                                <Table.Cell>{r.count}</Table.Cell>
                                <Table.Cell>{getTodayTomorrow(now, r.date)}</Table.Cell>
                                <Table.Cell>{this.state.military ? getHumanReadable24HourTime(now, r.date) : getHumanReadable12HourTime(now, r.date)}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Container>
        );
    }
}