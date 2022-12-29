import {Image, Label, List, Popup} from "semantic-ui-react";
import React from "react";
import {ArtifactRotationData} from "@/artifacts/types";

type Properties = {
    data: ArtifactRotationData
    domain: string
    // popover: boolean
}

type States = {}

export default class ArtifactDomainComponent extends React.Component<Properties, States> {
    // public static defaultProps = {
    //     popover: true
    // };

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
                {artifactDomains[this.props.domain].artifacts.map((artifact, k) =>
                    <List.Item key={k}>
                        <Popup
                            trigger={
                                <div>
                                    <Image
                                        avatar
                                        src={`/images/artifacts/${artifacts[artifact].image}.png`}
                                        alt={artifacts[artifact].image}
                                    /> <span className={'grey bold'}>{artifacts[artifact].name}</span>
                                </div>
                            }
                            hoverable
                            position='top left'
                            on={'click'}
                            wide={'very'}
                            size={'tiny'}>
                            <Popup.Content>
                                <p>
                                    <strong>
                                        <Image
                                            src={`/images/artifacts/${artifacts[artifact].image}.png`}
                                            alt={artifacts[artifact].image}
                                            avatar
                                        /> {artifacts[artifact].name}
                                    </strong>
                                </p>

                                {artifacts[artifact].description.split('\n').map((d, k) =>
                                    <p key={k}>{d}</p>
                                )}
                            </Popup.Content>
                        </Popup>
                    </List.Item>
                )}
                <List.Item>
                    <Label basic>{artifactDomains[this.props.domain].name}</Label>
                </List.Item>
            </List>
        )
    }
}