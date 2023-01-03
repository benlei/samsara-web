import {Input} from "semantic-ui-react";
import React from "react";

type Properties = {
    min: number
    max: number
    onChange: (num: number) => void
    invalidVal: number
    placeholder: string
    defaultValue: number
    disabled: boolean
}

type States = {
    num: string
}

export default class NumberRangeInput extends React.Component<Properties, States> {
    public static defaultProps = {
        min: 1,
        placeholder: null,
        defaultValue: -1,
        invalidVal: -1,
        disabled: false,
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
            this.props.onChange(this.props.invalidVal)
        } else {
            const num = Math.min(
                this.props.max,
                Math.max(parseInt(event.target.value), this.props.min)
            )
            this.setState({
                num: String(num)
            })
            this.props.onChange(num)
        }
    }

    render() {
        return (
            <Input
                type={'number'}
                placeholder={this.props.placeholder}
                value={this.state.num}
                onChange={this.changePosition}
                disabled={this.props.disabled}
            />
        )
    }
}