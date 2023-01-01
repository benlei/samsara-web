import React from "react";
import {Accordion, AccordionTitleProps, Container, Icon, Image, Table} from "semantic-ui-react";
import Head from "next/head";
import ArtifactConfigLoadDownload from "@/components/artifacts/ArtifactConfigLoadDownload";
import {
    ArtifactRotationData,
    ArtifactsDomainsData,
    Rotation,
    Rotations,
    RotationsManager,
    RotationStorage
} from "@/artifacts/types";
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

const V1StorageKey = "v1_artifact_rotation"

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
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (!rotationStorage.active) {
                return
            }

            const rotations: Rotations = _.chain(rotationStorage.presets)
                .find((r) => r.name === rotationStorage.active)
                .value()
                .rotations


            this.setState({
                ...rotations,
                activeIndex: (rotations.data?.length ?? 1) - 1
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

        const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")
        if (!rotationStorage.presets?.length) {
            const store: RotationStorage = {
                active: 'default',
                presets: [{name: 'default', rotations: data}],
            }
            localStorage.setItem(V1StorageKey, JSON.stringify(store))
            return
        }

        const idx = _.chain(rotationStorage.presets)
            .findIndex((p) => p.name === rotationStorage.active)
            .value()

        rotationStorage.presets[idx].rotations = data
        localStorage.setItem(V1StorageKey, JSON.stringify(rotationStorage))
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
        if (newIndex >= this.state.data.length || newIndex < 0 || index == newIndex) {
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
                activeIndex: newActiveIndex ?? newIndex,
            }, this.commit)
        } else {
            this.setState({
                data: [
                    ...this.state.data.slice(0, newIndex),
                    this.state.data[index],
                    ...this.state.data.slice(newIndex, index),
                    ...this.state.data.slice(index + 1),
                ],
                activeIndex: newActiveIndex ?? newIndex,
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
                                <Table.HeaderCell style={{width: '3rem'}}>#</Table.HeaderCell>
                                <Table.HeaderCell style={{width: '20rem'}}>Artifacts</Table.HeaderCell>
                                <Table.HeaderCell style={{width: '12rem'}}>Intended</Table.HeaderCell>
                                <Table.HeaderCell style={{width: '40rem'}}>Info</Table.HeaderCell>
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
                                            {r.characters.map((c, k) =>
                                                <Image
                                                    avatar
                                                    src={`/images/characters/${data.characters[c].image}.png`}
                                                    alt={data.characters[c].image} key={k}/>
                                            )}

                                            {/*<List>*/}
                                            {/*    {!r.characters.length &&*/}
                                            {/*        <List.Item>*/}
                                            {/*            <Image src={`/images/UnknownCharacter.png`} avatar*/}
                                            {/*                   alt={'Unknown Character'}*/}
                                            {/*            />*/}
                                            {/*        </List.Item>*/}
                                            {/*    }*/}
                                            {/*    {_.chunk(r.characters, 4).map((chunk, k) =>*/}
                                            {/*        <List.Item key={k}>*/}
                                            {/*            {chunk.map((c, j) =>*/}
                                            {/*                <Image*/}
                                            {/*                    avatar*/}
                                            {/*                    src={`/images/characters/${data.characters[c].image}.png`}*/}
                                            {/*                    alt={data.characters[c].image} key={j}/>*/}
                                            {/*            )}*/}
                                            {/*        </List.Item>*/}
                                            {/*    )}*/}
                                            {/*</List>*/}
                                        </Table.Cell>
                                        <Table.Cell verticalAlign={'top'}>
                                            <Container fluid
                                                       className={'grey'}>
                                                <p>
                                                    <strong>{r.days ?? data.rotations.fixedDays}</strong> Rotation
                                                    Day{(r.days ?? data.rotations.fixedDays) !== 1 && 's'}
                                                </p>
                                                {r.note.split("\n").map((note, k) =>
                                                    <p key={k}>{note}</p>
                                                )}
                                            </Container>
                                            <Container fluid style={{marginTop: '.5rem'}}>
                                                <Accordion>
                                                    <Accordion.Title active={this.state.activeIndex === k}
                                                                     onClick={this.handleClick} index={k}>
                                                        <Icon name='dropdown'/>
                                                        {this.state.activeIndex === k ? 'Collapse' : 'Expand'} Options
                                                    </Accordion.Title>
                                                </Accordion>
                                            </Container>
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