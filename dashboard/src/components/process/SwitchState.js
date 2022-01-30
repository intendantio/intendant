import React from 'react'

import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext } from '@mui/icons-material'



function SwitchState(props) {


    return (
        <Grid item xs={8} md={3} lg={3} style={{ minWidth: 'min-content' }} >
            <Card variant='outlined' >
                <ToggleButtonGroup style={{ width: '100%' }} value={props.state} onChange={(event, state) => {
                    if (state != null) {
                        props.onChange(state)
                    }
                }} exclusive >
                    <ToggleButton style={{ width: '100%', padding: 5 }} value="on">
                        <ToggleOn fontSize='large' />
                        <Typography style={{ marginLeft: 10 }} variant='body1' >{"ON (" + props.actionsOn.length + ")"}</Typography>
                    </ToggleButton >
                    <ToggleButton style={{ width: '100%', padding: 5 }} value="off">
                        <ToggleOff fontSize='large' />
                        <Typography style={{ marginLeft: 10 }} variant='body1' >{"OFF (" + props.actionsOff.length + ")"}</Typography>
                    </ToggleButton >
                </ToggleButtonGroup>
            </Card>
        </Grid>
    )

}

export default SwitchState