import React from 'react'
import { Add, ShowChart, PieChart, Bed, Event, BarChart, RoomServiceOutlined } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, Box, CardActionArea } from '@mui/material'
import * as AbstractIcon from '@mui/icons-material'
import { Link } from "react-router-dom"
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'
import Moment from 'moment'
import Desktop from '../../../components/Desktop'


import AddButton from '../../../components/views/AddButton'

class Room extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
            enabled: false,
            message: "",
            rooms: [],
            open: false,
            widget: {
                id: -1
            }
        }
        props.setTitle("Room")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/rooms")
        if (result.error) {
            this.setState({ enabled: true, loading: false, message: result.package + " : " + result.message })
        } else {
            this.setState({ enabled: false, loading: false, message: "", rooms: result.data })
        }
    }

    render() {
        return (
            <div>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >Room</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >The rooms in your home</Typography>
                    </Paper>
                </Desktop>
                <Grid container spacing={1}>
                    {
                        this.state.rooms.map(room => {
                            let CurrentIcon = AbstractIcon[room.icon]
                            return (
                                <Grid item xs={12} md={6} lg={4} >
                                    <Card variant='outlined'   >
                                        <CardActionArea onClick={() => { this.props.history.push('/room/' + room.id) }} style={{ padding: 12, display: 'flex', justifyContent: 'flex-start' }} >
                                            <Box style={{ display: 'flex', flex: 1 }} >
                                                <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                    <CurrentIcon fontSize='large' />
                                                </Box>
                                                <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                    <Typography variant='subtitle1'  >
                                                        {capitalizeFirstLetter(room.name)}
                                                    </Typography>
                                                    <Typography variant='body2' color="text.secondary"  >
                                                        {capitalizeFirstLetter(room.description)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </Grid>
                <AddButton to="/room/new" />
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default Room