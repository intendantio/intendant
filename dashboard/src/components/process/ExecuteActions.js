import React from 'react'
import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext } from '@mui/icons-material'



function ExecuteActions(props) {

    return (
        <Grid item xs={12} md={12} lg={12} >
            <Card variant='outlined' style={{ height: '100%', display: 'flex', alignItems: 'center' }} >
                <Grid container spacing={1} style={{ padding: 10 }} >
                    <Grid item xs={12} md={12} lg={12} key={0} >
                        <Typography variant='subtitle1'  >{
                            props.mode == "button" ?
                                "Action executed"
                                :
                                "Action executed in mode " + props.state.toUpperCase()
                        }</Typography>
                        <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                    </Grid>
                    {

                        props.actions.map((action, ppIndex) => {
                            return (
                                <Grid item xs={12} md={6} lg={6} key={ppIndex} >
                                    <Card variant='outlined'   >
                                        <CardActionArea onClick={() => { props.onChange(action) }} style={{ padding: 8 }}>
                                            <Typography variant='body1' >
                                                {action.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" >
                                                {action.parent.reference}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Card>
        </Grid>
    )


}

export default ExecuteActions