import React from 'react'

import QRCode from 'qrcode.react'
import { Paper} from '@mui/material'

class QrCode extends React.Component {

    render() {
        return (
            <Paper variant="outlined" style={{padding: 10, display:'flex', justifyContent:'center'}} >
                <QRCode style={{borderRadius: 3}} value={this.props.match.params.id} size={256} includeMargin={true} />
            </Paper>
        )
    }
}

export default QrCode