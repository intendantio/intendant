import React from 'react'
import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext } from '@mui/icons-material'



function MergeActions(props) {

    return (
        <Grid item xs={12} md={10} lg={10}>
            <Card variant='outlined' style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
                <Checkbox value={props.value} onChange={(event, value) => { props.onChange(value) }} disabled={props.disabled} style={{ padding: 0, marginRight: 10 }} />
                <Typography variant='subtitle1' color={props.disabled ? "text.secondary" : ""}  >
                    {"Merge the dynamic value parameters of the same name"}
                </Typography>
            </Card>
        </Grid>
    )


}

export default MergeActions