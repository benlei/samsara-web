import {Accordion, Button, Container, Form, Header, Icon} from "semantic-ui-react";
import React from "react";
import {Rotations} from "@/artifacts/types";

enum Phase {
    Prompt,
    Add,
    Edit,
}

type Properties = {
    data: Rotations
}

type States = {
    expanded: boolean
    phase: Phase
}

export default class TeamSetupComponent extends React.Component<Properties, States> {
    // public static defaultProps = {
    //     editable: true,
    //     deletable: true,
    //     syncable: true,
    // };

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            expanded: false,
            phase: Phase.Prompt,
        }
    }

    handleExpand = () => {
        this.setState({expanded: !this.state.expanded})
    }

    updatePhase = (newPhase: Phase) => {
        return () => this.setState({phase: newPhase})
    }

    render() {
        return (
            <Container style={{marginTop: '2em'}}>
                <Accordion>
                    <Accordion.Title
                        active={this.state.expanded}
                        index={0}
                        onClick={this.handleExpand}
                    >
                        <Icon name='dropdown'/> Team Setup
                    </Accordion.Title>
                    <Accordion.Content active={this.state.expanded}>
                        {this.state.phase == Phase.Prompt &&
                            <Container>
                                <Button icon labelPosition='left' color={'green'} onClick={this.updatePhase(Phase.Add)}>
                                    <Icon name='add'/> Add New Team
                                </Button>
                            </Container>
                        }
                        {this.state.phase == Phase.Add &&
                            <Container>
                                <Header as='h3'>Add New Team</Header>
                                <Form>
                                    <Form.Group>
                                        <Form.Field width={'eight'}>
                                            <Form.Input fluid label='Team Name' placeholder='Enter Team Name...'/>
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Group inline style={{marginTop: '1em'}}>
                                        <Form.Field>
                                            <Button color={'green'} onClick={this.updatePhase(Phase.Prompt)}>
                                                Create
                                            </Button>
                                            <Button color={'red'} onClick={this.updatePhase(Phase.Prompt)}>
                                                Cancel
                                            </Button>
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </Container>
                        }
                    </Accordion.Content>
                </Accordion>
            </Container>
        )
    }
}