import {Input} from "semantic-ui-react";
import React from "react";

type Properties = {
    min: number
    max: number
    onSubmit: (position: number) => void
    placeholder: string
    color: string
    invalidColor: string
    icon: string
    defaultValue: number
}

type States = {
    position: string
}

export default class NumberRangeInput extends React.Component<Properties, States> {
    public static defaultProps = {
        min: 1,
        placeholder: null,
        defaultValue: -1,
        invalidColor: 'yellow',
    }


    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            position: String(Math.min(
                this.props.max,
                Math.max(this.props.defaultValue, this.props.min)
            ))
        }
    }

    changePosition = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(parseInt(event.target.value))) {
            this.setState({
                position: event.target.value,
            })
        } else {
            this.setState({
                position: String(Math.min(
                    this.props.max,
                    Math.max(parseInt(event.target.value), this.props.min)
                ))
            })
        }

    }

    render() {
        return (
            <Input
                action={{
                    color: isNaN(parseInt(this.state.position)) ? this.props.invalidColor : this.props.color,
                    icon: this.props.icon,
                    onClick: () => {
                        if (isNaN(parseInt(this.state.position))) {
                            return
                        }

                        this.props.onSubmit(Math.min(
                            this.props.max,
                            Math.max(parseInt(this.state.position), this.props.min)
                        ))
                    },
                }}
                type={'number'}
                placeholder={this.props.placeholder}
                value={this.state.position}
                onChange={this.changePosition}
            />
        )
    }
}