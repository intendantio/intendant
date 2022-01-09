import React from 'react'
import Action from '../../../components/Action'
import { FormControl, Select, InputLabel, MenuItem, Paper, Typography, Divider, IconButton, TextField, TableCell, TableBody, TableContainer, TableHead, Table, TableRow } from '@mui/material'
import { Close, Add, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'
import Source from '../../../utils/Source'

class Widget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            message: "",
            id: props.match.params.id,
            contentSources: [],
            reference: '',
            source: '',
            action: '',
            type: "",
            content: "",
            sources: [],
            types: [],
            widget: null,
            needSave: null
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/widgets/" + this.state.id)
        let resultConfiguration = await new Request().get().fetch("/api/configurations/widget")
        let resultSource = await Source.getSource(["smartobject", "module"])
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else if (resultSource.error) {
            this.setState({ enabled: true, message: resultSource.package + " : " + resultSource.message })
        } else if (resultConfiguration.error) {
            this.setState({ enabled: true, message: resultConfiguration.package + " : " + resultConfiguration.message })
        } else {
            this.setState({ enabled: false, message: "", loading: false, widget: result.data, sources: resultSource.data, types: resultConfiguration.data.contents.types })
        }
    }

    async delete() {
        let result = await new Request().delete({}).fetch("/api/widgets/" + this.state.widget.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.props.history.push('/widget')
        }
    }

    async deleteSource(source) {
        let result = await new Request().delete().fetch("/api/widgets/" + this.state.widget.id + "/sources/" + source)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async insertSource() {
        if (this.state.action == null || this.state.source == null || this.state.reference.length == 0) {
            this.setState({ enabled: true, message: "Missing parameters" })
            return
        }
        let find = false
        this.state.widget.sources.forEach(contentSource => {
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
            let value = this.state["settings-" + argument.id]
            if (value == undefined) {
                value = argument.default
            }
            tmpsettings.push({ reference: argument.id, value: value })
        }
        let result = await new Request().post({
            source: this.state.source,
            action: this.state.action,
            arguments: tmpsettings,
            reference: this.state.reference
        }).fetch("/api/widgets/" + this.state.id + "/sources")

        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ action: null, source: null, reference: "" })
            this.componentDidMount()
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

    async setContent() {
        let result = await new Request().post({ type: this.state.type, content: this.state.content }).fetch("/api/widgets/" + this.state.id + "/contents")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ content: "" })
            this.componentDidMount()
        }
    }

    async deleteContent(id) {
        let result = await new Request().delete().fetch("/api/widgets/" + this.state.id + "/contents/" + id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async update(content) {
        let widget = this.state.widget
        let contents = widget.contents.map(pContent => {
            if (pContent.id == content.id) {
                pContent.native = content.native
            }
            return pContent
        })
        widget.contents = contents
        this.setState({ widget: widget, needSave: null })
        let result = await new Request().put({ content: content }).fetch("/api/widgets/" + this.state.widget.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    render() {
        if (this.state.widget) {
            return (
                <div>
                    <Paper variant="outlined" style={{ padding: 10, justifyContent: 'left' }}>
                        <div style={{ padding: 10 }}>
                            <Typography variant='h4' style={{ fontSize: 25 }}>
                                {this.state.widget.reference}
                            </Typography>
                            <Typography variant='subtitle1' >
                                {this.state.widget.icon}
                            </Typography>
                        </div>
                        <Divider />
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                Source
                            </Typography>
                            <Paper variant="outlined">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='left' style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                                                    <Typography variant='subtitle1'>Reference</Typography>
                                                </TableCell>
                                                <TableCell align='left' style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                                                    <Typography variant='subtitle1' >Source</Typography>
                                                </TableCell>
                                                <TableCell align="left" style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                                                    <Typography variant='subtitle1' >Argument</Typography>
                                                </TableCell>
                                                <TableCell align="left" style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.state.widget.sources.map((source, index) => {
                                                    return (
                                                        <TableRow key={index} >
                                                            <TableCell style={{ borderBottom: 0 }} align="left" >
                                                                <Typography variant='subtitle1'>
                                                                    {source.reference}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell style={{ borderBottom: 0 }} align="left">
                                                                <Typography variant='subtitle1'>
                                                                    {source.object}
                                                                </Typography>
                                                                <Typography variant='subtitle1'>
                                                                    {source.action}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell style={{ borderBottom: 0 }} align="left" >
                                                                <Typography variant='subtitle1'>
                                                                    {
                                                                        source.arguments.map((argument, pIndex) => {
                                                                            return (
                                                                                <Typography key={pIndex} variant='body1'>{argument.reference + " : " + argument.value}</Typography>
                                                                            )
                                                                        })
                                                                    }
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell style={{ borderBottom: 0 }} align="right">
                                                                <IconButton onClick={() => { this.deleteSource(source.id) }} style={{ borderRadius: 3 }}>
                                                                    <Delete />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </div>
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Paper variant="outlined">
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {
                                                this.state.contentSources.map((contentSource, index) => {
                                                    return (
                                                        <TableRow key={index} >
                                                            <TableCell align="left" style={{  borderBottom: 0 }}>
                                                                <Typography variant='subtitle1'> {contentSource.reference} </Typography>
                                                                <Typography variant='subtitle1'> {contentSource.source.name} </Typography>
                                                                <Typography variant='subtitle1'> {contentSource.action.name} </Typography>
                                                            </TableCell>
                                                            <TableCell align="left" style={{ borderBottom: 0 }} >
                                                                <Typography variant='subtitle1'>
                                                                    {JSON.stringify(contentSource.arguments)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right" style={{ borderBottom: 0 }} >
                                                                <IconButton onClick={() => { this.deleteContent(index) }} style={{ borderRadius: 2 }}>
                                                                    <Close />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                            <TableRow  >
                                                <TableCell align="left" style={{ width: '30%', borderBottom: 0 }}>
                                                    <TextField
                                                        onChange={(event) => { this.setState({ reference: event.target.value }) }}
                                                        style={{ width: '100%' }}
                                                        multiline
                                                        value={this.state.reference}
                                                        label="Reference"
                                                        variant="outlined"
                                                    />
                                                    <FormControl variant="outlined" style={{ marginTop: 10, marginBottom: 10, width: '100%' }} >
                                                        <InputLabel>Source</InputLabel>
                                                        <Select placeholder='Source' value={this.state.source ? this.state.source.id : ''} onChange={(event) => { this.setSource(event.target.value) }} label="Source" >
                                                            {
                                                                this.state.sources.map((source, pIndex) => {
                                                                    return <MenuItem key={pIndex} value={source.id} >{source.name}</MenuItem>
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                    {
                                                        this.state.source ?
                                                            <FormControl variant="outlined" style={{ width: '100%' }} >
                                                                <InputLabel>Action</InputLabel>
                                                                <Select placeholder='Action' style={{ width: '100%' }} value={this.state.action ? this.state.action.id : ''} onChange={(event) => { this.setAction(event.target.value) }} label="Source" >
                                                                    {
                                                                        this.state.source.actions.map((action, pIndex) => {
                                                                            return <MenuItem key={pIndex} value={action.id} >{action.name}</MenuItem>
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                            : null
                                                    }
                                                </TableCell>
                                                <TableCell align="right" style={{ width: '40%', borderBottom: 0 }}>
                                                    {
                                                        this.state.action && this.state.action.settings.length > 0 ?
                                                            <div style={{ marginLeft: 5, marginBottom: 5, marginTop: 5, borderStyle: 'solid', paddingLeft: 10, paddingRight: 10, borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)', width: '100%' }}>
                                                                <div style={{ display: 'flex', paddingTop: 10, paddingBottom: 10, flexDirection: 'column' }}>
                                                                    {
                                                                        this.state.action.settings.map((setting, index) => {
                                                                            return (
                                                                                <div style={{ margin: 5 }}>
                                                                                    <Action key={index} flexDirection='column' orientation='horizontal' setState={this.setState.bind(this)} action={setting} />
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                </TableCell>
                                                <TableCell align="right" style={{ borderBottom: 0 }} >
                                                    <IconButton onClick={() => { this.insertSource() }} style={{ borderRadius: 2 }}>
                                                        <Add />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </div>
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                Content
                            </Typography>
                            <Paper variant="outlined">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='left' style={{ width: '15%', borderColor: 'rgba(255, 255, 255, 0.12)' }} >
                                                    <Typography variant='subtitle1'>Type</Typography>
                                                </TableCell>
                                                <TableCell align='left' style={{ width: '80%', borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                                                    <Typography variant='subtitle1' >content</Typography>
                                                </TableCell>
                                                <TableCell align='left' style={{ width: '20%', borderColor: 'rgba(255, 255, 255, 0.12)' }}>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.state.widget.contents.sort((a, b) => { return a.type.rank > b.type.rank }).map((content, index) => {
                                                    return (
                                                        <TableRow key={index} >
                                                            <TableCell align="left" style={{ borderBottom: 0 }}  >
                                                                <Typography variant='subtitle1'>
                                                                    {content.type.name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="left" style={{ borderBottom: 0 }}  >
                                                                <TextField
                                                                    style={{ width: '100%', marginBottom: 5 }}
                                                                    onChange={(event) => { content.native = event.target.value; this.setState({ needSave: index }) }}
                                                                    onBlur={(event) => { this.update(content) }}
                                                                    multiline
                                                                    value={content.native}
                                                                    variant="outlined"
                                                                />
                                                                {
                                                                    content.content.split("\n").map((_content, pIndex) => {
                                                                        return (
                                                                            <Typography key={pIndex} variant='body1' color={this.state.needSave == index ? 'primary' : 'inherit'} style={{ fontWeight: _content.type == 'title' ? 'bold' : 'normal' }}>
                                                                                {_content}
                                                                            </Typography>
                                                                        )
                                                                    })
                                                                }
                                                            </TableCell>
                                                            <TableCell align="right" style={{ borderBottom: 0 }} >
                                                                <IconButton onClick={() => { this.deleteContent(content.id) }} style={{ borderRadius: 3 }}>
                                                                    <Delete />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                            <TableRow  >
                                                <TableCell align="left" style={{ borderBottom: 0 }} >
                                                    <FormControl variant="outlined" style={{ marginRight: 10, width: '100%' }} >
                                                        <InputLabel>Type</InputLabel>
                                                        <Select value={this.state.type} onChange={(event) => { this.setState({ type: event.target.value }) }} label="Type" >
                                                            {
                                                                this.state.types.map((type, pIndex) => {
                                                                    return <MenuItem key={pIndex} value={type.id} >{type.name}</MenuItem>
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="left" style={{ borderBottom: 0 }} >
                                                    <TextField
                                                        onChange={(event) => { this.setState({ content: event.target.value }) }}
                                                        style={{ width: '100%' }}
                                                        multiline
                                                        value={this.state.content}
                                                        label="Name"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="right" style={{ borderBottom: 0 }} >
                                                    <IconButton onClick={() => { this.setContent() }} style={{ borderRadius: 2 }}>
                                                        <Add />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </div>
                    </Paper>
                    <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.delete() }} style={{ borderRadius: 5 }}>
                            <Delete />
                        </IconButton>
                    </Paper>
                    <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                        {this.state.message}
                    </Alert>
                </div>
            )
        } else {
            return (
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            )
        }
    }
}

export default Widget