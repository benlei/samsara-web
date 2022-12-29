import {Image, Label, List} from "semantic-ui-react";
import React from "react";
import {ArtifactRotationData} from "@/artifacts/types";

type Properties = {
    data: ArtifactRotationData
    domain: string
}

type States = {}

export default class ArtifactDomainComponent extends React.Component<Properties, States> {
    render() {
        const {
            artifacts,
            artifactDomains,
        } = this.props.data

        if (artifactDomains[this.props.domain] === undefined) {
            return <></>
        }

        return (
            <List>
                <List.Item>
                    <Label image>
                        <Image
                            src={`/images/artifacts/${artifacts[artifactDomains[this.props.domain].artifacts[0]].image}.png`}
                            alt={artifacts[artifactDomains[this.props.domain].artifacts[0]].image}
                        /> {artifacts[artifactDomains[this.props.domain].artifacts[0]].name}
                    </Label>
                </List.Item>
                <List.Item>
                    <Label image>
                        <Image
                            src={`/images/artifacts/${artifacts[artifactDomains[this.props.domain].artifacts[1]].image}.png`}
                            alt={artifacts[artifactDomains[this.props.domain].artifacts[1]].image}
                        /> {artifacts[artifactDomains[this.props.domain].artifacts[1]].name}
                    </Label>
                </List.Item>
                <List.Item>
                    <Label basic>{artifactDomains[this.props.domain].name}</Label>
                </List.Item>
            </List>
        )
    }
}