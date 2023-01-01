import {Button, Form, Icon, Input, Popup} from "semantic-ui-react";
import React from "react";
import {AddEditSharedProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";

type Properties = {} & AddEditSharedProperties

type States = {
    position: number
}

export default class AddEditAddButton extends React.Component<Properties, States> {
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

    changePosition = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            this.setState({
                position: Math.min(
                    this.props.data.rotations.data.length + 1,
                    Math.max(parseInt(event.target.value) || this.state.position, 1)
                )
            });
        } catch (ignore) {

        }
    }

    render() {
        return (
            <>
                {!!this.props.data.rotations.data.length ? (
                    <Popup
                        on={'click'}
                        trigger={
                            <Button color={this.props.preparedRotation.domain ? 'green' : 'yellow'} icon
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
                                        <Button color={'green'} icon labelPosition={'right'}
                                                onClick={this.createRotation(this.props.index + 1)}>
                                            Insert as #{this.props.index + 2}
                                            <Icon name='add'/>
                                        </Button>
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group style={{marginTop: '1rem'}}>
                                    <Form.Field>
                                        <label>-or- Insert to Specific Position</label>
                                        <Input
                                            action={{
                                                color: 'green',
                                                icon: 'add',
                                                onClick: this.createRotation(this.state.position - 1),
                                            }}
                                            placeholder='Enter # Position'
                                            value={this.state.position}
                                            onChange={this.changePosition}
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
                                    <Button color={this.props.preparedRotation.domain ? 'green' : 'yellow'} icon
                                            labelPosition={'left'}>
                                        <Icon name='add'/> Create #1
                                    </Button>
                                } pinned position={'bottom left'}>
                                <p>You must select a domain first</p>
                            </Popup>
                        ) : (
                            <Button color={'green'} icon labelPosition={'left'}
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