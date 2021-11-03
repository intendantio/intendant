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
                    <div elevation={3} style={{ alignItems: 'flex-start', display: 'flex', padding: 10, marginRight: 5, flexDirection: this.props.flexDirection ? this.props.flexDirection : 'row' }} >
                        <TwitterPicker
                            styles={{padding: 0}}
                            colors={['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']}
                            triangle='hide'
                            color={this.state.value}
                            onChangeComplete={(color) => { this.updateAction(this.state.action, color.hex) }}
                        />
                    </div>
                )
            case 'slider':
                return (
                    <div elevation={3} style={{height: "fit-content", alignSelf: 'center',borderWidth: 1,borderStyle:'solid', borderRadius: 5, borderColor: 'rgba(255, 255, 255, 0.23)', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: this.props.flexDirection ? this.props.flexDirection : 'row', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, marginRight: 10 }} >
                        <Typography variant='body1' style={{ textAlign: 'center',color: 'rgba(255, 255, 255, 0.5)', padding: 0}} >
                            {this.state.action.id}
                        </Typography>
                        <div style={{marginBottom: 2, marginTop: 2}} />
                        <Slider
                            defaultValue={0}
                            valueLabelDisplay="auto"
                            orientation={this.props.orientation ? this.props.orientation : 'horizontal'}
                            min={this.state.action.min}
                            max={this.state.action.max}
                            step={this.state.action.step}
                            onChange={(event, value) => { this.updateAction(this.state.action, value) }}
                        />
                    </div>
                )
            case 'checkbox':
                return (
                    <div elevation={3} style={{height: "fit-content", alignSelf: 'center',borderWidth: 1,borderStyle:'solid', borderRadius: 5, borderColor: 'rgba(255, 255, 255, 0.23)', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: this.props.flexDirection ? this.props.flexDirection : 'row', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, marginRight: 10 }} >
                        <Typography variant='body1' style={{ textAlign: 'center',color: 'rgba(255, 255, 255, 0.5)', padding: 0}}>
                            {this.state.action.id}
                        </Typography>
                        <Checkbox defaultChecked={this.state.action.default} color='primary' onChange={(event,value) => {this.updateAction(this.state.action, value)}} />
                    </div>
                )
            default:
                return null
        }
    }

}

export default Action