import {Checkbox, Form, Grid, Table} from "semantic-ui-react";
import React from "react";
import {ArtifactRotationData} from "@/artifacts/types";

enum Phase {
    Prompt,
    Add,
    Edit,
    Delete,
}

type Properties = {
    index: number
    editable: boolean
    deletable: boolean
    data: ArtifactRotationData
}

type States = {
    phase: Phase
}

export default class AddArtifactRotationComponent extends React.Component<Properties, States> {

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            phase: Phase.Prompt,
        }
    }

    addClicked = () => {

    }

    render() {
        return (
            <Table.Row>
                <Table.Cell verticalAlign={'top'} colSpan={5} textAlign={'center'}>
                    <Form style={{marginTop: '1em'}}>
                        {this.state.phase == Phase.Prompt &&
                            <Form.Group widths='equal'>
                                <Form.Button content='New Rotation' color={'green'} icon='add'
                                             labelPosition='left' onClick={this.addClicked}/>
                                <Form.Button
                                    content={'Edit #' + (this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index)}
                                    icon='edit'
                                    labelPosition='left' disabled={!this.props.editable}/>
                                <Form.Button content='Delete' color={'red'} icon='delete'
                                             labelPosition='left' disabled={!this.props.deletable}/>
                            </Form.Group>

                        }
                        {this.state.phase == Phase.Add &&
                            <>
                                <Form.Group>
                                    <Grid columns={2} divided>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Checkbox label={'Something'}/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Checkbox label={'Something Else'}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form.Group>
                            </>
                        }
                    </Form>
                </Table.Cell>
            </Table.Row>
        )
    }
}

