import React from 'react'
import Action from './Action'
import Moment from 'moment'


import { Grid, Card, CardActionArea, CardContent, Box, Collapse, IconButton, Typography, Button, Paper, Divider, CardHeader, CardActions } from '@mui/material'
import { ExpandLess, FamilyRestroomTwoTone } from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, PieChart, Pie, ResponsiveContainer } from 'recharts';
import WidgetSkeleton from './WidgetSkeleton'

class RapportItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            rapport: this.props.rapport,
            loading: false,
            data: this.props.data
        }
    }

    componentDidMount() {
        let convertedData = []
        
        this.props.data.forEach(data => {
            convertedData.push({
                value: data.value,
                date: Moment.unix(data.date).format("hh")
            })
        })

        this.setState({
            data: convertedData
        })
    }


    render() {
        if (this.state.loading) {
            return <WidgetSkeleton />
        }
        return (
            <>
            <Grid item xs={12} md={8} lg={8}>
                <Card variant='outlined' elevation={1}  >
                    <ResponsiveContainer minHeight={250} minWidth={"100%"} >
                        <LineChart
                            width={1000}
                            height={250}
                            data={this.state.data}
                            margin={{
                                top: 20,
                                left: -10,
                                right: 40,
                                bottom: 20,
                            }}
                        >
                            <XAxis dataKey={"date"} stroke='rgba(255, 255, 255, 0.7)' />
                            <YAxis unit="°c" stroke='rgba(255, 255, 255, 0.7)' />
                            <Line strokeWidth={2} dot={false} type="monotone" dataKey="value" stroke="rgba(255, 255, 255, 0.9)" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
                <Card variant='outlined' elevation={1}  >

                </Card>
            </Grid>
            </>
            
        )
    }
}

export default RapportItem