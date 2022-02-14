import React from 'react'
import { Card, IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function AddButton(props) {
    return (
        <Card variant='outlined' style={{ width: 'min-content', marginTop: 8, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
            <Link to={props.to}>
                <IconButton style={{borderRadius: 0 }} >
                    <Add  />
                </IconButton>
            </Link>
        </Card>
    )
}

export default AddButton