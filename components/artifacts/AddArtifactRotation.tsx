import {Form, Grid, Segment, Table} from "semantic-ui-react";
import React from "react";
import {ArtifactRotationData} from "@/artifacts/types";
import _ from "lodash";
import ArtifactDomainComponent from "@/components/artifacts/ArtifactDomain";

enum Phase {
    Prompt,
    Add,
    Edit,
    Delete,
    Sync,
}

type Properties = {
    index: number
    editable: boolean
    deletable: boolean
    syncable: boolean
    data: ArtifactRotationData
}

type States = {
    phase: Phase
}

export default class AddArtifactRotationComponent extends React.Component<Properties, States> {
    public static defaultProps = {
        editable: true,
        deletable: true,
        syncable: true,
    };

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            phase: Phase.Prompt,
        }
    }

    addClicked = () => {
        this.setState({phase: Phase.Add})
    }

    getSortedDomainNames = () => {
        return _.chain(Object.keys(this.props.data.artifactDomains))
            .orderBy((name) => name)
            .value()
    }

    render() {
        const {
            artifacts,
            artifactDomains,
        } = this.props.data
        return (
            <Table.Row>
                <Table.Cell verticalAlign={'top'} colSpan={4} textAlign={'center'}>
                    {this.state.phase == Phase.Prompt &&
                        <Form style={{marginTop: '1em'}}>
                            <Form.Group widths='equal'>
                                <Form.Button content='New Rotation' color={'green'} icon='add'
                                             labelPosition='left' onClick={this.addClicked}/>
                                <Form.Button
                                    content={'Edit Rotation #' + (this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index)}
                                    icon='edit'
                                    labelPosition='left' disabled={!this.props.editable}/>

                                <Form.Button
                                    content={'Start Rotation at #' + (this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index)}
                                    icon='pin'
                                    labelPosition='left' disabled={!this.props.syncable}/>

                                <Form.Button content='Delete' color={'red'} icon='delete'
                                             labelPosition='left' disabled={!this.props.deletable}/>
                            </Form.Group>
                        </Form>

                    }
                    {this.state.phase == Phase.Add &&
                        <>
                            <Grid columns={3} stackable style={{marginTop: '1em'}} textAlign={'left'}>
                                {this.getSortedDomainNames().map((domainName) =>
                                    <Grid.Column key={domainName}>
                                        <Segment>
                                            <ArtifactDomainComponent data={this.props.data} domain={domainName} />
                                        </Segment>
                                    </Grid.Column>
                                )}
                            </Grid>
                        </>
                    }
                </Table.Cell>
            </Table.Row>
        )
    }
}

