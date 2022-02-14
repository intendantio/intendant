import React from 'react'

import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext } from '@mui/icons-material'



function ListModulesActions(props) {

    return null
    return props.smartobjects.map((smartobject, index) => {
        return (
            <Grid item xs={12} md={12} lg={12} >
                <Accordion style={{ borderRadius: 5 }} variant='outlined' expanded={props.index == index} onChange={() => { props.onOpen(index) }}>
                    <AccordionSummary expandIcon={<ExpandMore />} >
                        <Box>
                            <Typography variant='subtitle1'   >
                                {smartobject.reference}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <Divider style={{ marginBottom: 15 }} />
                    <AccordionDetails>
                        <Grid container spacing={1} >
                            {
                                smartobject.configuration.actions.map((action, ppIndex) => {
                                    return (
                                        <Grid item xs={12} md={3} lg={3} key={ppIndex} >
                                            <Card variant='outlined' style={{ backgroundColor: props.actions.includes(action) ? "rgb(0, 127, 255)" : "" }}  >
                                                <CardActionArea onClick={() => { props.onChange(action) }} style={{ padding: 10 }}>
                                                    <Typography fontWeight={500} variant='body2' color="text.secondary">
                                                        {action.name}
                                                    </Typography>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        )
    })

}


export default ListSmartobjectsActions