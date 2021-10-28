import React from 'react'
import { TextField, Paper, Checkbox, Typography, Slider, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import { TwitterPicker } from 'react-color'

class Action extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            action: this.props.action,
            setState: this.props.setState,
            value: this.props.action.default
        }
    }

    updateAction(action, value) {
        let tmp = {}
        tmp["argument-" + action.id] = value
        this.state.setState(tmp)
        this.setState({
            value: value
        })
    }

    render() {
        switch (this.state.action.type) {
            case 'text':
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, minWidth: '150px' }} >
                        <TextField variant="outlined" placeholder={this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </div>
                )
            case 'number':
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, minWidth: '150px' }} >
                        <TextField variant="outlined" placeholder={this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </div>
                )
            case 'select':
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10 }} >
                        <FormControl variant="outlined" style={{ width: '150px' }} >
                            <InputLabel>{this.state.action.id}</InputLabel>
                            <Select onChange={(event) => { this.updateAction(this.state.action, event.target.value) }} label={this.state.action.id} >
                                {
                                    this.state.action.values.map(value => {
                                        return <MenuItem value={value} >{value}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                )
            case 'colorpicker':
                return (
                    <Paper elevation={3} style={{ alignItems: 'flex-start', display: 'flex', padding: 10, marginRight: 5, flexDirection: this.props.flexDirection ? this.props.flexDirection : 'row' }} >
                        <TwitterPicker
                            triangle='hide'
                            color={this.state.value}
                            onChangeComplete={(color) => { this.updateAction(this.state.action, color.hex) }}
                        />
                    </Paper>
                )
            case 'slider':
                return (
                    <Paper elevation={3} style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: this.props.flexDirection ? this.props.flexDirection : 'row', padding: 10, marginRight: 5 }} >
                        <Typography variant='body1' style={{ textAlign: 'start', marginBottom: 5 }}>
                            {this.state.action.id.toUpperCase()}
                        </Typography>
                        <Slider
                            defaultValue={0}
                            valueLabelDisplay="auto"
                            orientation={this.props.orientation ? this.props.orientation : 'horizontal'}
                            min={this.state.action.min}
                            max={this.state.action.max}
                            step={this.state.action.step}
                            onChange={(event, value) => { this.updateAction(this.state.action, value) }}
                        />
                    </Paper>
                )
            case 'checkbox':
                return (
                    <Paper elevation={3} style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row', padding: 10, marginRight: 5 }} >
                        <Typography variant='body1' style={{ textAlign: 'start', marginBottom: 5 }}>
                            {this.state.action.id.toUpperCase()}
                        </Typography>
                        <Checkbox defaultChecked={this.state.action.default} onChange={(event,value) => {this.updateAction(this.state.action, value)}} />
                    </Paper>
                )
            default:
                return null
        }
    }

}

export default Action