import React from 'react'
import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext } from '@mui/icons-material'



function Descriptions(props) {

    return (
        props.mode == "button" ?
            <Grid item xs={12} md={12} lg={12}>
                <Card variant='outlined' style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={5} lg={5}>
                            <TextField  onChange={(event) => { props.onChange("",event.nativeEvent.target.value) }} placeholder='Description' style={{ width: '100%' }} >

                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={5} lg={5}>
                            <TextField  onChange={(event) => { props.onChange("on",event.nativeEvent.target.value) }} placeholder='Action name' style={{ width: '100%' }} >

                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2} style={{ display: 'flex', justifyContent: 'end' }}>
                            <Card variant='outlined' style={{ height: '100%', width: 'min-content' }} >
                                <CardActionArea onClick={() => {  props.onClick() }} style={{ padding: 8, paddingLeft: 16, paddingRight: 16, display: 'flex', height: '100%' }}>
                                    <Typography variant='subtitle1'  >Submit</Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>

                </Card>
            </Grid>
            :
            <>
                <Grid item xs={12} md={12} lg={12}>
                    <Card variant='outlined' style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
                        <Grid container spacing={1}>
                        <Grid item xs={12} md={10} lg={10}>
                                <TextField onChange={(event) => { props.onChange("",event.nativeEvent.target.value) }} placeholder='Description' style={{ width: '100%' }} >

                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={5} lg={5}>
                                <TextField onChange={(event) => { props.onChange("on",event.nativeEvent.target.value) }} placeholder='Action name in ON mode' style={{ width: '100%' }} >

                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={5} lg={5}>
                                <TextField onChange={(event) => { props.onChange("off",event.nativeEvent.target.value) }} placeholder='Action name in OFF mode' style={{ width: '100%' }} >

                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2} style={{ display: 'flex', justifyContent: 'end' }}>
                                <Card variant='outlined' style={{ height: '100%', width: 'min-content' }} >
                                    <CardActionArea onClick={() => { props.onClick() }} style={{ padding: 8, paddingLeft: 16, paddingRight: 16, display: 'flex', height: '100%' }}>
                                        <Typography variant='subtitle1'  >Submit</Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </>
    )


}

export default Descriptions