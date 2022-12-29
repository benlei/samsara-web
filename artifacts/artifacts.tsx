import {ArtifactDomains, Artifacts, ArtifactsDomainsData} from "@/artifacts/types";
import {getImageFromName} from "@/format/image";
import _ from "lodash";

export function getArtifacts(data: ArtifactsDomainsData): Artifacts {
    return _.chain(data.artifacts)
        .mapValues((description, artifactName) => {
            return {
                name: artifactName,
                image: getImageFromName(artifactName),
                description: description,
            }
        }).value()
}

export function getArtifactDomains(data: ArtifactsDomainsData): ArtifactDomains {
    return _.chain(data.domains)
        .mapValues((artifacts, name) => {
            return {
                name,
                artifacts,
            }
        }).value()
}