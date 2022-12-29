import React from "react";
import {Container, Form, Image, Label, List, Table} from "semantic-ui-react";
import Head from "next/head";
import ArtifactStepComponent from "@/components/artifacts/ArtifactStep";
import ArtifactConfigLoadDownloadComponent from "@/components/artifacts/ArtifactConfigLoadDownload";
import AddArtifactRotationComponent from "@/components/artifacts/AddArtifactRotation";
import {getArtifacts} from "@/artifacts/artifacts";

type Properties = {
    characters: any
    artifacts: any
}

type States = {
    hoverRow: number
    rotations: Rotations
}

type Rotations = {
    fixed: boolean // fixed # of days between all rotations, or no
    fixedDays: number
    data: Rotation[]
}

type Rotation = {
    domain: string,
    teams: string[][]
    characters: string[]
    days?: number
    note: string
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
            hoverRow: -1,
            rotations: {fixed: true, fixedDays: 3, data: []},
        }
    }

    componentDidMount = () => {
        // this.setState({
        //     date: new Date(),
        //     military: false,
        // })

        this.setState({
            rotations: {
                ...this.state.rotations,
                ...JSON.parse(localStorage.getItem("rotations") || "{}"),
            }
        })
    }

    handleHover = (key: number) => {
        return () => {
            this.setState({hoverRow: key})
        }
    }

    clearHover = () => {
        this.setState({hoverRow: -1})
    }

    render() {
        return (
            <>
                <Head>
                    <title>Artifact Rotations - Samsara</title>
                </Head>
                <ArtifactStepComponent/>
                <ArtifactConfigLoadDownloadComponent/>

                <Container style={{marginTop: '2em'}}>
                    <Table unstackable onMouseLeave={this.clearHover}>
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
                            {this.state.rotations.data.length ? <>

                            </> : <>
                                {/*<AddArtifactRotationComponent editable={false} deletable={false} index={0}*/}
                                {/*    artifacts={getArtifacts(this.props.artifacts)}*/}
                                {/*/>*/}
                            </>
                            }
                            <Table.Row onMouseEnter={this.handleHover(99)}>
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
                            {this.state.hoverRow == 99 && (
                                <Table.Row>
                                    <Table.Cell verticalAlign={'top'} colSpan={5} textAlign={'center'}>
                                        <Form style={{marginTop: '1em'}}>
                                            <Form.Group widths='equal'>
                                                <Form.Button content='New Rotation' color={'green'} icon='add'
                                                             labelPosition='left'/>
                                                <Form.Button content={'Edit #' + this.state.hoverRow} icon='edit'
                                                             labelPosition='left' disabled/>
                                                <Form.Button content='Delete' color={'red'} icon='delete'
                                                             labelPosition='left'/>
                                            </Form.Group>
                                        </Form>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                            <Table.Row onMouseEnter={this.handleHover(999)}>
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
                            {this.state.hoverRow == 999 && (
                                <Table.Row>
                                    <Table.Cell verticalAlign={'top'} colSpan={5} textAlign={'center'}>
                                        <Form style={{marginTop: '1em'}}>
                                            <Form.Group widths='equal'>
                                                <Form.Button content='New Rotation' color={'green'} icon='add'
                                                             labelPosition='left'/>
                                                <Form.Button content={'Edit #' + this.state.hoverRow} icon='edit'
                                                             labelPosition='left' disabled/>
                                                <Form.Button content='Delete' color={'red'} icon='delete'
                                                             labelPosition='left'/>
                                            </Form.Group>
                                        </Form>
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