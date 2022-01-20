import React from 'react'
import { Add } from '@mui/icons-material'
import { Typography, Paper, Grid, IconButton, Card } from '@mui/material'
import { Link } from "react-router-dom"
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import WidgetSkeleton from '../../../components/WidgetSkeleton'
import WidgetItem from '../../../components/WidgetItem'

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
            widgets: [],
            open: false,
            widget: {
                id: -1
            }
        }
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
                <Paper variant="outlined" style={{ padding: 16, marginBottom: 10, justifyContent: 'left' }}>
                    <Typography variant='h5' >Rapport</Typography>
                    <Typography variant='subtitle2' color="text.secondary" >Show what you need</Typography>
                </Paper>
                <Paper variant="outlined">
                    <Grid container spacing={2} padding={2}>
                        <Grid item xs={12} md={6} lg={4} >
                            <Card variant='outlined' elevation={1} style={{padding: 10}}  >
                                <LineChart
                                    width={400}
                                    height={250}
                                    data={data}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <XAxis />
                                    <YAxis />
                                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                                </LineChart>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
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

export default Rapport