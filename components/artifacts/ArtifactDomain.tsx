import {Image, Label, List, Popup} from "semantic-ui-react";
import React from "react";
import {ArtifactRotationData, ArtifactsArtifactDomains, ArtifactJsonProperties} from "@/artifacts/types";

type Properties = {
    data: ArtifactsArtifactDomains
    domain: string
    popover: boolean
    showDescription: boolean
    additionalLabel?: React.ReactNode
}

type States = {}

export default class ArtifactDomain extends React.Component<Properties, States> {
    public static defaultProps = {
        popover: false,
        showDescription: false,
        additionalLabel: null,
    };

    render() {
        const {
            artifacts,
            domains,
        } = this.props.data

        if (domains[this.props.domain] === undefined) {
            return <></>
        }

        return (
            <List>
                {this.props.popover && domains[this.props.domain].artifacts.map((artifact, k) =>
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

                {!this.props.popover && domains[this.props.domain].artifacts.map((artifact, k) =>
                    <React.Fragment key={k}>
                        <List.Item>
                            <div>
                                <Image
                                    avatar
                                    src={`/images/artifacts/${artifacts[artifact].image}.png`}
                                    alt={artifacts[artifact].image}
                                /> <span className={'grey bold'}>{artifacts[artifact].name}</span>
                            </div>
                        </List.Item>
                        {this.props.showDescription &&
                            <List.Item className={'small'}>
                                {artifacts[artifact].description.split('\n').map((d, k) =>
                                    <p key={k}>{d}</p>
                                )}
                            </List.Item>
                        }
                    </React.Fragment>
                )}
                <List.Item>
                    <Label basic style={{marginBottom: '.5em'}}>{domains[this.props.domain].name}</Label>
                    {this.props.additionalLabel}
                </List.Item>
            </List>
        )
    }
}