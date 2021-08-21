import React from 'react'
import Alert from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'
import Source from '../../../utils/Source'

import { Popover, InputAdornment, TableRow, Table, MenuItem, FormControl, TableCell, IconButton, Typography, InputLabel, Button, TextField, Paper, TableBody, TableContainer, TableHead, Divider, Select } from '@material-ui/core'
import { Close, Add, List } from '@material-ui/icons'
import IconList from '../../../components/IconList'

class NewWidget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            message: "",
            popup: false,
            content: null,
            description: "",
            image: "",
            sources: [],
            contentSources: [],
            source: null,
            action: null,
            widgetReference: "",
            reference: "",
            icon: "",
            type: "title",
            types: [],
            contents: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects")
        let resultConfiguration = await new Request().get().fetch("/api/configurations/widget")
        let resultSource = await Source.getSource(["smartobject","module"])
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else if (resultConfiguration.error) {
            this.setState({ enabled: true, message: resultConfiguration.code + " : " + resultConfiguration.message })
        } else if (resultSource.error) {
            this.setState({ enabled: true, message: resultSource.code + " : " + resultSource.message })
        } else {
            this.setState({ enabled: false, message: "", loading: false, sources: resultSource.data, type: false, types: resultConfiguration.data.contents.types })
        }
    }

    setSource(id) {
        this.state.sources.map(source => {
            if (source.id == id) { this.setState({ source: source, action: null }) }
        })
    }


    setAction(id) {
        this.state.source.actions.map(action => {
            if (action.id == id) {
                this.setState({ action: action })
            }
        })
    }

    setType(id) {
        this.state.types.map(type => {
            if (type.id == id) {
                this.setState({ type: type })
            }
        })
    }

    async save() {
        if (this.state.widgetReference.length == 0 || this.state.contentSources.length == 0 || this.state.icon.length == 0) {
            this.setState({ enabled: true, message: "Missing parameters" })
            return
        }
        let authorization = localStorage.getItem("authorization")
        let server = localStorage.getItem("server")
        let result = await fetch(server + "/api/widgets", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify({
                reference: this.state.widgetReference,
                sources: this.state.contentSources,
                contents: this.state.contents,
                icon: this.state.icon
            })
        })
        let resultJSON = await result.json()
        if (resultJSON.error) {
            this.setState({ enabled: true, message: resultJSON.code + " : " + resultJSON.message })
        } else {
            this.props.history.push('/widget')
        }
    }


    insertContent() {
        let contents = this.state.contents
        contents.push({ type: this.state.type, content: this.state.content })
        this.setState({ contents: contents, content: "" })
    }

    insertSource() {
        if (this.state.action == null || this.state.source == null || this.state.reference.length == 0) {
            this.setState({ enabled: true, message: "Missing parameters" })
            return
        }
        let find = false
        let contentSources = this.state.contentSources
        contentSources.forEach(contentSource => {
            if (contentSource.reference == this.state.reference) {
                find = true
                this.setState({ enabled: true, message: "Duplicate reference" })
            }
        })
        if (find) {
            return
        }
        let tmpsettings = []
        let action = this.state.action
        for (let index = 0; index < action.settings.length; index++) {
            let argument = action.settings[index];
            let value = this.state["argument-" + argument.id]
            if (value == undefined) {
                value = argument.default
            }
            tmpsettings.push({ reference: argument.id, value: value })
        }
        contentSources.push({
            source: this.state.source,
            action: this.state.action,
            arguments: tmpsettings,
            reference: this.state.reference
        })
        this.setState({
            contentSources: contentSources,
            action: null,
            source: null,
            reference: ""
        })
    }

    delete(index) {
        let contents = []
        this.state.contents.forEach((content, pindex) => {
            if (pindex != index) { contents.push(content) }
        })
        this.setState({ contents: contents })
    }

    deleteContent(index) {
        let contentSources = []
        this.state.contentSources.forEach((content, pindex) => {
            if (pindex != index) { contentSources.push(content) }
        })
        this.setState({ contentSources: contentSources })
    }

    render() {
        return (
            <div>
                <Paper elevation={2} style={{ padding: 10, marginBottom: 10, justifyContent: 'left' }}>
                    <div style={{ padding: 10 }}>
                        <Typography variant='h4' > Widget </Typography>
                    </div>
                    <Divider />
                    <div style={{ padding: 10, paddingBottom: 0 }}>
                        <TextField
                            onChange={(event) => { this.setState({ widgetReference: event.target.value }) }}
                            multiline
                            value={this.state.widgetReference}
                            label="Reference"
                            variant="outlined"
                        />
                        <TextField
                            style={{ marginLeft: 10 }}
                            onChange={(event) => { this.setState({ icon: event.target.value }) }}
                            multiline
                            value={this.state.icon}
                            label="Icon"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => { this.setState({ popup: true }) }} style={{ margin: 0, padding: 0 }}>
                                            <List />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Popover
                            open={this.state.popup}
                            onClose={() => { this.setState({ popup: false }) }}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center', }}
                        >
                            <IconList onSelect={(icon) => { this.setState({ popup: false, icon: icon }) }} />

                        </Popover>
                    </div>
                    <div style={{ padding: 10, paddingBottom: 0 }}>
                        <Typography variant='h5' > Source </Typography>
                        <div style={{ display: 'flex', flexDirection: 'row', paddingTop: 10 }} >
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='left'>
                                                <Typography variant='subtitle1'> Source </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant='subtitle1'> Argument </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.contentSources.map((contentSource, index) => {
                                                return (
                                                    <TableRow >
                                                        <TableCell align="left" style={{ width: '30%' }}>
                                                            <Typography variant='subtitle1'> {contentSource.reference} </Typography>
                                                            <Typography variant='subtitle1'> {contentSource.source.name} </Typography>
                                                            <Typography variant='subtitle1'> {contentSource.action.name} </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Typography variant='subtitle1'>
                                                                {JSON.stringify(contentSource.arguments)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton onClick={() => { this.deleteContent(index) }} style={{ borderRadius: 2 }}>
                                                                <Close />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                        <TableRow  >
                                            <TableCell align="left" style={{ width: '30%' }}>
                                                <TextField
                                                    onChange={(event) => { this.setState({ reference: event.target.value }) }}
                                                    style={{ width: '100%' }}
                                                    multiline
                                                    value={this.state.reference}
                                                    label="Reference"
                                                    variant="outlined"
                                                />
                                                <FormControl variant="outlined" style={{ marginTop: 5, marginBottom: 5, width: '100%' }} >
                                                    <InputLabel>Source</InputLabel>
                                                    <Select placeholder='Source' value={this.state.source ? this.state.source.id : null} onChange={(event) => { this.setSource(event.target.value) }} label="Source" >
                                                        {
                                                            this.state.sources.map(source => {
                                                                return <MenuItem value={source.id} >{source.name}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                                {
                                                    this.state.source ?
                                                        <FormControl variant="outlined" style={{ marginTop: 5, marginBottom: 5, width: '100%' }} >
                                                            <InputLabel>Action</InputLabel>
                                                            <Select placeholder='Action' style={{ width: '100%' }} value={this.state.action ? this.state.action.id : null} onChange={(event) => { this.setAction(event.target.value) }} label="Source" >
                                                                {
                                                                    this.state.source.actions.map(action => {
                                                                        return <MenuItem value={action.id} >{action.name}</MenuItem>
                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                }
                                            </TableCell>
                                            <TableCell align="right" style={{ width: '40%' }}>
                                                {
                                                    this.state.action && this.state.action.settings.length > 0 ?
                                                        <div style={{ marginLeft: 5, marginBottom: 5, marginTop: 5, borderStyle: 'solid', paddingLeft: 10, paddingRight: 10, borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)', width: '100%' }}>
                                                            <div style={{ display: 'flex', paddingTop: 10, paddingBottom: 10, flexDirection: 'column' }}>
                                                                {
                                                                    this.state.action.settings.map(setting => {
                                                                        return <Action orientation='horizontal' setState={this.setState.bind(this)} action={setting} />
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                        : null
                                                }
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => { this.insertSource() }} style={{ borderRadius: 2 }}>
                                                    <Add />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div style={{ padding: 10, paddingBottom: 0 }}>
                        <Typography variant='h5' > Content </Typography>
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='left'>
                                                <Typography variant='subtitle1'> Type </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant='subtitle1'> Affichage </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.contents.sort((a, b) => { return a.type.rank > b.type.rank }).map((content, index) => (
                                            <TableRow >
                                                <TableCell align="left">
                                                    <Typography variant='subtitle1'> {content.type.name} </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant='subtitle1'> {content.content} </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => { this.delete(index) }} style={{ borderRadius: 2 }}>
                                                        <Close />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow  >
                                            <TableCell align="left">
                                                <FormControl variant="outlined" style={{ marginRight: 10, width: '100%' }} >
                                                    <InputLabel>Type</InputLabel>
                                                    <Select value={this.state.type.id} onChange={(event) => { this.setType( event.target.value ) }} label="Type" >
                                                        {
                                                            this.state.types.map(type => {
                                                                return <MenuItem value={type.id} >{type.name}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="left">
                                                <TextField
                                                    onChange={(event) => { this.setState({ content: event.target.value }) }}
                                                    style={{ width: '100%' }}
                                                    multiline
                                                    value={this.state.content}
                                                    label="Name"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => { this.insertContent() }} style={{ borderRadius: 2 }}>
                                                    <Add />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <Button style={{ marginTop: 5, marginBottom: 5 }} onClick={() => { this.save() }} variant='outlined'>
                        Save
                    </Button>
                </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default NewWidget