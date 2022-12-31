import {Container, Divider, Form, Header, Image} from "semantic-ui-react";
import React from "react";
import {AddEditButtonsProperties} from "@/artifacts/types";
import _ from "lodash";
import AddEditButtons from "@/components/artifacts/AddEditButtons";


type Properties = {} & AddEditButtonsProperties

type States = {
    filterText: string
}

export default class AddEditTeam extends React.Component<Properties, States> {
    // public static defaultProps = {
    //     editable: true,
    //     deletable: true,
    //     syncable: true,
    // };

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            filterText: ""
        }
    }

    getFilteredCharacters = (characters: string[]) => {
        let filterFunc = (c: string) => c.toLowerCase().includes(this.state.filterText.toLowerCase())
        if (this.state.filterText.startsWith('/') && this.state.filterText.endsWith('/')) {
            try {
                const re = new RegExp(this.state.filterText.substring(1, this.state.filterText.length - 1), 'i')
                filterFunc = (r: string) => re.test(r)
            } catch (ignore) {

            }
        }

        const filteredChracters = _.chain(characters)
            .filter(filterFunc)
            .value()

        return filteredChracters.length ? filteredChracters : characters
    }

    addCharacterHandler = (characterName: string) => {
        return () => {
            if (this.props.preparedRotation.team.includes(characterName)) {
                this.props.updateRotation({
                    ...this.props.preparedRotation,
                    team: _.chain(this.props.preparedRotation.team)
                        .filter((c) => c != characterName)
                        .value()
                })
            } else if (this.props.preparedRotation.team.length >= 4) {
                return
            } else {
                this.props.updateRotation({
                    ...this.props.preparedRotation,
                    team: [...this.props.preparedRotation.team, characterName],
                })
            }
        }
    }

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({filterText: event.target.value});
    }

    render() {
        return (
            <Container textAlign={'left'} style={{marginTop: '2em'}}>
                <Header as='h3'>Select Team Characters</Header>
                <Form>
                    <Form.Group>
                        <Form.Field width={'six'}>
                            <Form.Input fluid label={'Select Characters'}
                                        placeholder='Filter Character Name...'
                                        value={this.state.filterText}
                                        onChange={this.handleFilterChange}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Container>
                        {this.props.preparedRotation.team.slice(0, 4).map((c, k) =>
                            <Image src={`/images/characters/${this.props.data.characters[c].image}.png`} avatar
                                   alt={this.props.data.characters[c].image} key={k}
                                   className={'active'}
                                   onClick={this.addCharacterHandler(this.props.data.characters[c].name)}
                            />
                        )}
                        {_.range(0, 4 - Math.min(4, this.props.preparedRotation.team.length)).map((c) =>
                            <Image src={`/images/UnknownCharacter.png`} avatar
                                   alt={'Unknown Character'} key={c}
                            />
                        )}
                    </Container>
                    <Container>
                        <Divider />
                        {this.getFilteredCharacters(_.chain(Object.keys(this.props.data.characters).sort())
                            .filter((c) => !this.props.preparedRotation.team.includes(c))
                            .value()).map((c, k) =>
                            <Image src={`/images/characters/${this.props.data.characters[c].image}.png`} avatar
                                   alt={this.props.data.characters[c].image} key={k}
                                   onClick={this.addCharacterHandler(this.props.data.characters[c].name)}
                            />
                        )}
                    </Container>
                </Form>

                <AddEditButtons disableTeams {...this.props}/>
            </Container>
        )
    }
}