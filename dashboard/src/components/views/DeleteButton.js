import React from 'react'
import { Card, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'

function DeleteButton(props) {
    return (
        <Card variant='outlined' style={{ width: 'min-content', marginTop: 8, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
            <IconButton style={{borderRadius: 0 }} onClick={() => { props.onClick && props.onClick() }}>
                <Delete  />
            </IconButton>
        </Card>
    )
}

export default DeleteButton