import React from 'react'
import JSONPretty from 'react-json-pretty'

import { Grid, Switch, ListItem, FormControlLabel, Card, CardActionArea, IconButton, TableHead, TextField, Typography, Paper, Divider, TableBody, TableContainer, TableCell, Table, TableRow, FormControl, Select, Button } from '@mui/material'

import { ToggleOff, Close, Delete, Autorenew, ToggleOn, RadioButtonChecked } from '@mui/icons-material'

import Alert from '../../../components/Alert'
import Action from '../../../components/Action'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import Source from '../../../utils/Source'
import DeleteButton from '../../../components/views/DeleteButton'
import Loading from '../../../components/Loading'

class DetailProcess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            process: {
                state: "",
                mode: "",
                description: "",
                description_on: "",
                description_off: "",
                inputs: [],
                profiles: []
            },
            profiles: [],
            executeInformation: "",
            referenceInput: "",
            nameInput: "",
            typeInput: "",
            modeInput: 0,
            action: "",
            source: "",
            loading: true,
            isChecked: false,
            sources: []
        }
        props.setTitle("Process")
        props.setActionType("return")
    }


    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let result = await new Request().get().fetch("/api/processes/" + this.state.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
            this.props.history.push('/process')
        } else {
            this.setState({
                process: result.data,
                profiles: resultProfile.data,
                loading: false
            })
        }
    }

    setSource(id) {
        let fSource = false
        this.state.sources.forEach(source => {
            if (source.id === id) { fSource = source }
        })
        this.setState({ source: fSource })
    }

    setAction(id) {
        let fAction = false
        this.state.source.actions.forEach(action => {
            if (action.id === id) { fAction = action }
        })
        this.setState({ action: fAction })
    }


    async delete(id) {
        let result = await new Request().delete().fetch("/api/processes/" + id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/process')
        }
    }

    async executeAction() {
        this.setState({ loading: true })
        let resetState = {}
        let tmp = {}
        for (let index = 0; index < this.state.process.inputs.length; index++) {
            let input = this.state.process.inputs[index];
            let value = this.state[input.id]
            resetState[input.id] = null
            if (value) {
                tmp[input.reference] = value
            } else {
                tmp[input.reference] = null
            }
        }
        let result = await new Request().post({ inputs: tmp }).fetch("/api/processes/" + this.state.process.id + "/execute")
        if (result.error) {
            this.setState({ loading: false })
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState(resetState)
            if (result.data) {
                this.setState({ executeInformation: JSON.stringify(result.data) })
            }
            this.componentDidMount()
        }
    }

    async insertProfile(process, profile) {
        let result = await new Request().post({ idProfile: profile.id, }).fetch("/api/processes/" + process.id + "/profiles")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(process, profile) {
        let result = await new Request().delete().fetch("/api/processes/" + process.id + "/profiles/" + profile.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }


    updateAction(action, value) {
        let tmp = {}
        tmp[action.id] = value
        this.setState(tmp)
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Process</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Execute action</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Card variant='outlined' style={{ padding: 12 }}>
                                <Typography variant='subtitle1'>{String.capitalizeFirstLetter(this.state.process.description)}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Card elevation={3} >
                                <Button variant='contained' onClick={() => { this.executeAction() }} style={{ width: '100%', padding: 10, flexDirection: 'row', display: 'flex' }}>
                                    {
                                        this.state.process.mode == "button" ?
                                            <RadioButtonChecked fontSize='large' style={{ marginRight: 16 }} /> :

                                            this.state.process.state == "on" ?
                                                <ToggleOn fontSize='large' style={{ marginRight: 16 }} />
                                                :
                                                <ToggleOff fontSize='large' style={{ marginRight: 16 }} />
                                    }
                                    {
                                        this.state.process.mode == "button" ?
                                            <Typography textAlign='center' variant='subtitle1'>{String.capitalizeFirstLetter(this.state.process.description_on)}</Typography>
                                            :
                                            this.state.process.state == "on" ?
                                                <Typography textAlign='center' variant='subtitle1'>{String.capitalizeFirstLetter(this.state.process.description_on)}</Typography>
                                                :
                                                <Typography textAlign='center' variant='subtitle1'>{String.capitalizeFirstLetter(this.state.process.description_off)}</Typography>
                                    }
                                </Button>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={9} lg={9}>
                            <Card variant='outlined' style={{ padding: 12 }}>
                                <Grid container spacing={1}>
                                    {
                                        this.state.process.inputs.filter(input => input.state == this.state.process.state).length == 0 ?
                                            <Grid item xs={12} md={12} lg={12}>
                                                <Typography variant='subtitle1' color="text.secondary" >No input</Typography>
                                            </Grid>
                                            :
                                            this.state.process.inputs.filter(input => input.state == this.state.process.state).map((input, index) => {
                                                return (
                                                    <Grid item xs={12} md={6} lg={4}>
                                                        <Action options={input.options} label={String.capitalizeFirstLetter(input.reference.split("_")[0])} setState={this.setState.bind(this)} id={input.id} action={input} />
                                                    </Grid>
                                                )
                                            })
                                    }
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <Card variant='outlined' style={{ padding: 12 }}>
                                {
                                    this.state.profiles.map((profile, index) => {
                                        let state = false
                                        this.state.process.profiles.forEach(pprofile => {
                                            if (pprofile.profile == profile.id) {
                                                state = true
                                            }
                                        })
                                        return (
                                            <ListItem key={index} style={{ padding: 1 }}  >
                                                <FormControlLabel control={
                                                    <Switch
                                                        checked={state}
                                                        onChange={() => {
                                                            state ? this.deleteProfile(this.state.process, profile) : this.insertProfile(this.state.process, profile)
                                                        }}
                                                        color="primary"
                                                    />
                                                } label={profile.name} />
                                            </ListItem>
                                        )
                                    })
                                }
                            </Card>
                        </Grid>
                    </Grid>
                    <DeleteButton onClick={() => { this.delete(this.state.process.id) }} />
                </Loading>
            </>
        )
    }
}

export default DetailProcess