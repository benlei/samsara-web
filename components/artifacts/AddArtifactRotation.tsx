import {Form, Grid, Image, Label, List, Segment, Table} from "semantic-ui-react";
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
        this.setState({phase: Phase.Add})
    }

    render() {
        return (
            <Table.Row>
                <Table.Cell verticalAlign={'top'} colSpan={5} textAlign={'center'}>
                    {this.state.phase == Phase.Prompt &&
                        <Form style={{marginTop: '1em'}}>
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
                        </Form>

                    }
                    {this.state.phase == Phase.Add &&
                        <>
                            <Grid columns={4} stackable style={{marginTop: '1em'}} textAlign={'left'}>
                                <Grid.Column>
                                    <Segment>
                                        <List>
                                            <List.Item>
                                                <Label image>
                                                    <Image
                                                        src={'/images/artifacts/' + this.props.data.artifacts["Desert Pavilion Chronicle"].image + '.png'}
                                                        alt={this.props.data.artifacts["Desert Pavilion Chronicle"].image}
                                                    /> {this.props.data.artifacts["Desert Pavilion Chronicle"].name}
                                                </Label>
                                            </List.Item>
                                            <List.Item>
                                                <Label image>
                                                    <Image
                                                        src={'/images/artifacts/' + this.props.data.artifacts["Flower of Paradise Lost"].image + '.png'}
                                                        alt={this.props.data.artifacts["Flower of Paradise Lost"].image}
                                                    /> {this.props.data.artifacts["Flower of Paradise Lost"].name}
                                                </Label>
                                            </List.Item>
                                            <List.Item>
                                                <Label basic>City of Gold</Label>
                                            </List.Item>
                                        </List>
                                    </Segment>
                                </Grid.Column>
                            </Grid>
                        </>
                    }
                </Table.Cell>
            </Table.Row>
        )
    }
}

