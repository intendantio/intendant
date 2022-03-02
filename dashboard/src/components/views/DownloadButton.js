import React from 'react'
import { Card, IconButton } from '@mui/material'
import { Download } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function DownloadButton(props) {
    return (
        <Card variant='outlined' style={{ width: 'min-content', marginTop: 8, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
            <Link to={props.to}>
                <IconButton style={{borderRadius: 0 }} >
                    <Download  />
                </IconButton>
            </Link>
        </Card>
    )
}

export default DownloadButton