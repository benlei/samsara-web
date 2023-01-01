import {Container, Form, Header, Input, TextArea} from "semantic-ui-react";
import React, {ChangeEvent} from "react";
import {AddEditButtonsProperties} from "@/artifacts/types";
import AddEditButtons from "@/components/artifacts/AddEditButtons";

type Properties = {} & AddEditButtonsProperties

type States = {}

export default class AddEditInfo extends React.Component<Properties, States> {
    onChangeDays = (event: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);

        if (isNaN(value)) {
            return
        }

        this.props.updatePreparedRotation({
            ...this.props.preparedRotation,
            days: Math.max(Math.min(10000, value), 1)
        })
    }

    onChangeNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.props.updatePreparedRotation({
            ...this.props.preparedRotation,
            note: event.target.value,
        })
    }

    render() {
        return (
            <Container textAlign={'left'} style={{padding: '1em'}}>
                <Header as='h3'>Manage Info</Header>
                <Form>
                    <Form.Group>
                        <Form.Field width={'four'}>
                            <label>Set Total Rotation Days</label>
                            {this.props.data.rotations.fixed
                                ? <strong>{this.props.data.rotations.fixedDays}</strong>
                                : <Input fluid type={'number'} min={1} max={10000}
                                         onChange={this.onChangeDays} value={this.props.preparedRotation.days}/>
                            }
                        </Form.Field>
                    </Form.Group>
                    <Form.Group style={{marginTop: '1em'}}>
                        <Form.Field width={'ten'}>
                            <label>Set a note</label>
                            <TextArea
                                placeholder={'Write down whatever you want, like the kinds of artifacts you are trying to get.'}
                                value={this.props.preparedRotation.note}
                                onChange={this.onChangeNote}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group style={{marginTop: '1em'}}>
                        <Form.Field width={'ten'}>
                            <label>Preview</label>
                            <Container className={'grey'}>
                                {this.props.preparedRotation.note.split("\n").map((note, k) =>
                                    <p key={k}>{note}</p>
                                )}
                            </Container>
                        </Form.Field>
                    </Form.Group>
                </Form>

                <AddEditButtons disableInfo {...this.props}/>
            </Container>
        )
    }
}