import React from 'react'
import { Grid, Card, CardActionArea, Box, Typography } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, PieChart, Pie, ResponsiveContainer } from 'recharts';
import Chart from "react-apexcharts";

const optionLine = {
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
    yaxis: {
        min: 1,
        max: 10,
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
        enabled: false,
        theme: 'dark',
        x: {
            formatter: (x) => {
                return Moment.unix(x).format("HH:mm")
            }
        }
    },
    title: {
        text: "Line Chart",
        align: 'center',
        style: {
            color: "#ffffff",
            fontWeight: 500,
            fontSize: 18,
            fontFamily: 'Poppins,sans-serif',
        }
    },
    subtitle: {
        text: "Data is sort per time",
        align: 'center',
        style: {
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 14,
            fontWeight: 400,
            fontFamily: 'Poppins,sans-serif',
        }
    },
    stroke: {
        width: 6,
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

class NewTypePie extends React.Component {

    render() {
        return (
            <Grid item xs={12} md={6} lg={4} >
                <Card variant='outlined'   >
                    <CardActionArea onClick={() => { this.props.onSelect("lineChart") }} >
                        <Chart options={optionLine} series={[
                            {
                                name: "test",
                                data: [7, 6, 8, 6, 4, 9]
                            }
                        ]} type="line" height={300} />
                    </CardActionArea>
                </Card>
            </Grid>
        )
    }
}

export default NewTypePie