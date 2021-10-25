import React from 'react'
import { TextField, Button, IconButton } from '@material-ui/core'
import { Save, Cached } from '@material-ui/icons'

class Week extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value: "",
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            friday: false,
            saturday: false,
            time: ""
        }
    }

    calculate() {
        let timeSplit = this.state.time.split(":")
        if(timeSplit.length != 2) { return }
        let value = '0 ' + timeSplit[1] + ' ' +  timeSplit[0]  + ' * * ' +  
        
            (this.state.sunday ? "0," : "") +
            (this.state.monday ? "2," : "") +
            (this.state.tuesday ? "3," : "") +
            (this.state.wednesday ? "4," : "") +
            (this.state.friday ? "5," : "") +
            (this.state.saturday ? "6," : "");

        value = value.slice(0,value.length - 1 );


        if((parseInt(timeSplit[1]) + parseInt(timeSplit[0]) * 60) > 1440 ) {
            this.setState({
                time: ""
            })
            return
        } else {
            this.props.onChange(value)
        }
    }

    render() {
        return (<div style={{ display: 'flex', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <IconButton size='small' onClick={() => { this.props.onChangeMode() }} variant='outlined'>
                        <Cached />
                    </IconButton>
                </div>
                <div style={{ flex: 3, textAlign: 'center', marginRight: 3, marginLeft: 3 }}>
                    <Button fullWidth variant={this.state.sunday ? 'contained' : 'outlined'} onClick={() => {this.setState({sunday: !this.state.sunday},() => {this.calculate()})}}  >{"Sunday"}</Button>
                </div>
                <div style={{ flex: 3, textAlign: 'center', marginRight: 3, marginLeft: 3 }}>
                    <Button fullWidth variant={this.state.monday ? 'contained' : 'outlined'} onClick={() => {this.setState({monday: !this.state.monday},() => {this.calculate()})}} >{"Monday"}</Button>
                </div>
                <div style={{ flex: 3, textAlign: 'center', marginRight: 3, marginLeft: 3 }}>
                    <Button fullWidth variant={this.state.tuesday ? 'contained' : 'outlined'} onClick={() => {this.setState({tuesday: !this.state.tuesday},() => {this.calculate()})}} >{"Tuesday"}</Button>
                </div>
                <div style={{ flex: 3, textAlign: 'center', marginRight: 3, marginLeft: 3 }}>
                    <Button fullWidth variant={this.state.wednesday ? 'contained' : 'outlined'} onClick={() => {this.setState({wednesday: !this.state.wednesday},() => {this.calculate()})}} >{"Wednesday"}</Button>
                </div>
                <div style={{ flex: 3, textAlign: 'center', marginRight: 3, marginLeft: 3 }}>
                    <Button fullWidth variant={this.state.thursday ? 'contained' : 'outlined'} onClick={() => {this.setState({thursday: !this.state.thursday},() => {this.calculate()})}} >{"Thursday"}</Button>
                </div>
                <div style={{ flex: 3, textAlign: 'center', marginRight: 3, marginLeft: 3 }}>
                    <Button fullWidth variant={this.state.friday ? 'contained' : 'outlined'} onClick={() => {this.setState({friday: !this.state.friday},() => {this.calculate()})}} >{"Friday"}</Button>
                </div>
                <div style={{ flex: 3, textAlign: 'center', marginRight: 3, marginLeft: 3 }}>
                    <Button fullWidth variant={this.state.saturday ? 'contained' : 'outlined'} onClick={() => {this.setState({saturday: !this.state.saturday},() => {this.calculate()})}} >{"Saturday"}</Button>
                </div>
                <div style={{ flex: 3 }}>
                    <TextField size='small' value={this.state.time}  onChange={(event) => { this.setState({ time: event.currentTarget.value },() => {this.calculate()}) }}  placeholder='hh:mm' variant='outlined' />
                </div>
            </div>
        </div>
        )
    }

}

export default Week