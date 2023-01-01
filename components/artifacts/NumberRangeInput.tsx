import {Input} from "semantic-ui-react";
import React from "react";

type Properties = {
    min: number
    max: number
    onSubmit: (position: number) => void
    placeholder: string
    color: string
    icon: string
    defaultValue: number
}

type States = {
    position: number
}

export default class NumberRangeInput extends React.Component<Properties, States> {
    public static defaultProps = {
        min: 1,
        placeholder: null,
        defaultValue: -1
    }


    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            position: Math.min(
                this.props.max,
                Math.max(this.props.defaultValue, this.props.min)
            )
        }
    }

    changePosition = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            this.setState({
                position: Math.min(
                    this.props.max,
                    Math.max(parseInt(event.target.value) || this.state.position, this.props.min)
                )
            });
        } catch (ignore) {

        }
    }

    render() {
        return (
            <Input
                action={{
                    color: this.props.color,
                    icon: this.props.icon,
                    onClick: () => this.props.onSubmit(this.state.position),
                }}
                placeholder={this.props.placeholder}
                value={this.state.position}
                onChange={this.changePosition}
            />
        )
    }
}