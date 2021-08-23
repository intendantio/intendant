import MuiAlert from '@material-ui/lab/Alert'
import { Snackbar } from '@material-ui/core'

function Alert(props) {
    return (
        <Snackbar open={props.open} autoHideDuration={6000} onClose={() => props.onClose()}>
            <MuiAlert severity={props.severity} elevation={6} variant="filled" {...props} />
        </Snackbar>
    )
}

export default Alert