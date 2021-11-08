import React from 'react'
import md5 from 'md5'
import JSONPretty from 'react-json-pretty'

import { Alert } from '@material-ui/lab'
import { Close } from '@material-ui/icons'
import { Paper, Typography, Divider, Button, IconButton } from '@material-ui/core'
import AlertComponent from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

class Detail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hashId: props.match.params.id,
            loading: null,
            module: null,
            enabled: false,
            message: "",
            executeInformation: ""
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/configurations/module")
        if (result.error) {
            this.setState({
                enabled: true,
                message: result.package + " : " + result.message
            })
            this.props.history.push('/module')
        } else {
            let _module = false
            result.data.forEach(pModule => {
                if (md5(pModule.name) == this.state.hashId) {
                    _module = pModule
                }
            })
            if (_module) {
                this.setState({
                    module: _module
                })
            } else {
                this.props.history.push('/module')
            }
        }
        this.setState({ loading: null })
    }

    async executeAction(action, settings) {
        this.setState({ loading: action })
        let tmp = {}
        for (let index = 0; index < settings.length; index++) {
            let argument = settings[index];
            let value = this.state["argument-" + argument.id]
            if (value == undefined) {
                value = argument.default
            }
            tmp[argument.id] = value
        }
        let result = await new Request().post({ settings: tmp, reference: this.state.module.reference }).fetch("/api/modules/" + md5(this.state.module.name) + "/actions/" + action)
        if (result.error) {
            this.setState({
                enabled: true,
                message: result.package + " : " + result.message
            })
            this.setState({ loading: null })
        } else {
            if (result.data) {
                this.setState({
                    executeInformation: JSON.stringify(result.data)
                })
            }
            this.componentDidMount()
        }
    }

    render() {
        if (this.state.module) {
            return (
                <div>
                    <Paper elevation={2} style={{ padding: 10, marginBottom: 10, justifyContent: 'left' }}>
                        <div style={{ padding: 10 }}>
                            <Typography variant='h4' >
                                {this.state.module.name.split("/")[1]}
                            </Typography>
                            <Typography variant='subtitle1' >
                                {this.state.module.name}
                            </Typography>
                        </div>
                        <Divider />
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            {
                                this.state.module.actions.map(action => {
                                    return (
                                        <Paper style={{ marginTop: 10, marginBottom: 10, display: 'flex', flexDirection: 'column', padding: 10 }}>
                                            <Button disabled={this.state.loading == action.id} onClick={() => { this.executeAction(action.id, action.settings) }} variant={this.state.loading == action.id ? 'contained' : 'outlined'} style={{ width: '250px', height: '100%' }} >
                                                {action.name}
                                            </Button>
                                            {
                                                action.settings.length > 0 ?
                                                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                                                        {
                                                            action.settings.map(setting => {
                                                                return <Action flexDirection='column' orientation='horizontal' setState={this.setState.bind(this)} action={setting} />
                                                            })
                                                        }
                                                    </div>
                                                    : null
                                            }
                                        </Paper>
                                    )
                                })
                            }
                        </div>
                        {
                            this.state.executeInformation.length > 0 ?
                                <div style={{ padding: 10 }}>
                                    <Alert severity="success" action={
                                        <IconButton onClick={() => { this.setState({ executeInformation: "" }) }} style={{ alignSelf: 'start' }} color="inherit" size="small">
                                            <Close />
                                        </IconButton>
                                    }>
                                        <JSONPretty id="json-pretty" data={JSON.parse(this.state.executeInformation)}></JSONPretty>
                                    </Alert>
                                </div>
                                :
                                null
                        }
                    </Paper>
                    <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                        {this.state.message}
                    </AlertComponent>
                </div>
            )
        } else {
            return (
                <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </AlertComponent>
            )
        }
    }
}

export default Detail