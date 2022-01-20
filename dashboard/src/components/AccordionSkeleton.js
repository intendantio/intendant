import React from 'react'

import { Grid, Card, Skeleton, Typography } from '@mui/material'

const WidgetSkeleton = () => {
    return (
        <Grid item xs={12} md={12} lg={12} style={{marginBottom: 10}}>
            <Card variant='outlined' style={{ padding: 10}} >
                <Typography variant='h6' color="text.secondary">
                    <Skeleton animation="wave" variant="text" />
                </Typography>
                <Typography  variant='body1' >
                    <Skeleton animation="wave" variant="text" />
                </Typography>
            </Card>
        </Grid>
    )
}

export default WidgetSkeleton