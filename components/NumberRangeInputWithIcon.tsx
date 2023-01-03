import {Input} from "semantic-ui-react";
import React from "react";

type Properties = {
    min: number
    max: number
    onSubmit: (number: number) => void
    placeholder: string
    color: string
    invalidColor: string
    icon: string
    defaultValue: number
}

type States = {
    num: string
}

export default class NumberRangeInputWithIcon extends React.Component<Properties, States> {
    public static defaultProps = {
        min: 1,
        placeholder: null,
        defaultValue: -1,
        invalidColor: 'yellow',
    }


    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            num: String(Math.min(
                this.props.max,
                Math.max(this.props.defaultValue, this.props.min)
            ))
        }
    }

    changePosition = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(parseInt(event.target.value))) {
            this.setState({
                num: event.target.value,
            })
        } else {
            this.setState({
                num: String(Math.min(
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
                    color: isNaN(parseInt(this.state.num)) ? this.props.invalidColor : this.props.color,
                    icon: this.props.icon,
                    onClick: () => {
                        if (isNaN(parseInt(this.state.num))) {
                            return
                        }

                        this.props.onSubmit(Math.min(
                            this.props.max,
                            Math.max(parseInt(this.state.num), this.props.min)
                        ))
                    },
                }}
                type={'number'}
                placeholder={this.props.placeholder}
                value={this.state.num}
                onChange={this.changePosition}
            />
        )
    }
}