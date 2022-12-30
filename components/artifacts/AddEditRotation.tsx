import {Table} from "semantic-ui-react";
import React from "react";
import {ArtifactRotationData} from "@/artifacts/types";
import AddEditPrompt from "@/components/artifacts/AddEditPrompt";
import AddEditDomain from "./AddEditDomain";

enum Phase {
    Prompt,
    Domain,
    Team,
    Characters,
    Save,
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
    selectedDomain: string
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
            phase: Phase.Prompt,
            selectedDomain: "",
        }
    }

    addClicked = () => {
        this.setState({phase: Phase.Domain})
    }

    cancelClicked = () => {
        this.setState({
            selectedDomain: "",
            phase: Phase.Prompt,
        })
    }

    selectDomain = (domain: string) => {
        this.setState({selectedDomain: this.state.selectedDomain === domain ? "" : domain})
    }


    render() {
        return (
            <Table.Row>
                <Table.Cell verticalAlign={'top'} colSpan={4} textAlign={'center'}>
                    {this.state.phase == Phase.Prompt &&
                        <AddEditPrompt
                            deletable={this.props.deletable}
                            syncable={this.props.syncable}
                            editable={this.props.editable}
                            index={this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index}
                            onAddClicked={this.addClicked}
                        />
                    }
                    {this.state.phase == Phase.Domain &&
                        <AddEditDomain
                            data={this.props.data}
                            onClickDomain={this.selectDomain}
                            onCancel={this.cancelClicked}
                            selectedDomain={this.state.selectedDomain}
                        />
                        // <>
                        //     <AddEditTeam data={this.props.data.rotations}
                        //                  characters={this.props.data.characters}/>
                        //     <Form.Group inline style={{marginTop: '1em', textAlign: 'left'}}>
                        //         <Form.Field>
                        //             <Button color={'green'}>
                        //                 Create
                        //             </Button>
                        //             <Button color={'red'} onClick={this.cancelClicked}>
                        //                 Cancel
                        //             </Button>
                        //         </Form.Field>
                        //     </Form.Group>
                        // </>
                    }
                </Table.Cell>
            </Table.Row>
        )
    }
}

