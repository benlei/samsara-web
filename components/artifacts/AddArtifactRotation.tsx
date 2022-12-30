import {Checkbox, Container, Form, Grid, Input, Segment, Table} from "semantic-ui-react";
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
    showDescriptions: boolean
    filterArtifacts: string
    selectedDomain: string
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
            showDescriptions: false,
            filterArtifacts: "",
            selectedDomain: "",
        }
    }

    addClicked = () => {
        this.setState({phase: Phase.Add})
    }

    getFilteredSortedDomainNames = () => {
        return _.chain(Object.keys(this.props.data.artifactDomains))
            .filter(this.getFilterArtifactFunc())
            .orderBy((name) => name)
            .value()
    }

    flipShowDescription = () => {
        this.setState({showDescriptions: !this.state.showDescriptions})
    }

    handleFilterArtifacts = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({filterArtifacts: event.target.value});
    }

    selectDomain = (domain: string) => {
        return () => {
            this.setState({selectedDomain: this.state.selectedDomain === domain ? "" : domain})
        }
    }

    private getFilterArtifactFunc() {
        const getText = (domain: string): string => {
            return [
                domain,
                ...this.props.data.artifactDomains[domain].artifacts.map((artifact) => `${artifact}\n${this.props.data.artifacts[artifact].description}`),
            ].join("\n")
        }

        let filterFunc = (s: string) => getText(s).toLowerCase().includes(this.state.filterArtifacts.toLowerCase())
        if (this.state.filterArtifacts.startsWith('/') && this.state.filterArtifacts.endsWith('/')) {
            try {
                const re = new RegExp(this.state.filterArtifacts.substring(1, this.state.filterArtifacts.length - 1), 'i')
                filterFunc = (s: string) => re.test(getText(s))
            } catch (ignore) {

            }
        }
        return filterFunc
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
                            <Container textAlign={'left'}>
                                <Form>
                                    <Form.Group>
                                        <Form.Field width={'six'}>
                                            <label>Select Domain (required)</label>
                                            <Input fluid placeholder='Filter by Artifact or Domain...'
                                                   onChange={this.handleFilterArtifacts}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Field>
                                            <Checkbox label='Show Artifact Descriptions'
                                                      onClick={this.flipShowDescription}
                                                      checked={this.state.showDescriptions}/>
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </Container>
                            <Grid columns={3} stackable style={{marginTop: '1em'}} textAlign={'left'}>
                                {this.getFilteredSortedDomainNames().map((domainName) =>
                                    <Grid.Column key={domainName}>
                                        <Segment onClick={this.selectDomain(domainName)}
                                                 className={this.state.selectedDomain == domainName ? 'secondary green' : ''}>
                                            <ArtifactDomainComponent data={this.props.data} domain={domainName}
                                                                     showDescription={this.state.showDescriptions}/>
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

