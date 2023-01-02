import React from "react";
import Head from "next/head";
import {
    ArtifactRotationData,
    ArtifactsDomainsData,
    Rotation,
    Rotations,
    ListManager,
    RotationStorage
} from "@/artifacts/types";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";
import {getCharacters} from "@/characters/characters";
import {dateAsString, DefaultFixedDays, DefaultIsFixed, getBasePreparedReset, V1StorageKey} from "@/artifacts/presets";
import {ArtifactTable} from "@/components/artifacts/ArtifactTable";
import * as list from "@/artifacts/list";


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

export default class ManageArtifactRotations extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            activeIndex: 0,
            fixed: DefaultIsFixed,
            fixedDays: DefaultFixedDays,
            date: '2023-01-01',
            data: [],
        }
    }

    componentDidMount = () => {
        try {
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (rotationStorage.active === null || typeof rotationStorage.active === 'undefined') {
                return
            }

            const rotations: Rotations = rotationStorage.presets[rotationStorage.active].rotations


            this.setState({
                ...rotations,
                activeIndex: (rotations.data?.length ?? 1) - 1,
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
            const preset = getBasePreparedReset(dateAsString(new Date()))
            const store: RotationStorage = {
                active: 0,
                presets: [{
                    ...preset,
                    rotations: data
                }],
            }
            localStorage.setItem(V1StorageKey, JSON.stringify(store))
            return
        }

        rotationStorage.presets[rotationStorage.active].rotations = data
        localStorage.setItem(V1StorageKey, JSON.stringify(rotationStorage))
    }

    setActiveIndex = (activeIndex: number) => this.setState({activeIndex})

    insertRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        this.setState({
            data: list.insert(this.state.data, index, rotation),
            activeIndex: newActiveIndex ?? index,
            date: this.state.data.length ? this.state.date : dateAsString(new Date()),
        }, this.commit)
    }

    // literally exactly same thing
    setRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        this.setState({
            data: list.set(this.state.data, index, rotation),
            activeIndex: newActiveIndex ?? index,
        }, this.commit)
    }

    moveRotation = (index: number, newIndex: number, newActiveIndex?: number) => {
        if (newIndex >= this.state.data.length || newIndex < 0 || index == newIndex) {
            return
        }

        this.setState({
            data: list.move(this.state.data, index, newIndex),
            activeIndex: newActiveIndex ?? newIndex,
        }, this.commit)
    }

    deleteRotation = (index: number, newActiveIndex?: number) => {
        this.setState({
            data: list.remove(this.state.data, index),
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

        const manager: ListManager<Rotation> = {
            insert: this.insertRotation,
            move: this.moveRotation,
            delete: this.deleteRotation,
            set: this.setRotation,
        }

        return (
            <>
                <Head>
                    <title>Manage Artifact Rotation - Samsara</title>
                </Head>

                <ArtifactTable data={data} manager={manager} activeIndex={this.state.activeIndex}
                               setActiveIndex={this.setActiveIndex}/>
            </>
        )
    }
}