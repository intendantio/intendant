import React from 'react'
import { CheckCircle, HourglassEmpty, AddCircle, Help, Error, DownloadForOffline } from '@mui/icons-material'

function Status(props) {
    switch (props.type) {
        case "online":
            return <CheckCircle fontSize='large' />
        case "create":
            return <AddCircle fontSize='large' />
        case "error":
            return <Error fontSize='large' />
        case "unknown":
        default:
            return <Help fontSize='large' />

    }
}

export default Status