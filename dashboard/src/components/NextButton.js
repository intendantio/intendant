import React from 'react'

import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext } from '@mui/icons-material'



function NextButton(props) {

    return (
        <Grid item xs={props.xs ? props.xs : 4} md={props.md ? props.md : 5} lg={props.lg ? props.lg : 5} style={{ display: 'flex', justifyContent: 'end' }}>
            <Card variant='outlined' style={{ height: '100%', width: 'min-content' }} >
                <CardActionArea onClick={() => { props.onClick() }} style={{ padding: 8, paddingLeft: 16, display: 'flex', height: '100%' }}>
                    <Typography variant='body1' >Next</Typography>
                    <NavigateNext />
                </CardActionArea>
            </Card>
        </Grid>
    )
                       
}

export default NextButton