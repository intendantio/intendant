import React from 'react'

import { Snackbar, Alert } from '@mui/material'

class MuiAlert extends React.Component {

    render() {
        return (
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={this.props.open} autoHideDuration={6000} onClose={() => this.props.onClose()}>
                <Alert  severity={this.props.severity} elevation={0}  {...this.props} />
            </Snackbar>
        )
    }
    
}

export default MuiAlert