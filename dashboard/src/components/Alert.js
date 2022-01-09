
import { Snackbar, Alert } from '@mui/material'

function MuiAlert(props) {
    return (
        <Snackbar open={props.open} autoHideDuration={6000} onClose={() => props.onClose()}>
            <Alert severity={props.severity} elevation={6}  {...props} />
        </Snackbar>
    )
}

export default MuiAlert