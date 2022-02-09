import React from 'react'
import { Add, ToggleOff, ToggleOn, RadioButtonChecked } from '@mui/icons-material'
import { Typography, Paper, Grid, IconButton, Card, CardActionArea, Box } from '@mui/material'
import { Link } from "react-router-dom"
import Alert from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'

import WidgetSkeleton from '../../../components/WidgetSkeleton'
import WidgetItem from '../../../components/WidgetItem'
import ProcessSkeleton from '../../../components/ProcessSkeleton'
import AddButton from '../../../components/views/AddButton'


class Process extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
            processes: [],
            open: false,
            widget: {
                id: -1
            }
        }
        props.setTitle("Process")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/processes")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, processes: result.data })
        }
    }

    render() {
        return (
            <div>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >Process</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Execute action</Typography>
                    </Paper>
                </Desktop>
                <Grid container spacing={2}>
                    {
                        this.state.loading ?
                            <>
                                <ProcessSkeleton />
                                <ProcessSkeleton />
                                <ProcessSkeleton />
                                <ProcessSkeleton />
                            </>
                            :
                            this.state.processes.length == 0 ?
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Card variant='outlined' style={{ padding: 12 }}  >
                                            <Typography variant='subtitle1' color="text.secondary" >You have not added a process</Typography>
                                        </Card>
                                    </Grid>
                                :
                                this.state.processes.map(process => {
                                    return (
                                        <Grid item xs={12} md={12} lg={12} >
                                            <Card variant='outlined'   >
                                                <CardActionArea style={{ padding: 12, display:'flex', flexDirection:'row', justifyContent:'flex-start' }} onClick={() => { this.props.history.push('/process/' + process.id) }}  >
                                                            <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                                {
                                                                    process.mode == "button" ?
                                                                        <RadioButtonChecked fontSize='large' /> :

                                                                        process.state == "on" ?
                                                                        <ToggleOn fontSize='large' />
                                                                        :
                                                                        <ToggleOff fontSize='large' />
                                                                }
                                                            </Box>
                                                            <Box>
                                                                <Typography variant='subtitle1'  >
                                                                    {process.description.length == 0 ? "No name" :  process.description}
                                                                </Typography>
                                                                <Typography variant='body2' color="text.secondary"  >
                                                                    {
                                                                        process.mode == "button" ?
                                                                            process.description_on
                                                                            :
                                                                            process.description_on + " / " + process.description_off
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    )
                                })
                    }
                </Grid>
                <AddButton to="/process/new" />
            </div >
        )
    }
}

export default Process