import React from "react";
import {Accordion, AccordionTitleProps, Container, Icon, Image, List, Table} from "semantic-ui-react";
import Head from "next/head";
import ArtifactStepComponent from "@/components/artifacts/ArtifactStep";
import ArtifactConfigLoadDownloadComponent from "@/components/artifacts/ArtifactConfigLoadDownload";
import {ArtifactRotationData, ArtifactsDomainsData, Rotations} from "@/artifacts/types";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";
import {getCharacters} from "@/characters/characters";
import AddArtifactRotationComponent from "@/components/artifacts/AddArtifactRotation";
import ArtifactDomainComponent from "@/components/artifacts/ArtifactDomain";

type Properties = {
    characters: string[]
    artifacts: ArtifactsDomainsData
}

type States = {
    activeIndex: number
    rotations: Rotations
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
            activeIndex: -1,
            rotations: {fixed: true, fixedDays: 3, date: '2023-01-01', teams: {}, data: []},
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

    handleClick = (event: any, titleProps: AccordionTitleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({activeIndex: newIndex as number})
    };

    render() {
        const data: ArtifactRotationData = {
            "artifacts": getArtifacts(this.props.artifacts),
            "artifactDomains": getArtifactDomains(this.props.artifacts),
            "characters": getCharacters(this.props.characters),
            "rotations": this.state.rotations,
        }

        return (
            <>
                <Head>
                    <title>Artifact Rotations - Samsara</title>
                </Head>
                <ArtifactStepComponent/>
                <ArtifactConfigLoadDownloadComponent/>

                <Container style={{marginTop: '2em'}}>
                    <Table unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell style={{width: '3em'}}>#</Table.HeaderCell>
                                <Table.HeaderCell>Artifacts</Table.HeaderCell>
                                <Table.HeaderCell>Teams</Table.HeaderCell>
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
                                    <ArtifactDomainComponent data={data} domain={'City of Gold'}/>
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
                                    <Container fluid style={{marginBottom: '1em'}}>
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
                            {this.state.activeIndex == 99 && (
                                <AddArtifactRotationComponent editable={false} deletable={false} index={-1}
                                                              syncable={false}
                                                              data={data}/>
                            )}
                            <Table.Row>
                                <Table.Cell verticalAlign={'top'}>
                                    2
                                </Table.Cell>
                                <Table.Cell verticalAlign={'top'}>
                                    <ArtifactDomainComponent data={data} domain={'Peak of Vindagnyr'}/>
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
                            {this.state.activeIndex == 999 && (
                                <AddArtifactRotationComponent editable={false} deletable={false} index={-1}
                                                              syncable={false}
                                                              data={data}/>
                            )}

                            {this.state.activeIndex == -1 &&
                                <AddArtifactRotationComponent editable={false} deletable={false} index={-1}
                                                              syncable={false}
                                                              data={data}/>
                            }
                        </Table.Body>
                    </Table>
                </Container>
            </>
        )
            ;
    }
}