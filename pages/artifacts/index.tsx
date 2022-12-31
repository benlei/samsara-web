import React from "react";
import {Accordion, AccordionTitleProps, Container, Icon, Image, List, Table} from "semantic-ui-react";
import Head from "next/head";
import ArtifactConfigLoadDownload from "@/components/artifacts/ArtifactConfigLoadDownload";
import {ArtifactRotationData, ArtifactsDomainsData, Rotation, Rotations, RotationsManager} from "@/artifacts/types";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";
import {getCharacters} from "@/characters/characters";
import ArtifactDomain from "@/components/artifacts/ArtifactDomain";
import AddEditRotation from "@/components/artifacts/AddEditRotation";
import _ from "lodash";

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
            activeIndex: 0,
            fixed: true,
            fixedDays: 3,
            date: '2023-01-01',
            data: [],
        }
    }

    componentDidMount = () => {
        try {
            const savedData: Rotations = JSON.parse(localStorage.getItem("artifactRotationData") || "{}")
            this.setState({
                ...savedData,
                activeIndex: (savedData.data?.length ?? 1) - 1
            })
        } catch (ignore) {

        }
    }

    commit = () => {
        const data: Rotations = {
            "fixed": this.state.fixed,
            "fixedDays": this.state.fixedDays,
            "date": this.state.date,
            "data": this.state.data,
        }
        localStorage.setItem("artifactRotationData", JSON.stringify(data))
    }

    handleClick = (event: any, titleProps: AccordionTitleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({activeIndex: newIndex as number})
    }

    insertRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        this.setState({
            data: [
                ...this.state.data.slice(0, index),
                rotation,
                ...this.state.data.slice(index),
            ],
            activeIndex: newActiveIndex ?? index,
        }, this.commit)
    }

    // literally exactly same thing
    setRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        this.setState({
            data: [
                ...this.state.data.slice(0, index),
                rotation,
                ...this.state.data.slice(index + 1),
            ],
            activeIndex: newActiveIndex ?? index,
        }, this.commit)
    }

    moveRotation = (index: number, newIndex: number, newActiveIndex?: number) => {
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
                ],
                activeIndex: newActiveIndex ?? index,
            }, this.commit)
        } else {
            this.setState({
                data: [
                    ...this.state.data.slice(0, newIndex),
                    this.state.data[index],
                    ...this.state.data.slice(newIndex, index),
                    ...this.state.data.slice(index + 1),
                ],
                activeIndex: newActiveIndex ?? index,
            }, this.commit)
        }
    }
    deleteRotation = (index: number, newActiveIndex?: number) => {
        this.setState({
            data: [
                ...this.state.data.slice(0, index),
                ...this.state.data.slice(index + 1),
            ],
            activeIndex: newActiveIndex ?? -1,
        }, this.commit)
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
                                <Table.HeaderCell style={{minWidth: '14em'}}>Team</Table.HeaderCell>
                                <Table.HeaderCell>Info</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.state.data.map((r, k) =>
                                <>
                                    <Table.Row key={k}>
                                        <Table.Cell verticalAlign={'top'}>
                                            {k + 1}
                                        </Table.Cell>
                                        <Table.Cell verticalAlign={'top'}>
                                            <ArtifactDomain data={data} domain={r.domain} popover/>
                                        </Table.Cell>
                                        <Table.Cell verticalAlign={'top'}>
                                            <List>
                                                <List.Item>
                                                    {r.team.slice(0, 4).map((c, j) =>
                                                        <Image avatar
                                                               src={`/images/characters/${data.characters[c].image}.png`}
                                                               alt={data.characters[c].image} key={j}/>
                                                    )}
                                                    {_.range(4 - r.team.slice(0, 4).length).map((n, j) =>
                                                        <Image avatar src='/images/UnknownCharacter.png' alt={'Unknown'}
                                                               key={j}/>
                                                    )}
                                                </List.Item>
                                            </List>
                                        </Table.Cell>
                                        <Table.Cell verticalAlign={'top'}>
                                            {r.characters.map((c, j) =>
                                                <Image avatar
                                                       src={`/images/characters/${data.characters[c].image}.png`}
                                                       alt={data.characters[c].image} key={j}/>
                                            )}
                                            <Image avatar alt={'Character'} src='/images/characters/Amber.png'/>
                                            <Image avatar alt={'Character'} src='/images/characters/Collei.png'/>
                                            <Image avatar alt={'Character'} src='/images/characters/Albedo.png'/>
                                            <Image avatar alt={'Character'} src='/images/characters/Aloy.png'/>
                                            <Container fluid style={{marginTop: '1em'}}
                                                       className={'grey'}>
                                                Blah blah blah yes my note is this
                                            </Container>
                                            <Accordion>
                                                <Accordion.Title active={this.state.activeIndex === k}
                                                                 onClick={this.handleClick} index={k}>
                                                    <Icon name='dropdown'/>
                                                    {this.state.activeIndex === k ? 'Collapse' : 'Expand'} Options
                                                </Accordion.Title>
                                            </Accordion>
                                        </Table.Cell>
                                    </Table.Row>
                                    {this.state.activeIndex === k &&
                                        <AddEditRotation index={k}
                                                         rotationsManager={manager}
                                                         data={data}/>
                                    }
                                </>
                            )}

                            {!this.state.data.length &&
                                <AddEditRotation editable={false} deletable={false} index={0}
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