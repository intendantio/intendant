import React from 'react'
import { Typography, Paper, Grid, Card } from '@mui/material'
import Request from '../../../utils/Request'

import WidgetItem from '../../../components/WidgetItem'
import AddButton from '../../../components/views/AddButton'
import Loading from '../../../components/Loading'
import Desktop from '../../../components/Desktop'

class Widget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            widgets: [],
            open: false,
            widget: {
                id: -1
            }
        }
        props.setTitle("Widget")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/widgets")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, widgets: result.data })
        }
    }

    async delete() {
        let result = await new Request().delete({}).fetch("/api/widgets/" + this.state.widget.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: true, anchorEl: null, popover: false }, () => { this.componentDidMount() })
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Widget</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Show what you need</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        {
                            this.state.widgets.length == 0 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card variant='outlined' style={{ padding: 12 }}  >
                                        <Typography variant='subtitle1' color="text.secondary" >You have not added a widget</Typography>
                                    </Card>
                                </Grid>
                                :
                                this.state.widgets.map((widget, index) => (
                                    <WidgetItem
                                        key={index}
                                        index={index}
                                        onDelete={() => { this.delete() }}
                                        onSelect={() => { this.setState({ widget: widget, open: true }) }}
                                        open={this.state.open && this.state.widget.id == widget.id}
                                        widget={widget}
                                    />
                                ))
                        }
                    </Grid>
                    <AddButton to="/widget/new" />
                </Loading>
            </>
        )
    }
}

export default Widget