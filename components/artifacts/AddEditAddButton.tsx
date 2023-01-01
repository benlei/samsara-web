import {Button, Form, Icon, Popup} from "semantic-ui-react";
import React from "react";
import {AddEditSharedProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";

type Properties = {} & AddEditSharedProperties

type States = {}

export default class AddEditAddButton extends React.Component<Properties, States> {

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