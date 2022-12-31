import {Container, Divider, Form, Header, Image} from "semantic-ui-react";
import React from "react";
import {AddEditButtonsProperties} from "@/artifacts/types";
import _ from "lodash";
import AddEditButtons from "@/components/artifacts/AddEditButtons";


type Properties = {} & AddEditButtonsProperties

type States = {
    filterText: string
}

export default class AddEditIntendedCharacters extends React.Component<Properties, States> {
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
            if (this.props.preparedRotation.characters.includes(characterName)) {
                this.props.updatePreparedRotation({
                    ...this.props.preparedRotation,
                    characters: _.chain(this.props.preparedRotation.characters)
                        .filter((c) => c != characterName)
                        .value()
                })
            } else {
                this.props.updatePreparedRotation({
                    ...this.props.preparedRotation,
                    characters: [...this.props.preparedRotation.characters, characterName],
                })
            }
        }
    }

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({filterText: event.target.value});
    }

    render() {
        return (
            <Container textAlign={'left'} style={{padding: '1em'}}>
                <Header as='h3'>Select Intended Characters</Header>
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

                    <Container style={{marginTop: '1rem'}}>
                        {!this.props.preparedRotation.characters.length &&
                            <Image src={`/images/UnknownCharacter.png`} avatar
                                   alt={'Unknown Character'}
                            />
                        }
                        {this.props.preparedRotation.characters.map((c, k) =>
                            <Image src={`/images/characters/${this.props.data.characters[c].image}.png`} avatar
                                   alt={this.props.data.characters[c].image} key={k}
                                   className={'active'}
                                   onClick={this.addCharacterHandler(this.props.data.characters[c].name)}
                            />
                        )}
                    </Container>
                    <Container>
                        <Divider/>
                        {this.getFilteredCharacters(_.chain(Object.keys(this.props.data.characters).sort())
                            .filter((c) => !this.props.preparedRotation.characters.includes(c))
                            .value()).map((c, k) =>
                            <Image src={`/images/characters/${this.props.data.characters[c].image}.png`} avatar
                                   alt={this.props.data.characters[c].image} key={k}
                                   onClick={this.addCharacterHandler(this.props.data.characters[c].name)}
                            />
                        )}
                    </Container>
                </Form>

                <AddEditButtons disableCharacters {...this.props}/>
            </Container>
        )
    }
}