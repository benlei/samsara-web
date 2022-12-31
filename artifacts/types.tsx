import {Characters} from "@/characters/types";
import {AddEditPhase} from "@/artifacts/enums";

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
    rotations: Rotations
}

export type Rotations = {
    fixed: boolean // fixed # of days between all rotations, or no
    fixedDays: number
    date: string
    data: Rotation[]
}

export type Rotation = {
    domain: string,
    team: string[]
    characters: string[]
    days?: number
    note: string
}

export type Teams = {
    [uuid: string]: Team
}

export type Team = {
    name: string
    characters: string[]
}

export type RotationsManager = {
    insert: (index: number, rotation: Rotation, newActiveIndex?: number) => void
    set: (index: number, rotation: Rotation, newActiveIndex?: number) => void
    move: (oldIndex: number, newIndex: number, newActiveIndex?: number) => void
    delete: (index: number, newActiveIndex?: number) => void
}

export type AddEditButtonsProperties = {
    preparedRotation: Rotation
    data: ArtifactRotationData
    updateRotation: (rotation: Rotation) => void
    manager: RotationsManager
    setPhase: (phase: AddEditPhase) => void
    onCancel: () => void
    index: number
}