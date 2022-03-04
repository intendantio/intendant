import React from 'react'
import { InputAdornment, Divider, TextField, Button, Popover, Checkbox, Fade, Paper, Typography, Modal, Slider, FormControl, Select, MenuItem, InputLabel, Card, CardActionArea, Grid } from '@mui/material'
import { TwitterPicker } from 'react-color'
import WeekSchedul from './WeekSchedul'
import { Remove, Add, Lens } from '@mui/icons-material'
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
            isMobile: false,
            currentIndexColor: 0,
            colors: ["#FFFFFF"]
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
                    <Grid key={this.props.id} item xs={this.props.xs ? this.props.xs : 12} md={this.props.md ? this.props.md : 6} lg={this.props.lg ? this.props.lg : 3}>
                        <TextField multiline style={{ minWidth: 150, width: '100%' }} variant="outlined" placeholder={this.state.action.id == "default" ? "" : this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </Grid>
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
                    <Grid key={this.props.id} item xs={this.props.xs ? this.props.xs : 12} md={this.props.md ? this.props.md : 6} lg={this.props.lg ? this.props.lg : 3}>
                        <TextField type='number' multiline style={{ minWidth: 150, width: '100%' }} variant="outlined" placeholder={this.state.action.id == "default" ? "" : this.state.action.id} onChange={(event) => { this.updateAction(this.state.action, event.currentTarget.value) }} />
                    </Grid>
                )
            case 'select':
                return (
                    <Grid key={this.props.id} item xs={this.props.xs ? this.props.xs : 12} md={this.props.md ? this.props.md : 6} lg={this.props.lg ? this.props.lg : 3}>
                        <FormControl style={{ minWidth: 150, width: '100%' }} >
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
                    </Grid>
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
            case 'gradientpicker':
                let items = []
                for (let index = 0; index < this.state.options.max; index++) {
                    items.push("#FFFFFF")
                }
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
                                    <CardActionArea onClick={() => { this.updateColor('#d00a0a') }} style={{ height: 32, width: 32, backgroundColor: '#d00a0a', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#FF6900') }} style={{ height: 32, width: 32, backgroundColor: '#FF6900', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#FCB900') }} style={{ height: 32, width: 32, backgroundColor: '#FCB900', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#F9DE79') }} style={{ height: 32, width: 32, backgroundColor: '#F9DE79', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#F78DA7') }} style={{ height: 32, width: 32, backgroundColor: '#F78DA7', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#9900EF') }} style={{ height: 32, width: 32, backgroundColor: '#9900EF', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#0e60f4') }} style={{ height: 32, width: 32, backgroundColor: '#0e60f4', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#8ED1FC') }} style={{ height: 32, width: 32, backgroundColor: '#8ED1FC', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#11f4b8') }} style={{ height: 32, width: 32, backgroundColor: '#11f4b8', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#53b909') }} style={{ height: 32, width: 32, backgroundColor: '#53b909', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#53b909') }} style={{ height: 32, width: 32, backgroundColor: '#53b909', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={2} md={2} lg={2}>
                                    <CardActionArea onClick={() => { this.updateColor('#53b909') }} style={{ height: 32, width: 32, backgroundColor: '#53b909', borderRadius: 4 }} />
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Divider />
                                 </Grid>
                                {
                                    this.state.colors.map((item, index) => {
                                        return (
                                            <Grid item xs={2} md={2} lg={2}>
                                                <CardActionArea onClick={() => { this.setState({currentIndexColor: index}) }} style={{ height: 32, width: 32, backgroundColor: item, borderRadius: 4, alignContent:'center',display:'flex', alignSelf: 'center' }} >
                                                {
                                                    this.state.currentIndexColor == index &&
                                                    <Typography variant='body1' style={{ color:'black'}} >
                                                        {"."}
                                                    </Typography>
                                                }
                                                </CardActionArea>
                                            </Grid>
                                        )
                                    })
                                }
                                <Grid item xs={12} md={12} lg={12}>
                                    <Divider />
                                 </Grid>
                                {
                                    <Grid item xs={2} md={2} lg={2}>
                                        <CardActionArea disabled={this.state.colors.length == 1} onClick={() => { this.removeColorOption() }} style={{ height: 32, width: 32, borderRadius: 4, alignContent:'center',display:'flex', alignSelf: 'center' }} >
                                            {
                                                this.state.colors.length == 1 ?
                                                <Remove style={{color:'#999999'}} /> : 
                                                <Remove color='primary' />
                                            }
                                        </CardActionArea>
                                    </Grid>
                                }
                                {
                                    <Grid item xs={2} md={2} lg={2}>
                                        <CardActionArea disabled={this.state.colors.length >= this.state.options.max} onClick={() => { this.addColorOption() }} style={{ height: 32, width: 32, borderRadius: 4, alignContent:'center',display:'flex', alignSelf: 'center' }} >
                                        {
                                                this.state.colors.length >= this.state.options.max ?
                                                <Add color='primary' style={{color:'#999999'}} /> : 
                                                <Add color='primary' />
                                            }
                                            
                                        </CardActionArea>
                                    </Grid>
                                }
                            </Grid>
                        </Card>
                    </Grid>
                )
            case 'slider':
                return (
                    <Grid key={this.props.id} item xs={this.props.xs ? this.props.xs : 12} md={this.props.md ? this.props.md : 6} lg={this.props.lg ? this.props.lg : 3}>
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
            default:
                return null
        }
    }

    updateColor(color) {
        let currentColors = this.state.colors
        currentColors[this.state.currentIndexColor] = color
        this.setState({colors: currentColors}, () => {
            this.updateAction(this.state.action, this.state.colors)
        })
    }

    removeColorOption() {
        let currentColors = this.state.colors
        currentColors.splice(this.state.currentIndexColor, 1)
        this.setState({
            colors: currentColors
        }, () => {
            if(this.state.currentIndexColor == currentColors.length) {
                this.setState({
                    currentIndexColor: this.state.currentIndexColor - 1
                })
            }
        })
    }

    addColorOption() {
        let currentColors = this.state.colors
        currentColors.unshift(currentColors[0])
        this.setState({
            colors: currentColors
        })
    }

}

export default Action