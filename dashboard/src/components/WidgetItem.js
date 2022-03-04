import React from 'react'
import Action from './Action'


import { Grid, Card, CardActionArea, CardContent, Badge, Collapse, IconButton, Typography, Button, Paper, Divider, CardHeader, CardActions } from '@mui/material'
import { ExpandLess, Delete } from '@mui/icons-material'
import WidgetSkeleton from './WidgetSkeleton'

class WidgetItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            widget: this.props.widget,
            loading: false
        }
    }


    componentDidUpdate() {
        if(this.props.widget != this.state.widget) {
            this.setState({
                widget: this.props.widget
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <WidgetSkeleton />
        }
        return (
            <Grid key={this.props.index} item xs={12} md={6} lg={4}>
                <Card variant='outlined'   >
                    <CardActionArea onClick={() => { this.props.onSelect() }}>
                        <CardContent>
                            {
                                this.state.widget.values.filter(value => value.type == "title").map((value, ppIndex) => {
                                    return (
                                        <Typography key={ppIndex} variant='subtitle1' component='div'>
                                           {String.capitalizeFirstLetter(value.value)}
                                        </Typography>
                                    )
                                })
                            }
                            {
                                this.state.widget.values.filter(value => value.type == "text").length > 0 &&
                                <Divider style={{ marginBottom: 10, marginTop: 5 }} />
                            }
                            {
                                this.state.widget.values.filter(value => value.type == "text").map((value, ppIndex) => {
                                    return (
                                        <Typography key={ppIndex} variant='body2' color={value.style && value.style.color  ? this.state.widget.dataSources[value.style.color] : "text.secondary"}>
                                            {String.capitalizeFirstLetter(value.value)}
                                        </Typography>
                                    )
                                })
                            }
                        </CardContent>
                    </CardActionArea>
                    <Collapse in={this.props.open} timeout="auto" unmountOnExit>
                        <CardActions>
                            <IconButton size='small' onClick={() => { this.props.onDelete() }}>
                                <Delete />
                            </IconButton>
                        </CardActions>
                    </Collapse>
                </Card>
            </Grid>
        )
    }
}

export default WidgetItem