import React from "react";
import Head from "next/head";
import {
    ArtifactRotationData,
    ArtifactsDomainsData,
    ListManager,
    Rotation,
    RotationPreset,
    RotationStorage
} from "@/artifacts/types";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";
import {getCharacters} from "@/characters/characters";
import {dateAsString, DefaultFixedDays, DefaultIsFixed, getBasePreparedReset, V1StorageKey} from "@/artifacts/presets";
import {ArtifactTable} from "@/components/artifacts/ArtifactTable";
import ClonedList from "@/artifacts/list";


type Properties = {
    characters: string[]
    artifacts: ArtifactsDomainsData
}

type States = {
    activeIndex: number
} & RotationPreset

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
            rotations: [],
            name: 'default',
        }
    }

    componentDidMount = () => {
        try {
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (rotationStorage.active === null || typeof rotationStorage.active === 'undefined') {
                return
            }

            const preset: RotationPreset = rotationStorage.presets[rotationStorage.active]

            this.setState({
                ...preset,
                activeIndex: (preset.rotations.length ?? 1) - 1,
            })
        } catch (ignore) {

        }
    }

    commit = () => {
        const data: RotationPreset = {
            name: this.state.name,
            fixed: this.state.fixed,
            fixedDays: this.state.fixedDays,
            date: this.state.date,
            rotations: this.state.rotations,
        }

        const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")
        if (!rotationStorage.presets?.length) {
            const preset = getBasePreparedReset(dateAsString(new Date()))
            const store: RotationStorage = {
                active: 0,
                presets: [{
                    ...preset,
                    rotations: this.state.rotations,
                }],
            }
            localStorage.setItem(V1StorageKey, JSON.stringify(store))
            return
        }

        rotationStorage.presets[rotationStorage.active] = data
        localStorage.setItem(V1StorageKey, JSON.stringify(rotationStorage))
    }

    setActiveIndex = (activeIndex: number) => this.setState({activeIndex})

    insertRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        this.setState({
            rotations: ClonedList.insert(this.state.rotations, index, rotation),
            activeIndex: newActiveIndex ?? index,
            date: this.state.rotations.length ? this.state.date : dateAsString(new Date()),
        }, this.commit)
    }

    // literally exactly same thing
    setRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        this.setState({
            rotations: ClonedList.set(this.state.rotations, index, rotation),
            activeIndex: newActiveIndex ?? index,
        }, this.commit)
    }

    moveRotation = (index: number, newIndex: number, newActiveIndex?: number) => {
        if (newIndex >= this.state.rotations.length || newIndex < 0 || index == newIndex) {
            return
        }

        this.setState({
            rotations: ClonedList.move(this.state.rotations, index, newIndex),
            activeIndex: newActiveIndex ?? newIndex,
        }, this.commit)
    }

    deleteRotation = (index: number, newActiveIndex?: number) => {
        this.setState({
            rotations: ClonedList.remove(this.state.rotations, index),
            activeIndex: newActiveIndex ?? -1,
        }, this.commit)
    }

    render() {
        const data: ArtifactRotationData = {
            artifacts: getArtifacts(this.props.artifacts),
            artifactDomains: getArtifactDomains(this.props.artifacts),
            characters: getCharacters(this.props.characters),
            preset: {
                name: this.state.name,
                fixed: this.state.fixed,
                fixedDays: this.state.fixedDays,
                date: this.state.date,
                rotations: this.state.rotations,
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