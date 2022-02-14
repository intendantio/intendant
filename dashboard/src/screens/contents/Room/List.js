import React from 'react'
import { Typography, Paper, Grid, Card, Box, CardActionArea } from '@mui/material'
import * as AbstractIcon from '@mui/icons-material'
import Request from '../../../utils/Request'
import Desktop from '../../../components/Desktop'


import AddButton from '../../../components/views/AddButton'
import Loading from '../../../components/Loading'

class Room extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
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
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ rooms: result.data, loading: false })
        }
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant='outlined' style={{ padding: 12, justifyContent: 'left'}}>
                        <Typography variant='h6' fontWeight='bold'  >
                            {"Room"}
                        </Typography>
                        <Typography variant='subtitle2'color="text.secondary"  >Making your home more organized</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{marginTop: 0}}>
                        {
                            this.state.rooms.map((room, index) => {
                                let CurrentIcon = AbstractIcon[room.icon]
                                return (
                                    <Grid key={index} item xs={12} md={6} lg={4} >
                                        <Card variant='outlined'  >
                                            <CardActionArea onClick={() => { this.props.history.push('/room/' + room.id) }} style={{ padding: 12, display: 'flex', justifyContent: 'flex-start' }} >
                                                <Box style={{ display: 'flex', flex: 1 }} >
                                                    <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                        <CurrentIcon fontSize='large' />
                                                    </Box>
                                                    <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                        <Typography variant='subtitle1'  >
                                                            {String.capitalizeFirstLetter(room.name)}
                                                        </Typography>
                                                        <Typography variant='body2' color="text.secondary"  >
                                                            {String.capitalizeFirstLetter(room.description)}
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
                </Loading>
            </>
        )
    }
}

export default Room