import React from 'react'
import md5 from 'md5'
import JSONPretty from 'react-json-pretty'

import QRCode from 'qrcode.react'
import { Alert } from '@material-ui/lab'
import { Close } from '@mui/icons-material'
import { Paper, Typography, Divider, Button, IconButton } from '@material-ui/core'
import AlertComponent from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

class QrCode extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.props.match.params.id)
    }

    render() {
        return (
            <Paper elevation={2} style={{padding: 10, display:'flex', justifyContent:'center'}} >
                <QRCode style={{borderRadius: 3}} value={this.props.match.params.id} size={256} includeMargin={true} />
            </Paper>
        )
    }
}

export default QrCode