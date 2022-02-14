import React from 'react'
import { ToggleOff, ToggleOn, RadioButtonChecked } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, CardActionArea, Box } from '@mui/material'
import Desktop from '../../../components/Desktop'
import Loading from '../../../components/Loading'
import Request from '../../../utils/Request'

import AddButton from '../../../components/views/AddButton'


class Process extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            processes: []
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
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Process</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Execute action</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        {
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
                                                <CardActionArea style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} onClick={() => { this.props.history.push('/process/' + process.id) }}  >
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
                                                            {process.description.length == 0 ? "No name" : process.description}
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
                </Loading>
            </>
        )
    }
}

export default Process