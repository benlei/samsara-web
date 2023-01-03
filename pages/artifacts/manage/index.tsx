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
import {
    calculateDateForRotation,
    dateAsString,
    DefaultFixedDays,
    DefaultIsFixed,
    getBasePreparedReset,
    getRotationIndexAndDay,
    V1StorageKey
} from "@/artifacts/presets";
import {ArtifactTable} from "@/components/artifacts/ArtifactTable";
import ClonedList from "@/artifacts/list";
import {v4} from "uuid";
import _ from "lodash";
import Stale from "@/components/Stale";


type Properties = {
    characters: string[]
    artifacts: ArtifactsDomainsData
}

type States = {
    activeIndex: number
    cacheId: string
    stale: boolean
    // intervalId: any
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
            date: '2023/01/01',
            rotations: [],
            name: 'default',
            cacheId: '',
            stale: false,
            // intervalId: 0,
        }
    }

    componentDidMount = () => {
        try {
            const storage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (_.isNil(storage?.active)) {
                return
            }

            if (storage.cacheId != this.state.cacheId) {
                const preset: RotationPreset = storage.presets[storage.active]

                this.setState({
                    ...preset,
                    activeIndex: (preset.rotations.length ?? 1) - 1,
                    cacheId: storage.cacheId,
                })
            }
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
        if (!_.isNil(rotationStorage.presets) && this.state.cacheId != rotationStorage.cacheId) {
            this.setState({
                stale: true,
            })
            return;
        }

        if (!rotationStorage.presets?.length) {
            const preset = getBasePreparedReset('default', dateAsString(new Date()))
            const store: RotationStorage = {
                active: 0,
                cacheId: v4(),
                presets: [{
                    ...preset,
                    rotations: this.state.rotations,
                }],
            }
            localStorage.setItem(V1StorageKey, JSON.stringify(store))
            this.setState({
                cacheId: store.cacheId
            })
            return
        }

        // reset rotation to today; it's a new single entry!
        if (rotationStorage.presets[rotationStorage.active].rotations.length === 0 && data.rotations.length === 1) {
            data.date = dateAsString(new Date())
        }

        rotationStorage.cacheId = v4()
        rotationStorage.presets[rotationStorage.active] = data
        localStorage.setItem(V1StorageKey, JSON.stringify(rotationStorage))

        this.setState({
            cacheId: rotationStorage.cacheId,
        })
    }

    setActiveIndex = (activeIndex: number) => this.setState({activeIndex})

    insertRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        const pre = getRotationIndexAndDay(this.state, new Date())

        this.setState({
            rotations: ClonedList.insert(this.state.rotations, index, rotation),
            activeIndex: newActiveIndex ?? index,
            date: this.state.rotations.length ? this.state.date : dateAsString(new Date()),
        }, () => {
            if (index <= pre.index && this.state.rotations.length > 1) {
                this.setState({
                    date: calculateDateForRotation(this.state, pre.index + 1, pre.day, new Date())
                }, this.commit)
            } else {
                this.commit()
            }
        })
    }

    // literally exactly same thing
    setRotation = (index: number, rotation: Rotation, newActiveIndex?: number) => {
        const pre = getRotationIndexAndDay(this.state, new Date())

        this.setState({
            rotations: ClonedList.set(this.state.rotations, index, rotation),
            activeIndex: newActiveIndex ?? index,
        }, () => {
            this.setState({
                date: calculateDateForRotation(
                    this.state,
                    pre.index,
                    index === pre.index ? Math.min(
                        this.state.fixed ? this.state.fixedDays : rotation.days ?? 1,
                        pre.day
                    ) : pre.day,
                    new Date()
                )
            }, this.commit)
        })
    }

    moveRotation = (index: number, newIndex: number, newActiveIndex?: number) => {
        if (newIndex >= this.state.rotations.length || newIndex < 0 || index == newIndex) {
            return
        }

        const pre = getRotationIndexAndDay(this.state, new Date())

        this.setState({
            rotations: ClonedList.move(this.state.rotations, index, newIndex),
            activeIndex: newActiveIndex ?? newIndex,
        }, () => {
            if (pre.index == index) {
                this.setState({
                    date: calculateDateForRotation(this.state, newIndex, pre.day, new Date())
                }, this.commit)
            } else if (index < newIndex && pre.index > index && pre.index <= newIndex) {
                this.setState({
                    date: calculateDateForRotation(this.state, pre.index - 1, pre.day, new Date())
                }, this.commit)
            } else if (newIndex < index && pre.index >= newIndex && pre.index < index) {
                this.setState({
                    date: calculateDateForRotation(this.state, pre.index + 1, pre.day, new Date())
                }, this.commit)
            } else {
                this.commit()
            }
        })
    }

    deleteRotation = (index: number, newActiveIndex?: number) => {
        const pre = getRotationIndexAndDay(this.state, new Date())

        this.setState({
            rotations: ClonedList.remove(this.state.rotations, index),
            activeIndex: newActiveIndex ?? -1,
        }, () => {
            if (index === pre.index) {
                this.setState({
                    date: calculateDateForRotation(this.state, pre.index, 1, new Date())
                }, this.commit)
            } else if (index < pre.index) {
                this.setState({
                    date: calculateDateForRotation(this.state, pre.index - 1, pre.day, new Date())
                }, this.commit)
            } else {
                this.commit()
            }
        })
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

                {this.state.stale ? (
                    <Stale/>
                ) : (
                    <ArtifactTable data={data} manager={manager} activeIndex={this.state.activeIndex}
                                   setActiveIndex={this.setActiveIndex}/>
                )}
            </>
        )
    }
}