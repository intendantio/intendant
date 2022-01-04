import React from 'react'
import { IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@material-ui/core'
import { Save } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class NewLocaliation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: ""
        }
    }


    async add() {
        if (this.state.name === "") {
            this.setState({ enabled: true, message: "Missing-parameter : name is empty" })
        } else {
            let result = await new Request().post({name: this.state.name}).fetch("/api/localisations")
            if (result.error) {
                this.setState({
                    enabled: true,
                    message: result.package + " : " + result.message
                })
            } else {
                this.props.history.push('/localisation')
            }
        }
    }

    render() {
        return (
            <div>
                <Paper elevation={2} style={{ padding: 10, justifyContent: 'left' }}>
                    <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'row', alignSelf: 'start', alignContent: 'start', alignItems: 'start', padding: 10 }}>
                            <TextField onChange={(event) => { this.setState({ name: event.nativeEvent.target.value }) }} style={{ width: '150px', marginRight: 10 }} label="Name" variant="outlined" />
                        </div>
                    </div>
                </Paper>
                <Paper style={{ width: 'min-content', height: 'min-content', padding: 2, alignContent: 'center', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 5 }}>
                    <IconButton onClick={() => { this.add() }} style={{ borderRadius: 0 }} variant='outlined'>
                        <Save />
                    </IconButton>
                </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default NewLocaliation