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
                    <div key={this.props.id} elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, width: '200px' }} >
                        <TextField multiline variant="outlined" placeholder={this.state.action.id == "default" ? "" : this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </div>
                )
            case 'cron':
                return (
                    <div key={this.props.id} elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, width: '200px' }} >
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
                    <div key={this.props.id} elevation={3} style={{ alignItems: 'center', display: 'flex', marginRight: 10, width: '200px' }} >
                        <TextField variant="outlined" placeholder={this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </div>
                )
            case 'select':
                return (
                    <Paper key={this.props.id} elevation={0} style={{ minWidth: 150, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, marginRight: 10 }} >
                        <FormControl style={{ minWidth: '200px' }} >
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
                    </Paper>
                )
            case 'colorpicker':
                return (
                    <Grid key={this.props.id} item xs={this.props.xs ? this.props.xs : 12} md={this.props.md ? this.props.md : 6} lg={this.props.lg ? this.props.lg : 5}>
                        <Card variant='outlined' style={{ padding: 10, borderColor: this.state.value, width: 250 }}>
                            {
                                this.props.label && this.props.label.length == 0 ? null :
                                    <Typography variant='body1' style={{ padding: 0, marginBottom: 5 }} >
                                        {this.props.label}
                                    </Typography>
                            }
                            <Grid container spacing={1}>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#d00a0a') }} style={{ height: 32, width: 32, backgroundColor: '#d00a0a', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#FF6900') }} style={{ height: 32, width: 32, backgroundColor: '#FF6900', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#FCB900') }} style={{ height: 32, width: 32, backgroundColor: '#FCB900', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#F9DE79') }} style={{ height: 32, width: 32, backgroundColor: '#F9DE79', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#F78DA7') }} style={{ height: 32, width: 32, backgroundColor: '#F78DA7', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#9900EF') }} style={{ height: 32, width: 32, backgroundColor: '#9900EF', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#0e60f4') }} style={{ height: 32, width: 32, backgroundColor: '#0e60f4', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#8ED1FC') }} style={{ height: 32, width: 32, backgroundColor: '#8ED1FC', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#11f4b8') }} style={{ height: 32, width: 32, backgroundColor: '#11f4b8', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateAction(this.state.action, '#53b909') }} style={{ height: 32, width: 32, backgroundColor: '#53b909', borderRadius: 4 }} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                )
            case 'slider':
                return (
                    <Grid key={this.props.id} item xs={this.props.xs ? this.props.xs :  12} md={this.props.md ? this.props.md : 6} lg={this.props.lg ? this.props.lg : 3}>
                        <Paper variant='outlined' style={{ minWidth: 150, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10 }} >
                            {
                                this.props.label && this.props.label.length == 0 ? null :
                                    <Typography variant='body1' style={{ padding: 0, marginRight: 15 }} >
                                        {this.props.label}
                                    </Typography>
                            }
                            <Slider
                                style={{ height: 7 }}
                                size={'small'}
                                height={20}
                                defaultValue={0}
                                valueLabelDisplay="auto"
                                orientation={'horizontal'}
                                min={parseInt(this.state.options.min)}
                                max={parseInt(this.state.options.max)}
                                step={parseInt(this.state.options.step)}
                                onChangeCommitted={(event, value) => { this.updateAction(this.state.action, value) }}
                            />
                        </Paper>
                    </Grid>
                )
            case 'checkbox':
                return (
                    <div key={this.props.id} elevation={3} style={{ height: "fit-content", alignSelf: 'center', borderWidth: 1, borderStyle: 'solid', borderRadius: 5, borderColor: 'rgba(255, 255, 255, 0.23)', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: this.props.flexDirection ? this.props.flexDirection : 'row', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15, marginRight: 10 }} >
                        {
                            this.state.action.id == "default" ? null :
                                <Typography variant='body1' style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', padding: 0 }}>
                                    {this.state.action.id}
                                </Typography>
                        }
                        <Checkbox defaultChecked={this.state.action.default} color='primary' onChange={(event, value) => { this.updateAction(this.state.action, value) }} />
                    </div>
                )
            case 'gallery':
                return (
                    <div key={this.props.id} style={{ marginRight: 10 }}>
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