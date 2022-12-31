import {Button, Form, Icon, Popup} from "semantic-ui-react";
import React from "react";
import {AddEditButtonsProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";

type Properties = {
    disableDomains: boolean
    disableCharacters: boolean
    disableInfo: boolean
} & AddEditButtonsProperties

type States = {}

export default class AddEditButtons extends React.Component<Properties, States> {
    public static defaultProps = {
        disableDomains: false,
        disableInfo: false,
        disableCharacters: false,
    }

    constructor(props: Readonly<Properties> | Properties) {
        super(props);
    }

    setPhaseHandler = (phase: AddEditPhase) => {
        return () => this.props.setPhase(phase)
    }


    createRotation = (atIndex: number) => {
        return () => {
            if (!this.props.preparedRotation.domain.length) {
                return
            }


            this.props.manager.insert(atIndex, {
                ...this.props.preparedRotation,
            })

            this.props.setPhase(AddEditPhase.Prompt)
        }
    }

    render() {
        return (
            <Form style={{marginTop: '2em', textAlign: 'center'}}>
                <Form.Group widths='equal'>
                    <Form.Field>
                        {!!this.props.data.rotations.data.length &&
                            <Popup on={'click'} trigger={
                                <Button color={this.props.preparedRotation.domain ? 'green' : 'yellow'} icon
                                        labelPosition={'left'}
                                >
                                    <Icon name='caret down'/> Create
                                </Button>
                            }
                                   pinned
                                   position={'bottom left'}>
                                {!this.props.preparedRotation.domain &&
                                    <p>You must select a domain first</p>
                                }

                                {!!this.props.preparedRotation.domain &&
                                    <Form>
                                        <Form.Group widths={'equal'}>
                                            <Form.Field>
                                                <Button color={'green'} icon labelPosition={'left'}
                                                        onClick={this.createRotation(0)}>
                                                    <Icon name='angle double up'/>
                                                    Top
                                                </Button>
                                            </Form.Field>
                                            <Form.Field>
                                                <Button color={'green'} icon labelPosition={'left'}
                                                        onClick={this.createRotation(this.props.index)}>
                                                    <Icon name='arrow alternate circle up'/>
                                                    Above #{this.props.index + 1}
                                                </Button>
                                            </Form.Field>
                                            <Form.Field>
                                                <Button color={'green'} icon labelPosition={'left'}
                                                        onClick={this.createRotation(this.props.index + 1)}>
                                                    <Icon name='arrow alternate circle down'/>
                                                    Below #{this.props.index + 1}
                                                </Button>
                                            </Form.Field>
                                            <Form.Field>
                                                <Button color={'green'} icon labelPosition={'left'}
                                                        onClick={this.createRotation(this.props.data.rotations.data.length)}>
                                                    <Icon name='angle double down'/>
                                                    Bottom
                                                </Button>
                                            </Form.Field>
                                        </Form.Group>
                                    </Form>
                                }
                            </Popup>
                        }
                        {!this.props.data.rotations.data.length &&
                            <>
                                {!this.props.preparedRotation.domain &&
                                    <Popup on={'click'} trigger={
                                        <Button color={this.props.preparedRotation.domain ? 'green' : 'yellow'} icon
                                                labelPosition={'left'}
                                        >
                                            <Icon name='caret down'/> Create #1
                                        </Button>
                                    } pinned position={'bottom left'}>
                                        <p>You must select a domain first</p>
                                    </Popup>
                                }

                                {!!this.props.preparedRotation.domain &&
                                    <Button color={'green'} icon labelPosition={'left'}
                                            onClick={this.createRotation(0)}>
                                        <Icon name={'add'}/> Create #1
                                    </Button>
                                }
                            </>
                        }
                    </Form.Field>
                    <Form.Field>
                        <Button color={this.props.disableDomains ? 'grey' : 'blue'}
                                disabled={this.props.disableDomains}
                                onClick={this.setPhaseHandler(AddEditPhase.Domain)}
                        >
                            Domain
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button color={this.props.disableCharacters ? 'grey' : 'blue'}
                                disabled={this.props.disableCharacters}
                                onClick={this.setPhaseHandler(AddEditPhase.Characters)}
                        >
                            Intended Characters
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button color={this.props.disableInfo ? 'grey' : 'blue'}
                                disabled={this.props.disableInfo}
                                onClick={this.setPhaseHandler(AddEditPhase.Info)}
                        >
                            Info
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button color={'red'} onClick={this.props.onCancel}>
                            Cancel
                        </Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        )
    }
}