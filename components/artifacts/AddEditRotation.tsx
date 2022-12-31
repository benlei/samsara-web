import {Table} from "semantic-ui-react";
import React from "react";
import {ArtifactRotationData, Rotation, RotationsManager} from "@/artifacts/types";
import AddEditPrompt from "@/components/artifacts/AddEditPrompt";
import AddEditDomain from "./AddEditDomain";
import {AddEditPhase} from "@/artifacts/enums";
import AddEditIntendedCharacters from "@/components/artifacts/AddEditIntendedCharacters";


type Properties = {
    index: number
    editable: boolean
    deletable: boolean
    syncable: boolean
    data: ArtifactRotationData
    rotationsManager: RotationsManager
}

type States = {
    phase: AddEditPhase
    // selectedDomain: string
    preparedRotation: Rotation
}

export default class AddEditRotation extends React.Component<Properties, States> {
    public static defaultProps = {
        editable: true,
        deletable: true,
        syncable: true,
    };

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            phase: AddEditPhase.Prompt,
            preparedRotation: {
                "domain": "",
                "characters": [],
                "note": "",
            },
        }
    }

    addClicked = () => {
        this.setState({phase: AddEditPhase.Domain})
    }

    setPhase = (phase: AddEditPhase) => this.setState({phase: phase})

    cancelClicked = () => {
        this.setState({
            // selectedDomain: "",
            phase: AddEditPhase.Prompt,
            preparedRotation: {
                "domain": "",
                "characters": [],
                "note": "",
            },
        })
    }

    deleteRotation = () => {
        this.props.rotationsManager.delete(this.props.index)
    }

    updatePreparedRotation = (rotation: Rotation) => {
        this.setState({preparedRotation: rotation})
    }


    render() {
        return (
            <Table.Row>
                <Table.Cell verticalAlign={'top'} colSpan={4} textAlign={'center'}>
                    {this.state.phase == AddEditPhase.Prompt &&
                        <AddEditPrompt
                            deletable={this.props.deletable}
                            syncable={this.props.syncable}
                            editable={this.props.editable}
                            index={this.props.index}
                            onAddClicked={this.addClicked}
                            onDeleteClicked={this.deleteRotation}
                        />
                    }
                    {this.state.phase == AddEditPhase.Domain &&
                        <AddEditDomain
                            data={this.props.data}
                            updateRotation={this.updatePreparedRotation}
                            setPhase={this.setPhase}
                            onCancel={this.cancelClicked}
                            preparedRotation={this.state.preparedRotation}
                            index={this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index}
                            manager={this.props.rotationsManager}
                        />
                    }

                    {this.state.phase == AddEditPhase.Characters &&
                        <AddEditIntendedCharacters
                            data={this.props.data}
                            updateRotation={this.updatePreparedRotation}
                            setPhase={this.setPhase}
                            onCancel={this.cancelClicked}
                            preparedRotation={this.state.preparedRotation}
                            index={this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index}
                            manager={this.props.rotationsManager}
                        />
                    }
                </Table.Cell>
            </Table.Row>
        )
    }
}

