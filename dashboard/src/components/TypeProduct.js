import React from 'react'

import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext, Hub } from '@mui/icons-material'



function TypeProduct(props) {

    return (
        <Grid item xs={8} md={4} lg={4} style={{ minWidth: 'min-content' }} >
            <Card variant='outlined' >
                <ToggleButtonGroup style={{ width: '100%' }} value={props.product} onChange={(event, product) => {
                    if (product != null) {
                        props.onChange(product)
                    }
                }} exclusive >
                    <ToggleButton style={{ width: '100%' }} value="light">
                        <Lightbulb />
                    </ToggleButton >
                    <ToggleButton style={{ width: '100%' }} value="sensor">
                        <Thermostat />
                    </ToggleButton >
                    <ToggleButton style={{ width: '100%' }} value="clock">
                        <Alarm />
                    </ToggleButton >
                    <ToggleButton style={{ width: '100%' }} value="switch">
                        <SettingsRemote />
                    </ToggleButton >
                    <ToggleButton style={{ width: '100%' }} value="cloud">
                        <Cloud />
                    </ToggleButton >
                    <ToggleButton style={{ width: '100%' }} value="bridge">
                        <Hub />
                    </ToggleButton >
                </ToggleButtonGroup>
            </Card>
        </Grid>
    )
}

export default TypeProduct