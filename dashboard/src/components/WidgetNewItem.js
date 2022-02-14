import React from 'react'
import Action from './Action'


import { Grid, Card, CardActionArea, CardContent, Box, Collapse, IconButton, Typography, Button, Paper, Divider, CardHeader, CardActions } from '@mui/material'
import { ExpandLess, Add } from '@mui/icons-material'
import WidgetSkeleton from './WidgetSkeleton'

class WidgetNewItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            configuration: this.props.configuration,
            widget: this.props.widget,
            loading: false
        }
    }

    render() {
        if (this.state.loading) {
            return <WidgetSkeleton />
        }
        return (
            <Grid key={this.props.index} item xs={12} md={6} lg={4}>
                <Card variant='outlined'  >
                    <CardActionArea onClick={() => { this.props.onSelect() }}>
                        <CardContent>
                            {
                                this.state.widget.contents.filter(value => value.type == "title").map((value, ppIndex) => {
                                    return (
                                        <Typography key={ppIndex} variant='subtitle1' component='div'>
                                            {value.example}
                                        </Typography>
                                    )
                                })
                            }
                            {
                                this.state.widget.contents.filter(value => value.type == "text").length > 0 &&
                                <Divider style={{ marginBottom: 10, marginTop: 5 }} />
                            }
                            {
                                this.state.widget.contents.filter(value => value.type == "text").map((value, ppIndex) => {
                                    return (
                                        <Typography key={ppIndex} variant='body2' color={value.style && value.style.color ? this.state.widget.dataSources[value.style.color] : "text.secondary"}>
                                            {value.example}
                                        </Typography>
                                    )
                                })
                            }
                        </CardContent>
                    </CardActionArea>
                    <Collapse in={this.props.open} timeout="auto" unmountOnExit>
                        <Divider />
                        {
                            this.props.settings.length > 0 &&
                            <CardContent style={{ padding: 10 }}>
                                <Grid container spacing={1} >
                                {
                                    this.props.settings.map((setting, index) => {
                                        return (
                                            <Action
                                                xs={12} 
                                                md={12} 
                                                lg={12}
                                                key={"widget-" + setting.id}
                                                id={"widget-" + setting.id}
                                                options={setting.options}
                                                label={String.capitalizeFirstLetter(setting.id.split("_")[0])}
                                                setState={this.props.setState}
                                                action={setting}
                                            />
                                        )
                                    })
                                }
                                </Grid>
                            </CardContent>
                        }
                        <CardActions>
                            <IconButton onClick={() => { this.props.onSubmit(() => { this.setState({ loading: false }) }); this.setState({ loading: true }) }} >
                                <Add />
                            </IconButton>
                        </CardActions>
                    </Collapse>
                </Card>
            </Grid>
        )
    }
}

export default WidgetNewItem