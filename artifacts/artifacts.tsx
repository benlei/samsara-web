import {ArtifactDomains, Artifacts, ArtifactJsonProperties} from "@/artifacts/types";
import {getImageFromName} from "@/format/image";
import _ from "lodash";

export function getArtifacts(data: ArtifactJsonProperties): Artifacts {
    return _.chain(data.artifacts)
        .mapValues((description, artifactName) => {
            return {
                name: artifactName,
                image: getImageFromName(artifactName),
                description: description,
            }
        }).value()
}

export function getArtifactDomains(data: ArtifactJsonProperties): ArtifactDomains {
    return _.chain(data.domains)
        .mapValues((artifacts, name) => {
            return {
                name,
                artifacts,
            }
        }).value()
}