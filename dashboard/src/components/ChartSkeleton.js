import React from 'react'

import { Grid, Card, Skeleton, Typography } from '@mui/material'

const WidgetSkeleton = () => {
    return (
        <Grid item xs={12} md={4} lg={3}>
            <Card variant='outlined' style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10 }} >
                <Typography variant='body1' color="text.secondary">
                    <Skeleton animation="wave" variant="text" />
                </Typography>
                <Typography gutterBottom variant='h4' component='div'>
                    <Skeleton animation="wave" variant="text" />
                </Typography>
                <Typography variant='body1' color="text.secondary">
                    <Skeleton animation="wave" variant="text" />
                    <Skeleton animation="wave" variant="text" />
                </Typography>
            </Card>
        </Grid>
    )
}

export default WidgetSkeleton