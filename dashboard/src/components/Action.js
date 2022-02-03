import React from 'react'
import { InputAdornment, IconButton, TextField, Button, Popover, Checkbox, Fade, Paper, Typography, Modal, Slider, FormControl, Select, MenuItem, InputLabel, Card, CardActionArea, Grid } from '@mui/material'
import { TwitterPicker } from 'react-color'
import WeekSchedul from './WeekSchedul'
import { Delete, List } from '@mui/icons-material'
import GalleryList from './GalleryList'
import Theme from '../Theme'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: Theme.palette.background.paper,
    padding: 10,
    borderRadius: 5
}

class Action extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            action: this.props.action,
            setState: this.props.setState,
            options: this.props.options ? this.props.options : {},
            modal: false,
            value: "",
            isMobile: false
        }
    }



    updateAction(action, value) {
        let tmp = {}
        tmp[this.props.id] = value
        this.state.setState(tmp)
        this.setState({
            value: value
        })
    }

    render() {
        switch (this.state.action.type) {
            case 'text':
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, width: '200px' }} >
                        <TextField multiline variant="outlined" placeholder={this.state.action.id == "default" ? "" : this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </div>
                )
            case 'cron':
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, width: '200px' }} >
                        <Modal open={this.state.modal} onClose={() => { this.setState({ modal: false }) }} >
                            <Fade in={this.state.modal} >
                                <Paper style={style}>
                                    <WeekSchedul noChangeMode onChange={(value) => { this.updateAction(this.state.action, value); this.setState({ value: value }) }} onChangeMode={() => { }} />
                                </Paper>
                            </Fade>
                        </Modal>
                        <Button color='inherit' variant='outlined' style={{ flexDirection: 'column', width: '200px' }} size='large' onClick={() => { this.setState({ modal: true }) }}>
                            <Typography style={{ fontSize: this.state.value.length > 0 ? 12 : 14, padding: 8, color: this.state.value.length > 0 ? 'white' : 'rgba(255, 255, 255, 0.6)' }}>
                                {this.state.value.length == 0 ? this.state.action.id == "default" ? "" : this.state.action.id : this.state.value}
                            </Typography>
                        </Button>
                    </div>
                )
            case 'number':
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, width: '200px' }} >
                        <TextField variant="outlined" placeholder={this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </div>
                )
            case 'select':
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10 }} >
                        <FormControl variant="outlined" style={{ minWidth: '200px' }} >
                            {
                                this.state.action.id == "default" || this.props.noLabel ? null :
                                    <InputLabel>{this.state.action.id}</InputLabel>
                            }
                            <Select value={this.state.value} onChange={(event) => { this.setState({ value: event.target.value }); this.updateAction(this.state.action, event.target.value) }} label={this.state.action.id == "default" ? null : this.state.action.id} >
                                {
                                    this.state.action.values.map((value, index) => {
                                        if (typeof value == 'object') {
                                            return <MenuItem key={index} value={value.id} >{value.reference}</MenuItem>
                                        } else {
                                            return <MenuItem key={index} value={value} >{value}</MenuItem>
                                        }
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                )
            case 'colorpicker':
                return (
                   <Card variant='outlined' style={{padding: 10, borderColor: this.state.value, width: 250}}>
                       {
                            this.props.label && this.props.label.length == 0 ? null :
                                <Typography variant='body1' style={{ padding: 0, marginBottom: 5  }} >
                                    {this.props.label}
                                </Typography>
                        }
                            <Grid container spacing={1}>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#d00a0a')}} style={{height: 32, width: 32, backgroundColor: '#d00a0a', borderRadius: 4}}/>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#FF6900')}} style={{height: 32, width: 32, backgroundColor: '#FF6900', borderRadius: 4}}/>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#FCB900')}} style={{height: 32, width: 32, backgroundColor: '#FCB900', borderRadius: 4}}/>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#F9DE79')}} style={{height: 32, width: 32, backgroundColor: '#F9DE79', borderRadius: 4}}/>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#F78DA7')}} style={{height: 32, width: 32, backgroundColor: '#F78DA7', borderRadius: 4}}/>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#9900EF')}} style={{height: 32, width: 32, backgroundColor: '#9900EF', borderRadius: 4}}/>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#0e60f4')}} style={{height: 32, width: 32, backgroundColor: '#0e60f4', borderRadius: 4}}/>
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#8ED1FC')}} style={{height: 32, width: 32, backgroundColor: '#8ED1FC', borderRadius: 4}} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#11f4b8')}} style={{height: 32, width: 32, backgroundColor: '#11f4b8', borderRadius: 4}} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}> 
                                    <CardActionArea onClick={() => {this.updateAction(this.state.action,'#53b909')}} style={{height: 32, width: 32, backgroundColor: '#53b909', borderRadius: 4}} />
                                </Grid>
                            </Grid>
                        </Card>
                )
            case 'slider':
                return (
                    <Paper variant='outlined' elevation={1} style={{ minWidth: 150, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, marginRight: 10 }} >
                        {
                            this.props.label && this.props.label.length == 0 ? null :
                                <Typography variant='body1' style={{ padding: 0, marginRight: 15  }} >
                                    {this.props.label}
                                </Typography>
                        }
                        <Slider
                            size={'small'}
                            defaultValue={0}
                            valueLabelDisplay="auto"
                            orientation={'horizontal'}
                            min={parseInt(this.state.options.min)}
                            max={parseInt(this.state.options.max)}
                            step={parseInt(this.state.options.step)}
                            onChange={(event, value) => { this.updateAction(this.state.action, value) }}
                        />
                    </Paper>
                )
            case 'checkbox':
                return (
                    <div elevation={3} style={{ height: "fit-content", alignSelf: 'center', borderWidth: 1, borderStyle: 'solid', borderRadius: 5, borderColor: 'rgba(255, 255, 255, 0.23)', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: this.props.flexDirection ? this.props.flexDirection : 'row', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, marginRight: 10 }} >
                        {
                            this.state.action.id == "default" ? null :
                                <Typography variant='body1' style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', padding: 0 }}>
                                    {this.state.action.id}
                                </Typography>
                        }
                        <Checkbox defaultChecked={this.state.action.default} color='primary' onChange={(event, value) => { this.updateAction(this.state.action, value) }} />
                    </div>
                )
            case 'oauth2':
                let url = this.state.action.url.replace("%local%",
                    window.location.origin +
                    "/admin/smartobject/redirect/" +
                    window.btoa(
                        JSON.stringify(this.props.object)
                    )
                )
                return (
                    <div elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, marginTop: 10, width: '200px' }} >
                        <Button color='inherit' disabled={this.props.isDisabled} variant='outlined' style={{ flexDirection: 'column', width: '200px' }} size='small' onClick={() => { window.location.replace(url) }}>
                            <Typography style={{ fontSize: 12, fontWeight: 'bold', padding: 8, color: this.props.isDisabled ? 'rgba(255, 255, 255, 0.6)' : 'white' }}>
                                {this.props.isDisabled ? "Missing reference or localisation" : this.state.action.name}
                            </Typography>
                        </Button>
                    </div>
                )
            case 'gallery':
                return (
                    <div style={{ marginRight: 10 }}>
                        <TextField
                            onChange={(event) => { this.setState({ value: event.nativeEvent.target.value, modal: false }); this.updateAction(this.state.action, event.nativeEvent.target.value) }}
                            label="Icon"
                            variant="outlined"
                            value={this.state.value}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => { this.setState({ modal: true }) }} style={{ margin: 0, padding: 0 }}>
                                            <List />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Popover
                            open={this.state.modal}
                            onClose={() => { this.setState({ modal: false }) }}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <GalleryList onSelect={(icon) => { this.setState({ icon: icon, modal: false }); this.updateAction(this.state.action, icon) }} action={this.state.action} />
                        </Popover>
                    </div>
                )
            default:
                return null
        }
    }

}

export default Action