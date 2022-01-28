import React from 'react'
import { Add, ShowChart, PieChart, Timelapse, Event, Numbers } from '@mui/icons-material'
import { Typography, Paper, Grid, IconButton, Card, Box, CardActionArea } from '@mui/material'
import { Link } from "react-router-dom"
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'
import Moment from 'moment'
import Desktop from '../../../components/Desktop'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import WidgetSkeleton from '../../../components/WidgetSkeleton'
import RapportItem from '../../../components/RapportItem'

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

class Rapport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
            enabled: false,
            message: "",
            rapports: [],
            open: false,
            widget: {
                id: -1
            }
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/rapports")
        if (result.error) {
            this.setState({ enabled: true, loading: false, message: result.package + " : " + result.message })
        } else {
            this.setState({ enabled: false, loading: false, message: "", rapports: result.data })
        }
    }

    render() {
        return (
            <div>
            <Desktop {... this.props}>
                <Paper variant="outlined" style={{ padding: 16, marginBottom: 10, justifyContent: 'left' }}>
                    <Typography variant='h5' >Rapport</Typography>
                    <Typography variant='subtitle2' color="text.secondary" >Capture your data</Typography>
                </Paper>
            </Desktop>
                <Grid container spacing={1}>
                    {
                        this.state.rapports.map(rapport => {
                            return (
                                <Grid item xs={12} md={12} lg={12} >
                                    <Card variant='outlined'   >
                                        <CardActionArea onClick={() => { this.props.history.push('/rapport/' + rapport.id) }} style={{ padding: 16, display: 'flex', justifyContent: 'flex-start' }} >
                                            <Box style={{ display: 'flex', flex: 1 }} >
                                                <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                        <Typography variant='h6' color="text.secondary"  >
                                                            {capitalizeFirstLetter(rapport.configuration.module == "smartobject" ? (rapport.reference + " - " + rapport.smartobject.reference ) : rapport.reference)}
                                                        </Typography>
                                                        <Typography variant='body2' color="text.secondary"  >
                                                            {capitalizeFirstLetter(rapport.configuration.name)}
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
                <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <Link to="/rapport/new" style={{ textDecoration: 'none', color: 'white' }}>
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default Rapport