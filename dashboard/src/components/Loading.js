import React from 'react'
import { Grid, Card, Skeleton } from '@mui/material'

function Loading(props) {
    if (props.loading) {
        return (
            <Card variant='outlined' style={{ padding: 10, marginTop: 8 }}>
                <Grid container >
                    <Grid item xs={12} md={4} lg={4}  style={{paddingLeft: 5, paddingRight: 5}}>
                        <Skeleton height={35} />
                        <Skeleton height={35}/>
                        <Skeleton height={35} />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4} style={{paddingLeft: 5, paddingRight: 5}}>
                        <Skeleton height={35} />
                        <Skeleton height={35}/>
                        <Skeleton height={35}/>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}  style={{paddingLeft: 5, paddingRight: 5}}>
                        <Skeleton height={35} />
                        <Skeleton height={35}/>
                        <Skeleton height={35}/>
                    </Grid>
                </Grid>
            </Card>
        )
    } else {
        return props.children
    }
}

export default Loading