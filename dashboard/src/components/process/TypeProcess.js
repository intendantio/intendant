import React from 'react'

import { Grid, Card, Box, Typography, CardActionArea } from '@mui/material'
import { ToggleOff, RadioButtonChecked} from '@mui/icons-material'


function TypeProcess(props) {

    return (
        <>
            <Grid item xs={12} md={12} lg={12} >
                <Card variant='outlined'   >
                    <CardActionArea onClick={() => { props.onChange("button") }} style={{ padding: 10, display: 'flex', justifyContent: 'flex-start' }} >
                        <RadioButtonChecked fontSize='large' />
                        <Box style={{ marginLeft: 15 }}>
                            <Typography variant='subtitle1'  >
                                {"Button"}
                            </Typography>
                            <Typography variant='body2' color="text.secondary"  >
                                {"Same action for each execution"}
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={12} >
                <Card variant='outlined'   >
                    <CardActionArea onClick={() => { props.onChange("switch") }} style={{ padding: 10, display: 'flex', justifyContent: 'flex-start' }} >
                        <ToggleOff fontSize='large' />
                        <Box style={{ marginLeft: 15 }}>
                            <Typography variant='subtitle1'  >
                                {"Switch"}
                            </Typography>
                            <Typography variant='body2' color="text.secondary"  >
                                {"Two state, like an real switch (ON / OFF)"}
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            </Grid>
        </>
    )

}


export default TypeProcess