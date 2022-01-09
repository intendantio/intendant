import React from 'react'
import { Typography, Paper } from '@mui/material'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class RedirectSmartobject extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            message: "",
            enabled: false
        }

    }

    componentDidMount() {
        try {
            let settings = []
            if (location.search.split("?").length == 2) {
                location.search.split("?")[1].split("&").map(param => {
                    let tmp = param.split("=")
                    if (tmp.length == 2) {
                        settings.push({
                            reference: tmp[0],
                            value: tmp[1]
                        })
                    }
                })
            }
            if (this.props.match.params.object == undefined) {
                this.setState({
                    message: "Missing object",
                    enabled: true
                })
                this.cancel()
            }
            let result = JSON.parse(window.atob(this.props.match.params.object))
            this.add(result.reference, result.localisation, result.module, settings.concat(result.settings) )
        } catch (error) {
            this.setState({
                message: error.toString(),
                enabled: true
            })
            this.cancel()
        }
    }

    async add(reference, localisation, module, settings) {
        let result = await new Request().post({ localisation: localisation, module: module, reference: reference, settings: settings }).fetch("/api/smartobjects")
        if (result.error) {
            this.setState({
                message: result.message,
                enabled: true
            })
            this.cancel()
        } else {
            this.props.history.push('/smartobject/' + result.data.id)
        }
    }

    cancel() {
        setTimeout(() => {
            this.props.history.push('/smartobject/new')
        }, 2000)
    }

    render() {
        return (
            <div>
                <Paper elevation={2} style={{ padding: 10, marginBottom: 10, justifyContent: 'left' }}>
                        <div style={{ padding: 10 }}>
                            <Typography variant='h4' >
                                Loading
                            </Typography>
                        </div>
                    </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default RedirectSmartobject