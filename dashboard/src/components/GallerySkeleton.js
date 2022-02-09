import React from 'react'

import { Grid, Card, Skeleton, Typography, CardContent } from '@mui/material'

const GallerySkeleton = () => {
    return (
        <Grid item xs={6} md={3} lg={2}>
                        <Card>
                            <Skeleton variant='rectangular' height={150} />
                            <CardContent >
                                <Typography variant="body1" component="div" >
                                    <Skeleton variant='text' />
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Skeleton variant='text' />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
    )
}

export default GallerySkeleton