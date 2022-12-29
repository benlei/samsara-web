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