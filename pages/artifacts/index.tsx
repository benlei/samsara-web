import React from "react";
import {Accordion, AccordionTitleProps, Container, Icon, Image, List, Table} from "semantic-ui-react";
import Head from "next/head";
import ArtifactConfigLoadDownload from "@/components/artifacts/ArtifactConfigLoadDownload";
import {ArtifactRotationData, ArtifactsDomainsData, Rotation, Rotations, RotationsManager} from "@/artifacts/types";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";
import {getCharacters} from "@/characters/characters";
import ArtifactDomain from "@/components/artifacts/ArtifactDomain";
import AddEditRotation from "@/components/artifacts/AddEditRotation";

type Properties = {
    characters: string[]
    artifacts: ArtifactsDomainsData
}

type States = {
    activeIndex: number
} & Rotations

export async function getStaticProps() {
    return {
        props: {
            characters: require('@/data/characters.json'),
            artifacts: require('@/data/artifacts.json'),
        },
    };
}

export default class ArtifactsHome extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            activeIndex: -1,
            fixed: true,
            fixedDays: 3,
            date: '2023-01-01',
            data: [],
        }
    }

    componentDidMount = () => {
        // this.setState({
        //     date: new Date(),
        //     military: false,
        // })

        this.setState({
            ...JSON.parse(localStorage.getItem("artifactRotationData") || "{}"),
        })
    }

    handleClick = (event: any, titleProps: AccordionTitleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({activeIndex: newIndex as number})
    }

    insertRotation = (index: number, rotation: Rotation) => {
        this.setState({
            data: [
                ...this.state.data.slice(0, index),
                rotation,
                ...this.state.data.slice(index),
            ]
        })
    }

    // literally exactly same thing
    setRotation = (index: number, rotation: Rotation) => {
        this.setState({
            data: [
                ...this.state.data.slice(0, index),
                rotation,
                ...this.state.data.slice(index + 1),
            ]
        })
    }

    moveRotation = (index: number, newIndex: number) => {
        if (newIndex >= this.state.data.length || newIndex < 0) {
            return
        }

        if (index < newIndex) {
            this.setState({
                data: [
                    ...this.state.data.slice(0, index),
                    ...this.state.data.slice(index + 1, newIndex),
                    this.state.data[index],
                    ...this.state.data.slice(newIndex),
                ]
            })
        } else {
            this.setState({
                data: [
                    ...this.state.data.slice(0, newIndex),
                    this.state.data[index],
                    ...this.state.data.slice(newIndex, index),
                    ...this.state.data.slice(index + 1),
                ]
            })
        }
    }
    deleteRotation = (index: number) => {
        this.setState({
            data: [
                ...this.state.data.slice(0, index),
                ...this.state.data.slice(index + 1),
            ]
        })
    }


    render() {
        const data: ArtifactRotationData = {
            "artifacts": getArtifacts(this.props.artifacts),
            "artifactDomains": getArtifactDomains(this.props.artifacts),
            "characters": getCharacters(this.props.characters),
            "rotations": {
                "fixed": this.state.fixed,
                "fixedDays": this.state.fixedDays,
                "date": this.state.date,
                "data": this.state.data,
            },
        }

        const manager: RotationsManager = {
            insert: this.insertRotation,
            move: this.moveRotation,
            delete: this.deleteRotation,
            set: this.setRotation,
        }

        return (
            <>
                <Head>
                    <title>Artifact Rotations - Samsara</title>
                </Head>
                {/*<ArtifactStepComponent/>*/}
                <ArtifactConfigLoadDownload/>

                <Container style={{marginTop: '2em'}} className={'artifact-rotations'}>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell style={{width: '3em'}}>#</Table.HeaderCell>
                                <Table.HeaderCell>Artifacts</Table.HeaderCell>
                                <Table.HeaderCell>Team</Table.HeaderCell>
                                <Table.HeaderCell>Info</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {/*{this.state.rotations.data.length && <>*/}

                            {/*</>}*/}

                            <Table.Row>
                                <Table.Cell verticalAlign={'top'}>
                                    1
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <ArtifactDomain data={data} domain={'Slumbering Court'} popover/>
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
                                    <Image avatar src='/images/characters/Amber.png'/>
                                    <Image avatar src='/images/characters/Collei.png'/>
                                    <Image avatar src='/images/characters/Albedo.png'/>
                                    <Image avatar src='/images/characters/Aloy.png'/>
                                    <Container fluid style={{marginTop: '1em'}}
                                               className={'grey'}>
                                        Blah blah blah yes my note is this
                                    </Container>
                                    <Accordion>
                                        <Accordion.Title active={this.state.activeIndex === 99}
                                                         onClick={this.handleClick} index={99}>
                                            <Icon name='dropdown'/>
                                            Expand Options
                                        </Accordion.Title>
                                    </Accordion>
                                </Table.Cell>
                            </Table.Row>
                            {/*{this.state.activeIndex == 99 && (*/}
                            {/*    <AddEditRotation editable={false} deletable={false} index={-1}*/}
                            {/*                     syncable={false}*/}
                            {/*                     data={data}/>*/}
                            {/*)}*/}
                            <Table.Row>
                                <Table.Cell verticalAlign={'top'}>
                                    2
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <ArtifactDomain data={data} domain={'Peak of Vindagnyr'} popover/>
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
                                    <Container fluid style={{marginBottom: '1em'}}>
                                        No notes
                                    </Container>
                                    <Accordion>
                                        <Accordion.Title active={this.state.activeIndex === 999}
                                                         onClick={this.handleClick} index={999}>
                                            <Icon name='dropdown'/>
                                            Expand Options
                                        </Accordion.Title>
                                    </Accordion>
                                </Table.Cell>
                            </Table.Row>
                            {/*{this.state.activeIndex == 999 && (*/}
                            {/*    <AddEditRotation editable={false} deletable={false} index={-1}*/}
                            {/*                     syncable={false}*/}
                            {/*                     data={data}/>*/}
                            {/*)}*/}

                            {this.state.activeIndex == -1 &&
                                <AddEditRotation editable={false} deletable={false} index={-1}
                                                 syncable={false}
                                                 rotationsManager={manager}
                                                 data={data}/>
                            }
                        </Table.Body>
                    </Table>
                </Container>
            </>
        )
    }
}