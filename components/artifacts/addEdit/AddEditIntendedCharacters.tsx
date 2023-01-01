import {Container, Divider, Form, Icon, Image, Input} from "semantic-ui-react";
import React from "react";
import {AddEditSharedProperties} from "@/artifacts/types";
import _ from "lodash";


type Properties = {} & AddEditSharedProperties

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
                <Form>
                    <Form.Group>
                        <Form.Field width={'six'}>
                            <label>Select Intended Characters</label>
                            <Input fluid label={'Select Characters'}
                                   placeholder='Filter Character Name...'
                                   value={this.state.filterText}
                                   onChange={this.handleFilterChange}
                                   icon>
                                <input/>
                                <Icon name='search'/>
                            </Input>
                        </Form.Field>
                    </Form.Group>

                    <Form.Group>
                        <Form.Field width={'eight'}>
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
                            <Divider/>
                            {this.getFilteredCharacters(_.chain(Object.keys(this.props.data.characters).sort())
                                .filter((c) => !this.props.preparedRotation.characters.includes(c))
                                .value()).map((c, k) => (
                                    <Image src={`/images/characters/${this.props.data.characters[c].image}.png`} avatar
                                           alt={this.props.data.characters[c].image} key={k}
                                           onClick={this.addCharacterHandler(this.props.data.characters[c].name)}/>
                                )
                            )}
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}