import React from 'react'
import { Add, ShowChart, CleaningServices, Delete, ArrowBackIos, ArrowForwardIos, Event, Numbers, ModeCommentRounded } from '@mui/icons-material'
import { Typography, Paper, Grid, Button, Card, Box, Skeleton, IconButton } from '@mui/material'
import Alert from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import Moment from 'moment'

import CountdownRapport from '../../../components/CountdownRapport'
import Chart from "react-apexcharts";
import Mobile from '../../../components/Mobile'

class Detail extends React.Component {



    constructor(props) {
        super(props)

        this.INTERVALS = [
            {
                name: "1H",
                durationFormat: "DD/MM/YY HH:mm",
                start: Moment().subtract({ hour: 1 }).valueOf(),
                end: Moment().valueOf(),
                intervalObject: { hour: 1 },
                intervalMinimum: 900
            }, {
                name: "1D",
                durationFormat: "DD/MM/YY",
                start: Moment().subtract({ day: 1 }).valueOf(),
                end: Moment().valueOf(),
                intervalObject: { day: 1 },
                intervalMinimum: 14000
            },
            {
                name: "1W",
                durationFormat: "DD/MM/YY",
                start: Moment().subtract({ week: 1 }).valueOf(),
                end: Moment().valueOf(),
                intervalObject: { week: 1 },
                intervalMinimum: Infinity
            },
            {
                name: "1M",
                durationFormat: "DD/MM/YY",
                start: Moment().subtract({ month: 1 }).valueOf(),
                end: Moment().valueOf(),
                intervalObject: { month: 1 },
                intervalMinimum: Infinity
            },
            {
                name: "1Y",
                durationFormat: "DD/MM/YY",
                start: Moment().subtract({ year: 1 }).valueOf(),
                end: Moment().valueOf(),
                intervalObject: { year: 1 },
                intervalMinimum: Infinity
            }
        ]
        this.state = {
            id: props.match.params.id,
            loading: true,
            enabled: false,
            message: "",
            rapport: {
                configuration: {
                    module: "module",
                    name: ""
                },
                reference: ""
            },
            data: [],
            start: Moment().valueOf(),
            end: Moment().valueOf(),
            filter: this.INTERVALS[0],
            availableFilters: []
        }



    }



    async componentDidMount() {
        let result = await new Request().get().fetch("/api/rapports/" + this.state.id)
        if (result.error) {
            this.setState({ enabled: true, loading: false, message: result.package + " : " + result.message })
            this.props.history.push('/rapport')
        } else {
            let availableFilters = this.getIntervals(result.data)
            this.setState({
                availableFilters: availableFilters,
                rapport: result.data,
                filter: availableFilters[0],
                start: availableFilters[0].start,
                end: availableFilters[0].end
            }, () => {
                this.update()
            })
        }
    }

    getIntervals(rapport) {
        let cIntervals = []
        this.INTERVALS.forEach(interval => {
            if (interval.intervalMinimum > rapport.interval) {
                cIntervals.push(interval)
            }
        })
        return cIntervals
    }



    async update() {
        let result = await new Request().get().fetch("/api/rapports/" + this.state.id + "/data/" + this.state.start + "/" + this.state.end)
        if (result.error) {
            this.setState({ enabled: true, loading: false, message: resultData.package + " : " + resultData.message })
            this.props.history.push('/rapport')
        } else {
            this.setState({
                loading: false,
                data: result.data.map(data => {
                    return [data.date, data.value]
                })
            })
        }
    }

    async delete() {
        let result = await new Request().delete({}).fetch("/api/rapports/" + this.state.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.props.history.push('/rapport')
        }
    }

    async truncate() {
        let result = await new Request().patch({}).fetch("/api/rapports/" + this.state.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.update()
        }
    }

    nextDuration() {
        let newStart = Moment(this.state.start).add(this.state.filter.intervalObject).valueOf()
        let newEnd = Moment(this.state.end).add(this.state.filter.intervalObject).valueOf()
        this.setState({
            start: newStart,
            end: newEnd
        }, () => {
            this.update()
        })
    }

    previousDuration() {
        let newStart = Moment(this.state.start).subtract(this.state.filter.intervalObject).valueOf()
        let newEnd = Moment(this.state.end).subtract(this.state.filter.intervalObject).valueOf()
        this.setState({
            start: newStart,
            end: newEnd
        }, () => {
            this.update()
        })
    }

