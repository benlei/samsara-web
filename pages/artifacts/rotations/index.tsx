import React from "react";
import Head from "next/head";
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
import _ from "lodash";
import {dateAsString, V1StorageKey} from "@/artifacts/rotations";
import {ArtifactTable} from "@/components/artifacts/ArtifactTable";


// TODO: split up the artifact + preset stuff. make this page instead show all the "show on overview" presets


type Properties = {
    characters: string[]
    artifacts: ArtifactsDomainsData
}

type States = {
    activeIndex: number
    storage: RotationStorage
} & Rotations

export async function getStaticProps() {
    return {
        props: {
            characters: require('@/data/characters.json'),
            artifacts: require('@/data/artifacts.json'),
        },
    };
}

export default class ManageArtifactRotations extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            activeIndex: 0,
            fixed: true,
            fixedDays: 7,
            date: '2023-01-01',
            data: [],
            storage: {},
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
                activeIndex: (rotations.data?.length ?? 1) - 1,
                storage: rotationStorage,
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
            this.setState({
                storage: store
            })
            return
        }

        const idx = _.chain(rotationStorage.presets)
            .findIndex((p) => p.name === rotationStorage.active)
            .value()

        rotationStorage.presets[idx].rotations = data
        localStorage.setItem(V1StorageKey, JSON.stringify(rotationStorage))

        this.setState({
            storage: rotationStorage
        })
    }

    setActiveIndex = (activeIndex: number) => this.setState({activeIndex})

    insertRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        this.setState({
            data: [
                ...this.state.data.slice(0, index),
                rotation,
                ...this.state.data.slice(index),
            ],
            activeIndex: newActiveIndex ?? index,
            date: this.state.data.length ? this.state.date : dateAsString(new Date()),
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
                    ...this.state.data.slice(index + 1, newIndex + 1),
                    this.state.data[index],
                    ...this.state.data.slice(newIndex + 1),
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

                <ArtifactTable data={data} manager={manager} activeIndex={this.state.activeIndex}
                               setActiveIndex={this.setActiveIndex}/>
            </>
        )
    }
}