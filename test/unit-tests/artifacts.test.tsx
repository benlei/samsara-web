import {ArtifactJsonProperties} from "@/artifacts/types";
import {getArtifactDomains, getArtifacts} from "@/artifacts/artifacts";

const ThunderingFuryDescription = "2 Piece: Electro DMG Bonus +15%\n4 Piece: Increases DMG caused by Overloaded, Electro-Charged, Superconduct, and Hyperbloom by 40%, and the DMG Bonus conferred by Aggravate is increased by 20%. When Quicken or the aforementioned Elemental Reactions are triggered, Elemental Skill CD is decreased by 1s. Can only occur once every 0.8s."
describe('getArtifacts()', () => {
    it('should have same number of elements as input', async () => {
        const artifactsDomainsData: ArtifactJsonProperties = require('@/data/artifacts.json')
        const artifacts = getArtifacts(artifactsDomainsData)

        expect(Object.keys(artifacts)).toEqual(Object.keys(artifactsDomainsData.artifacts))
    });

    it('should have Thundering Fury', async () => {
        const artifactsDomainsData: ArtifactJsonProperties = require('@/data/artifacts.json')
        const artifacts = getArtifacts(artifactsDomainsData)

        expect(artifacts["Thundering Fury"]).toEqual({
            name: "Thundering Fury",
            image: "Thundering-Fury",
            description: ThunderingFuryDescription,
        })
    });
})


describe('getArtifactDomains()', () => {
    it('should have same number of elements as input', async () => {
        const artifactsDomainsData: ArtifactJsonProperties = require('@/data/artifacts.json')
        const domains = getArtifactDomains(artifactsDomainsData)

        expect(Object.keys(domains)).toEqual(Object.keys(artifactsDomainsData.domains))
    });

    it('should have Clear Pool and Mountain Cavern', async () => {
        const artifactsDomainsData: ArtifactJsonProperties = require('@/data/artifacts.json')
        const domains = getArtifactDomains(artifactsDomainsData)

        expect(domains["Clear Pool and Mountain Cavern"]).toEqual({
            name: "Clear Pool and Mountain Cavern",
            artifacts: ["Bloodstained Chivalry", "Noblesse Oblige"],
        })
    });
})