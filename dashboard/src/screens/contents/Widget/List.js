import React from 'react'
import { Add } from '@mui/icons-material'
import { Typography, Paper, Grid, IconButton } from '@mui/material'
import { Link } from "react-router-dom"
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

import WidgetSkeleton from '../../../components/WidgetSkeleton'
import WidgetItem from '../../../components/WidgetItem'


class Widget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
            enabled: false,
            message: "",
            widgets: [],
            open: false,
            widget: {
                id: -1
            }
        }
        props.setTitle("Widget")
        props.setActionType("list")

        setInterval(() => {
            this.componentDidMount()
        }, 10000)
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/widgets")
        if (result.error) {
            this.setState({ enabled: true, loading: false, message: result.package + " : " + result.message })
        } else {
            this.setState({ enabled: false, loading: false, message: "", widgets: result.data })
        }
    }

    async delete(id) {
        let result = await new Request().delete({}).fetch("/api/widgets/" + this.state.widget.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ loading: true, anchorEl: null, popover: false }, () => { this.componentDidMount() })
        }
    }

    render() {
        return (
            <div>
                <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                    <Typography variant='h5' >Widget</Typography>
                    <Typography variant='subtitle2' color="text.secondary" >Show what you need</Typography>
                </Paper>
                <Paper variant="outlined">
                    <Grid container spacing={2} padding={2}>
                        {
                            this.state.loading ?
                                <>
                                    <WidgetSkeleton />
                                    <WidgetSkeleton />
                                    <WidgetSkeleton />
                                    <WidgetSkeleton />
                                </>
                                :
                                this.state.widgets.length == 0 ?
                                    <Grid item xs={12} md={6} lg={4}>
                                        <Typography variant='subtitle1' color="text.secondary" >You have not added a widget</Typography>
                                    </Grid>
                                    :
                                    this.state.widgets.map((widget, index) => (
                                        <WidgetItem
                                            onDelete={() => { this.delete(widget.id) }}
                                            onSelect={() => { this.setState({ widget: widget, open: true }) }}
                                            open={this.state.open && this.state.widget.id == widget.id}
                                            widget={widget}
                                        />
                                    ))}
                    </Grid>
                </Paper>
                <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Link to="/widget/new" style={{ textDecoration: 'none', color: 'white' }}>
                        <IconButton style={{ borderRadius: 0 }}>
                            <Add />
                        </IconButton>
                    </Link>
                </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default Widget