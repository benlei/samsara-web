import {Table} from "semantic-ui-react";
import React from "react";
import {AddEdit, AddEditSharedProperties, ArtifactRotationData, Rotation, RotationsManager} from "@/artifacts/types";
import AddEditPrompt from "@/components/artifacts/addEdit/AddEditPrompt";
import AddEditDomain from "./AddEditDomain";
import {AddEditPhase} from "@/artifacts/enums";
import AddEditIntendedCharacters from "@/components/artifacts/addEdit/AddEditIntendedCharacters";
import AddEditInfo from "@/components/artifacts/addEdit/AddEditInfo";
import AddEditSubmit from "@/components/artifacts/addEdit/AddEditSubmit";
import AddEditMenu from "@/components/artifacts/addEdit/AddEditMenu";


type Properties = {
    index: number
    editable: boolean
    deletable: boolean
    syncable: boolean
    movable: boolean
    data: ArtifactRotationData
    rotationsManager: RotationsManager
}

type States = {
    phase: AddEditPhase
    // selectedDomain: string
    preparedRotation: Rotation
    addEdit: AddEdit
}

export default class AddEditRotation extends React.Component<Properties, States> {
    public static defaultProps = {
        editable: true,
        deletable: true,
        syncable: true,
        movable: true,
    };

    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            phase: AddEditPhase.Prompt,
            preparedRotation: this.getBaseRotation(),
            addEdit: AddEdit.Add,
        }
    }

    getBaseRotation = (): Rotation => {
        return {
            domain: "",
            characters: [],
            note: "",
            days: this.props.data.rotations.fixedDays,
        }
    }

    addClicked = () => {
        this.setState({
            phase: AddEditPhase.Domain,
            addEdit: AddEdit.Add,
            preparedRotation: this.getBaseRotation(),
        })
    }

    editClicked = () => {
        this.setState({
            phase: AddEditPhase.Domain,
            addEdit: AddEdit.Edit,
            preparedRotation: {
                ...this.props.data.rotations.data[this.props.index],
            }
        })
    }

    setPhase = (phase: AddEditPhase) => this.setState({phase: phase})

    cancelClicked = () => {
        this.setState({
            // selectedDomain: "",
            phase: AddEditPhase.Prompt,
            preparedRotation: this.getBaseRotation(),
        })
    }

    deleteRotation = () => {
        this.props.rotationsManager.delete(this.props.index)
    }

    updatePreparedRotation = (rotation: Rotation) => {
        this.setState({preparedRotation: rotation})
    }

    moveRotation = (position: number) => {
        this.props.rotationsManager.move(this.props.index, position - 1)
    }

    render() {
        const addEditButtonsProperties: AddEditSharedProperties = {
            addEdit: this.state.addEdit,
            data: this.props.data,
            updatePreparedRotation: this.updatePreparedRotation,
            setPhase: this.setPhase,
            onCancel: this.cancelClicked,
            preparedRotation: this.state.preparedRotation,
            index: this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index,
            manager: this.props.rotationsManager,
        }

        return (
            <Table.Row>
                <Table.Cell verticalAlign={'top'} colSpan={4} textAlign={'center'}>
                    {this.state.phase == AddEditPhase.Prompt ? (
                        <AddEditPrompt
                            data={this.props.data.rotations}
                            deletable={this.props.deletable}
                            syncable={this.props.syncable}
                            editable={this.props.editable}
                            movable={this.props.movable}
                            index={this.props.index}
                            onAddClicked={this.addClicked}
                            onEditClicked={this.editClicked}
                            onDeleteClicked={this.deleteRotation}
                            onMoveClicked={this.moveRotation}
                        />
                    ) : (
                        <>
                            <AddEditMenu phase={this.state.phase} {...addEditButtonsProperties} />
                            {this.state.phase == AddEditPhase.Domain &&
                                <AddEditDomain {...addEditButtonsProperties}/>
                            }
                            {this.state.phase == AddEditPhase.Characters &&
                                <AddEditIntendedCharacters {...addEditButtonsProperties} />
                            }
                            {this.state.phase == AddEditPhase.Info &&
                                <AddEditInfo {...addEditButtonsProperties} />
                            }
                            <AddEditSubmit {...addEditButtonsProperties}/>
                        </>
                    )}
                </Table.Cell>
            </Table.Row>
        )
    }
}

