import {Container, Form, Header, Image, List} from "semantic-ui-react";
import React from "react";
import {AddEditButtonsProperties} from "@/artifacts/types";
import _ from "lodash";
import AddEditButtons from "@/components/artifacts/AddEditButtons";


type Properties = {} & AddEditButtonsProperties

type States = {}

export default class AddEditTeam extends React.Component<Properties, States> {
    // public static defaultProps = {
    //     editable: true,
    //     deletable: true,
    //     syncable: true,
    // };

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {}
    }

    getFilteredSortedCharacters = () => {
        return _.chain(this.props.data.characters)
            .orderBy((c) => c.name, 'asc')
            // .chunk(16)
            .value()
    }


    render() {
        return (
            <Container textAlign={'left'} style={{marginTop: '2em'}}>
                <Header as='h3'>Add New Team</Header>
                <Form>
                    <Form.Group>
                        <Form.Field width={'eight'}>
                            <Form.Input fluid label='Team Name' placeholder='Enter Team Name...'/>
                        </Form.Field>
                    </Form.Group>

                    <Form.Group>
                        <Form.Field>
                            <label>Team Characters</label>
                        </Form.Field>
                    </Form.Group>

                    <List divided relaxed>
                        <List.Item>
                            <Image avatar alt={'UnknownCharacter'}
                                   src={'/images/UnknownCharacter.png'}/>
                            <List.Content>
                                <List.Header>Semantic-Org/Semantic-UI</List.Header>
                                <List.Description as='a'>Updated 10 mins ago</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <Image avatar alt={'UnknownCharacter'}
                                   src={'/images/UnknownCharacter.png'}/>
                            <List.Content>
                                <List.Header>Semantic-Org/Semantic-UI-Docs</List.Header>
                                <List.Description as='a'>Updated 22 mins ago</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <Image avatar alt={'blah'} src={'/images/characters/Amber.png'}/>
                            <List.Content>
                                <List.Header>Semantic-Org/Semantic-UI-Meteor</List.Header>
                                <List.Description>Move Up | Move Down | Remove</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <Image avatar alt={'UnknownCharacter'}
                                   src={'/images/UnknownCharacter.png'}/>
                            <List.Content>
                                <List.Header>No selected character</List.Header>
                                <List.Description as='a'>Click on a character from below to
                                    add</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>

                    {/*<Divider />*/}
                    <Form.Group>
                        <Form.Field width={'six'}>
                            <Form.Input fluid label={'Select Characters'}
                                        placeholder='Filter Character Name...'/>
                        </Form.Field>
                    </Form.Group>

                    <Container>
                        {/*{this.getFilteredSortedCharacters().map((rowCharacter, k) =>*/}
                        {/*    <div key={k} className={'character-select-row'}>*/}
                        {this.getFilteredSortedCharacters().map((c, k) =>
                            <Image src={`/images/characters/${c.image}.png`} avatar alt={c.image} key={k}/>
                        )}
                        {/*</div>*/}
                        {/*)}    */}
                    </Container>

                    {/*<Form.Group inline style={{marginTop: '1em'}}>*/}
                    {/*    <Form.Field>*/}
                    {/*        <Button color={'green'} onClick={this.updatePhase(Phase.Prompt)}>*/}
                    {/*            Create*/}
                    {/*        </Button>*/}
                    {/*        <Button color={'red'} onClick={this.updatePhase(Phase.Prompt)}>*/}
                    {/*            Cancel*/}
                    {/*        </Button>*/}
                    {/*    </Form.Field>*/}
                    {/*</Form.Group>*/}
                </Form>

                <AddEditButtons disableTeams {...this.props}/>
            </Container>
        )
    }
}