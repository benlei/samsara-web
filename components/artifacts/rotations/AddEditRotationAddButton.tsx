import {Button, Form, Icon, Popup} from "semantic-ui-react";
import React from "react";
import {AddEditSharedProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";
import NumberRangeInput from "@/components/NumberRangeInput";

type Properties = {} & AddEditSharedProperties

type States = {}

export default class AddEditRotationAddButton extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            position: props.index + 2,
        }
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

    createRotationByPosition = (position: number) => this.createRotation(position - 1)()

    render() {
        return (
            <>
                {!!this.props.data.rotations.data.length ? (
                    <Popup
                        on={'click'}
                        trigger={
                            <Button color={this.props.preparedRotation.domain ? 'teal' : 'yellow'} icon
                                    labelPosition={'left'}
                            >
                                <Icon name='caret down'/> Create
                            </Button>
                        }
                        pinned
                        position={'bottom left'}>
                        {!this.props.preparedRotation.domain ? (
                            <p>You must select a domain first</p>
                        ) : (
                            <Form>
                                <Form.Group>
                                    <Form.Field>
                                        <Button color={'teal'} icon labelPosition={'right'}
                                                onClick={this.createRotation(this.props.index + 1)}>
                                            Insert as #{this.props.index + 2}
                                            <Icon name='add'/>
                                        </Button>
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group style={{marginTop: '1rem'}}>
                                    <Form.Field>
                                        <label>-or- Insert to Specific Position</label>
                                        <NumberRangeInput
                                            min={1}
                                            max={this.props.data.rotations.data.length + 1}
                                            defaultValue={this.props.index + 2}
                                            color={'teal'}
                                            icon={'add'}
                                            onSubmit={this.createRotationByPosition}
                                            placeholder={'Enter # Position'}
                                        />
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                        )}
                    </Popup>
                ) : (
                    <>
                        {!this.props.preparedRotation.domain ? (
                            <Popup
                                on={'click'}
                                trigger={
                                    <Button color={this.props.preparedRotation.domain ? 'teal' : 'yellow'} icon
                                            labelPosition={'left'}>
                                        <Icon name='add'/> Create #1
                                    </Button>
                                } pinned position={'bottom left'}>
                                <p>You must select a domain first</p>
                            </Popup>
                        ) : (
                            <Button color={'teal'} icon labelPosition={'left'}
                                    onClick={this.createRotation(0)}>
                                <Icon name={'add'}/> Create #1
                            </Button>
                        )}
                    </>
                )}
            </>
        )
    }
}