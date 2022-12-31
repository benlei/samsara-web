import {Button, Icon, Popup} from "semantic-ui-react";
import React from "react";
import {AddEditButtonsProperties} from "@/artifacts/types";
import {AddEditPhase} from "@/artifacts/enums";

type Properties = {} & AddEditButtonsProperties

type States = {}

export default class AddEditEditButton extends React.Component<Properties, States> {
    updateRotation = () => {
        this.props.manager.set(this.props.index, {
            ...this.props.preparedRotation,
        })

        this.props.setPhase(AddEditPhase.Prompt)
    }

    render() {
        return (
            <>
                {!this.props.preparedRotation.domain &&
                    <Popup on={'click'} trigger={
                        <Button color={this.props.preparedRotation.domain ? 'green' : 'yellow'} icon
                                labelPosition={'left'}
                        >
                            <Icon name='edit'/> Update #{this.props.index}
                        </Button>
                    } pinned position={'bottom left'}>
                        <p>You must select a domain first</p>
                    </Popup>
                }

                {!!this.props.preparedRotation.domain &&
                    <Button color={'green'} icon labelPosition={'left'}
                            onClick={this.updateRotation}>
                        <Icon name={'edit'}/> Update #{this.props.index}
                    </Button>
                }
            </>
        )
    }
}