import React from "react";
import {Button, Container, Form, Image, Label, List, Step, Table} from "semantic-ui-react";
import Head from "next/head";

type Properties = {
    characters: any
    artifacts: any
}

type States = {
    hoverRow: number
}


export async function getStaticProps() {
    return {
        props: {
            characters: require('@/data/characters.json'),
            artifacts: require('@/data/artifacts.json'),
        },
    };
}

export default class ArtifactRotationComponent extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            hoverRow: -1
        }
    }

    componentDidMount = () => {
        // this.setState({
        //     date: new Date(),
        //     military: false,
        // })
    }

    handleHover = (key: number) => {
        return () => {
            this.setState({hoverRow: key})
        }
    }

    render() {
        return (
            <>
                <Head>
                    <title>Artifact Rotations - Samsara</title>
                </Head>
                <Container style={{marginTop: '2em'}}>
                    <Step.Group widths={3}>
                        <Step>
                            <Step.Content>
                                <Step.Title>Yesterday</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step active>
                            <Step.Content>
                                <Step.Title>Today</Step.Title>
                            </Step.Content>
                        </Step>
                        <Step disabled>
                            <Step.Content>
                                <Step.Title>Tomorrow</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                </Container>
                <Container text style={{marginTop: '2em'}} textAlign={"center"}>
                    <Form>
                        <Form.Group widths={"equal"}>
                            <Form.Field>
                                <Button content='Download Settings (JSON)' icon='download' labelPosition='left'/>
                            </Form.Field>
                            <Form.Field>
                                <Button content='Load Settings (JSON)' icon='upload' labelPosition='right'/>
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Container>
                <Container style={{marginTop: '2em'}}>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Artifacts</Table.HeaderCell>
                                <Table.HeaderCell>Teams</Table.HeaderCell>
                                <Table.HeaderCell>For Characters</Table.HeaderCell>
                                <Table.HeaderCell>Notes</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <Table.Row onMouseEnter={this.handleHover(1)}>
                                <Table.Cell verticalAlign={'top'}>
                                    1
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <List>
                                        <List.Item>
                                            <Label image>
                                                <Image src='/images/artifacts/Blizzard-Strayer.png'
                                                /> Blizzard Strayer
                                            </Label>
                                        </List.Item>
                                        <List.Item>
                                            <Label image>
                                                <Image src='/images/artifacts/Heart-of-Depth.png'
                                                /> Heart of Depth
                                            </Label>
                                        </List.Item>
                                        <List.Item>
                                            <Label basic>Peak of Vindagnyr</Label>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <List>
                                        <List.Item>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <List>
                                        <List.Item>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Collei.png'/>
                                            <Image avatar src='/images/characters/Albedo.png'/>
                                            <Image avatar src='/images/characters/Aloy.png'/>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <Container fluid style={{marginBottom: '1em'}}>
                                        Blah blah blah yes my note is this
                                    </Container>
                                </Table.Cell>
                            </Table.Row>
                            {this.state.hoverRow == 1 && (
                                <Table.Row>
                                    <Table.Cell verticalAlign={'top'} colSpan={5} textAlign={'center'}>
                                        <Form style={{marginTop: '1em'}}>
                                            <Form.Group widths='equal'>
                                                <Form.Button content='New Rotation' color={'green'} icon='add' labelPosition='left' />
                                                <Form.Button content={'Edit #'+this.state.hoverRow} icon='edit' labelPosition='left' disabled />
                                                <Form.Button content='Delete' color={'red'} icon='delete' labelPosition='left' />
                                            </Form.Group>
                                        </Form>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            <Table.Row onMouseEnter={this.handleHover(2)}>
                                <Table.Cell verticalAlign={'top'}>
                                    2
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <List>
                                        <List.Item>
                                            <Label image>
                                                <Image src='/images/artifacts/Blizzard-Strayer.png'
                                                /> Blizzard Strayer
                                            </Label>
                                        </List.Item>
                                        <List.Item>
                                            <Label image>
                                                <Image src='/images/artifacts/Heart-of-Depth.png'
                                                /> Heart of Depth
                                            </Label>
                                        </List.Item>
                                        <List.Item>
                                            <Label basic>Peak of Vindagnyr</Label>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <List>
                                        <List.Item>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <List>
                                        <List.Item>
                                            <Image avatar src='/images/characters/Amber.png'/>
                                            <Image avatar src='/images/characters/Collei.png'/>
                                            <Image avatar src='/images/characters/Albedo.png'/>
                                            <Image avatar src='/images/characters/Aloy.png'/>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <Container fluid style={{marginBottom: '1em'}}>
                                        No notes
                                    </Container>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Container>
            </>
        );
    }
}