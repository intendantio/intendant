import React from 'react'
import { Grid, Card, Skeleton, Box} from '@mui/material'
import Request from '../utils/Request'
import Moment from 'moment'

import Chart from "react-apexcharts";


class CountdownRapport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.id,
            remaning: 0,
            percent: 0,
            loading: true
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/rapports/" + this.state.id)
        if (result.error) {
            this.setState({ remaning: 0 })
        }  else {
            let nextMoment = Moment(result.data.lastData.date).add({ second: result.data.interval })
            this.idInterval = setInterval(() => {
                let remaning = nextMoment.diff(Moment(), 'second')
                this.setState({ remaning: remaning, percent: 100 - ((100 * remaning) / result.data.interval), loading: false })
                if (remaning < 0) {
                    this.setState({ remaning: 0, loading: true })
                    clearInterval(this.idInterval)
                    if(remaning > -3600) {
                        setTimeout(() => {
                            this.props.onRefresh()
                            this.componentDidMount()
                        }, 2000)
                    }
                } 
            }, 1000)
        }
    }

    
    componentWillUnmount() {
        clearInterval(this.idInterval)
    }

    getOption() {
        return (
            {
                series: [this.state.percent],
                chart: {
                    height: 350,
                    type: 'radialBar'
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '55%',
                        },
                        track: {
                            background: 'rgba(255,255,255,0.20)'
                        },
                        dataLabels: {
                            name: {
                                offsetY: 8,
                                color: "rgba(255,255,255,0.8)",
                                fontSize: 24,
                                fontWeight: 600,
                            },
                            value: {
                                show: false
                            },
                            total: {
                                show: false
                            }
                        }
                    },
                },
                colors: ['rgba(255,255,255,0.8)'],
                labels: [Moment().set({hour: 0, minute: 0, second: 1}).set({seconds: this.state.remaning}).format("HH:mm:ss") ],
                title: {
                    text: "Next acquisition",
                    align: 'center',
                    style: {
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: 500,
                        fontFamily: 'Poppins,sans-serif',
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        gradientToColors: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']
                    },
                },
            }
        )
    }

    render() {
        return (
            <Grid item xs={12} md={12} lg={4}>
                <Card variant='outlined' style={{ padding: 10 }}  >
                    {
                        this.state.loading ?
                        <Box style={{justifyContent:'center', display:'flex', marginTop: 75, marginBottom: 50}}>
                            <Skeleton variant='circular' height={230} width={230} />
                        </Box>
                        :
                        <Chart options={this.getOption()} series={[this.state.percent]} type="radialBar" height={354} />
                    }
                </Card>
            </Grid>
        )
    }
}



export default CountdownRapport