import React from "react";
import {Checkbox, Container, Form, Grid, Icon, Input, Segment} from "semantic-ui-react";
import _ from "lodash";
import {AddEditSharedProperties} from "@/artifacts/types";
import ArtifactDomain from "@/components/artifacts/ArtifactDomain";

type Properties = {} & AddEditSharedProperties

type States = {
    showDescriptions: boolean
    filterArtifacts: string
}

export default class AddEditRotationDomain extends React.Component<Properties, States> {
    public static defaultProps = {
        onClickDomain: null,
        onCancel: null,
    }

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            showDescriptions: false,
            filterArtifacts: "",
        }
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

    onClickDomain = (domain: string) => {
        return () => {
            this.props.updatePreparedRotation({
                ...this.props.preparedRotation,
                domain: this.props.preparedRotation.domain === domain ? "" : domain
            })
        }
    }


    render() {
        return (
            <Container fluid textAlign={'left'} style={{padding: '1em'}}>
                <Form>
                    <Form.Group>
                        <Form.Field width={'six'}>
                            <label>Select Domain (required)</label>
                            <Input fluid placeholder='Filter by Artifact or Domain...'
                                   onChange={this.handleFilterArtifacts}
                                   icon>
                                <input/>
                                <Icon name='search'/>
                            </Input>
                        </Form.Field>
                    </Form.Group>
                    <Form.Group style={{marginTop: '1em'}}>
                        <Form.Field>
                            <Checkbox label='Show Artifact Descriptions'
                                      onClick={this.flipShowDescription}
                                      checked={this.state.showDescriptions}/>
                        </Form.Field>
                    </Form.Group>
                </Form>

                <Grid columns={3} stackable textAlign={'left'} style={{marginTop: '1em'}}>
                    {this.getFilteredSortedDomainNames().map((domainName) =>
                        <Grid.Column key={domainName}>
                            <Segment onClick={this.onClickDomain(domainName)}
                                     className={this.props.preparedRotation.domain == domainName ? 'secondary green' : 'grey'}>
                                <ArtifactDomain data={this.props.data} domain={domainName}
                                                showDescription={this.state.showDescriptions}/>
                            </Segment>
                        </Grid.Column>
                    )}
                </Grid>
            </Container>
        )
    }
}