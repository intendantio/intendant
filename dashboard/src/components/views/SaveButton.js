import React from 'react'
import { Card, IconButton } from '@mui/material'
import { Save } from '@mui/icons-material'

function SaveButton(props) {
    return (
        <Card variant='outlined' style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
            <IconButton style={{borderRadius: 0 }} onClick={() => { props.onClick && props.onClick() }}>
                <Save />
            </IconButton>
        </Card>
    )
}

export default SaveButton