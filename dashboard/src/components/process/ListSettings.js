import React from 'react'

import Mobile from '../Mobile'
import Desktop from '../Desktop'
import Action from '../Action'

import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'


function ListSettings(props) {


    return props.settings.map((setting, index) => {
        return (
            <Grid item xs={12} md={12} lg={12}>
                <Card variant='outlined' style={{ padding: 10 }}>
                    <Grid container spacing={1} >
                        <Mobile isMobile={props.isMobile}>
                            {
                                props.mode == "switch" ?

                                    <Grid item xs={2} md={2} lg={2} >
                                        <Card style={{ padding: 8, paddingLeft: 16, paddingRight: 16, alignSelf: 'center', width: 'min-content' }} variant='outlined'>
                                            <Typography variant='subtitle1' textAlign={'center'} >
                                                {setting.state.toUpperCase()}
                                            </Typography>
                                        </Card>
                                    </Grid> : null
                            }
                        </Mobile>

                        <Grid item xs={10} md={3} lg={3}>
                            <Typography variant='body1' >
                                {setting.setting.parent.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" >
                                {setting.setting.parent.parent.reference}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2}>
                            <Typography variant='body1'   >
                                {capitalizeFirstLetter(setting.setting.id)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" >
                                {"Default: " + setting.setting.default}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} style={{ alignSelf: 'center' }}>
                            <ToggleButtonGroup value={props.settingsMode[index]} onChange={(event, settingMode) => {
                                if (settingMode != null) {
                                    props.settingsMode[index] = settingMode
                                    props.onChange(props.settingsMode)
                                }
                            }} exclusive >
                                <ToggleButton style={{ textTransform: 'initial' }} value="default">
                                    <Typography variant='body2' >
                                        {"Default value"}
                                    </Typography>
                                </ToggleButton >
                                <ToggleButton style={{ textTransform: 'initial' }} value="custom">
                                    <Typography variant='body2' >
                                        Custom value
                                    </Typography>
                                </ToggleButton >
                                <ToggleButton style={{ textTransform: 'initial' }} value="dynamic">
                                    <Typography variant='body2' >
                                        Dynamic value
                                    </Typography>
                                </ToggleButton >
                            </ToggleButtonGroup>
                            {
                                props.settingsMode[index] == "custom" &&
                                <Box style={{ width: 'min-content', marginTop: 10 }}>
                                    <Action noLabel setState={props.setState} id={"setting-" + index} action={setting.setting} flexDirection='column' orientation='horizontal' />
                                </Box>
                            }
                        </Grid>
                        <Desktop isMobile={props.isMobile}>
                            {
                                props.mode == "switch" &&
                                <Grid item xs={12} md={2} lg={2} style={{ display: 'flex', justifyContent: 'end', alignSelf: 'flex-start' }}>
                                    <Card style={{ padding: 8, alignSelf: 'center', width: 'min-content' }} variant='outlined'>
                                        <Typography variant='subtitle1' >
                                            {setting.state.toUpperCase()}
                                        </Typography>
                                    </Card>
                                </Grid>
                            }
                        </Desktop>
                    </Grid>
                </Card>
            </Grid>
        )
    })

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default ListSettings