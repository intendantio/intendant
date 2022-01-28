import React from 'react'
import Action from './Action'


import { Grid, Card, CardActionArea, CardContent, Box, Collapse, IconButton, Typography, Button, Paper, Divider, CardHeader, CardActions } from '@mui/material'
import { ExpandLess, FamilyRestroomTwoTone } from '@mui/icons-material'
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


    onSelect() {
        this.props.onSelect()
        
    }

    render() {
        if (this.state.loading) {
            return <WidgetSkeleton />
        }
        return (
            <Grid item xs={12} md={6} lg={3}>
                <Card variant='outlined' elevation={1}  >
                    <CardActionArea onClick={() => { this.onSelect() }}>
                        <CardContent>
                            {
                                this.state.widget.contents.filter(value => value.type == "title").map((value, ppIndex) => {
                                    return (
                                        <Typography key={ppIndex} variant='h6' component='div'  color="text.secondary">
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
                                        <Typography key={ppIndex} variant='body2' color={value.style && value.style.color  ? this.state.widget.dataSources[value.style.color] : "text.secondary"}>
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
                            this.props.settings.length > 0 && <CardHeader titleTypographyProps={{ variant: 'subtitle1' }} action={
                                <IconButton onClick={() => { this.props.onClose() }} aria-label="settings">
                                    <ExpandLess />
                                </IconButton>
                            } style={{ paddingBottom: 8 }} title={this.state.widget.name} />}

                        {
                            this.props.settings.length > 0 &&
                            <CardContent style={{ paddingBottom: 4, paddingTop: 4 }}>
                                {
                                    this.props.settings.map((settings, index) => {
                                        return (
                                            <div key={index} >
                                                <Action
                                                    setState={this.props.setState} action={settings}
                                                    action={settings}
                                                    isDisabled={settings.type == "oauth2" && (this.state.localisation == false || this.state.reference.length == 0)}

                                                />
                                            </div>
                                        )
                                    })
                                }
                            </CardContent>
                        }
                        <CardActions>
                            <Button size='small' onClick={() => { this.props.onSubmit(() => { this.setState({ loading: false }) }); this.setState({ loading: true }) }}>
                                <Typography variant='subtitle1' color="text.secondary"  >
                                    Add
                                </Typography>
                            </Button>
                        </CardActions>
                    </Collapse>
                </Card>
            </Grid>
        )
    }
}

export default WidgetNewItem