    render() {
        let option = {
            chart: {
                id: "basic-bar",
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                },
                offsetX: -5,
                animations: {
                    enabled: true,
                    easing: 'easeout',
                    animateGradually: {
                        enabled: true
                    }
                }
            },
            grid: {
                show: false
            },
            xaxis: {
                type: 'datetime',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: true,
                    style: {
                        colors: "rgba(255, 255, 255, 0.7)",
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: 'Poppins,sans-serif',
                    }
                }
            },
            yaxis: {
                labels: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            tooltip: {
                enabled: true,
                theme: 'dark',
                x: {
                    formatter: (x) => {
                        return Moment(x).format("HH:mm - DD/MM/YY")
                    }
                }
            },
            title: {
                text: capitalizeFirstLetter(this.state.rapport.reference),
                align: 'center',
                style: {
                    color: "#ffffff",
                    fontWeight: 500,
                    fontSize: 18,
                    fontFamily: 'Poppins,sans-serif',
                }
            },
            subtitle: {
                text: capitalizeFirstLetter(this.state.rapport.configuration.module == "smartobject" ? this.state.rapport.smartobject.reference : ""),
                align: 'center',
                style: {
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 14,
                    fontWeight: 400,
                    fontFamily: 'Poppins,sans-serif',
                }
            },
            noData: {
                text: "No data",
                align: 'center',
                verticalAlign: 'middle',
                offsetX: 0,
                offsetY: 0,
                style: {
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 16,
                    fontWeight: 400,
                    fontFamily: 'Poppins,sans-serif',
                }
            },
            stroke: {
                width: this.props.isMobile ? 3 : 5,
                curve: 'smooth'
            },
            colors: ['rgba(255,255,255,0.8)'],
            fill: {
                type: 'gradient',
                gradient: {
                    gradientToColors: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.8)']
                },
            }
        }
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 16, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >Rapport</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Show what you need</Typography>
                    </Paper>
                </Desktop>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card variant='outlined' style={{ display: 'flex' }}  >
                            {
                                this.state.availableFilters.length == 0 ?
                                    <Box style={{ paddingLeft: 20, paddingRight: 20 }}>
                                        <Skeleton height={25} />
                                    </Box>
                                    : this.state.availableFilters.map((interval, index) => {
                                        let isCurrent = interval.name == this.state.filter.name
                                        return (
                                            <Button key={index} style={{ flex: 1, display: 'flex', justifyContent: 'center', borderRadius: 0 }} size='large' color='inherit' onClick={() => { this.setState({ filter: interval, start: interval.start, end: interval.end }, () => { this.update() }) }}>
                                                <Typography style={{ fontWeight: isCurrent ? 600 : 'normal' }} color={isCurrent ? "" : "text.secondary"} >{interval.name}</Typography>
                                            </Button>
                                        )
                                    })
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card variant='outlined' style={{ display: 'flex', justifyContent: 'space-around' }}  >
                            <IconButton style={{ flex: 1, borderRadius: 0 }} onClick={() => { this.previousDuration() }} >
                                <ArrowBackIos />
                            </IconButton>
                            <Typography style={{ flex: 5, alignSelf: 'center' }} textAlign='center' color="text.secondary" variant={this.props.isMobile ? 'body2' : 'subtitle2'} >{Moment(this.state.start).format(this.state.filter.durationFormat) + " - " + Moment(this.state.end).format(this.state.filter.durationFormat)}</Typography>
                            <IconButton style={{ flex: 1, borderRadius: 0 }} onClick={() => { this.nextDuration() }} >
                                <ArrowForwardIos />
                            </IconButton>
                        </Card>
                    </Grid>
                    <Desktop {... this.props}>
                        <Grid item xs={12} md={1} lg={2}>
                            <Card variant='outlined' style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }} >
                                <Typography style={{ alignSelf: 'center' }} textAlign='center' variant='subtitle2' ></Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={1} lg={1}>
                            <Card variant='outlined' style={{ display: 'flex', justifyContent: 'center' }}  >
                                <IconButton style={{ flex: 1, display: 'flex', borderRadius: 0 }} onClick={() => { this.truncate() }} >
                                    <CleaningServices color="text.secondary" />
                                </IconButton>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={1} lg={1}>
                            <Card variant='outlined' style={{ display: 'flex', justifyContent: 'center' }}  >
                                <IconButton style={{ flex: 1, display: 'flex', borderRadius: 0 }} onClick={() => { this.delete() }}>
                                    <Delete />
                                </IconButton>
                            </Card>
                        </Grid>
                    </Desktop>
                    <Grid item xs={12} md={12} lg={8}>
                        <Card variant='outlined' style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 15 }}  >
                            {
                                this.state.loading ?
                                    <Box style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                                        <Skeleton height={25} />
                                        <Skeleton style={{ marginTop: 10 }} height={20} />
                                        <Skeleton style={{ marginTop: 30 }} variant='rectangular' height={260} />
                                    </Box>
                                    : <Chart options={option} series={[
                                        {
                                            name: this.state.rapport.reference,
                                            data: this.state.data
                                        }
                                    ]} type="line" height={350} />
                            }
                        </Card>
                    </Grid>
                    <CountdownRapport id={this.state.id} onRefresh={() => { this.update() }} />
                    <Mobile {... this.props}>
                        <Grid item xs={6} md={1} lg={1}>
                            <Card variant='outlined' style={{ display: 'flex', justifyContent: 'center' }}  >
                                <IconButton style={{ flex: 1, display: 'flex', borderRadius: 0 }} onClick={() => { this.truncate() }} >
                                    <CleaningServices color="text.secondary" />
                                </IconButton>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={1} lg={1}>
                            <Card variant='outlined' style={{ display: 'flex', justifyContent: 'center' }}  >
                                <IconButton style={{ flex: 1, display: 'flex', borderRadius: 0 }} onClick={() => { this.delete() }}>
                                    <Delete />
                                </IconButton>
                            </Card>
                        </Grid>
                    </Mobile>
                </Grid>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </>
        )
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default Detail
