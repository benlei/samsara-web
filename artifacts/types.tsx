import {Characters} from "@/characters/types";
import {AddEditRotationPhase} from "@/artifacts/enums";

export type ArtifactDomains = {
    [domain: string]: ArtifactDomain
}

export type ArtifactDomain = {
    name: string
    artifacts: string[]
}

export type Artifacts = {
    [artifact: string]: Artifact
}

export type Artifact = {
    image: string
    name: string
    description: string
}


export type ArtifactsDomainsData = {
    artifacts: ArtifactsData
    domains: ArtifactDomainsData
}

export type ArtifactsData = {
    [artifact: string]: string
}

export type ArtifactDomainsData = {
    [domain: string]: string[]
}

export type ArtifactRotationData = {
    artifacts: Artifacts
    artifactDomains: ArtifactDomains
    characters: Characters
    preset: RotationPreset
}

export type RotationStorage = {
    active: number
    presets: RotationPreset[]
}

export type RotationPreset = {
    name: string

    fixed: boolean // fixed # of days between all rotations, or no
    fixedDays: number
    date: string
    rotations: Rotation[]
}

export type Rotation = {
    domain: string,
    characters: string[]
    days?: number
    note: string
}

export enum AddEdit {
    Add,
    Edit,
}

export type ListManager<Type> = {
    insert: (index: number, el: Type, newActiveIndex?: number) => void
    set: (index: number, el: Type, newActiveIndex?: number) => void
    move: (oldIndex: number, newIndex: number, newActiveIndex?: number) => void
    delete: (index: number, newActiveIndex?: number) => void
}

export type AddEditSharedProperties = {
    preparedRotation: Rotation
    updatePreparedRotation: (rotation: Rotation) => void
    data: ArtifactRotationData
    manager: ListManager<Rotation>
    setPhase: (phase: AddEditRotationPhase) => void
    onCancel: () => void
    index: number
    addEdit: AddEdit
}