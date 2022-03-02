import React from 'react'
import { Popover, InputAdornment, FormControlLabel, Modal, Fade, Select, MenuItem, Checkbox, Slider, FormControl, InputLabel, Card, Typography, Button, TextField, IconButton, Paper } from '@mui/material'
import { Save, Add, List, Cached } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'
import Action from '../../../components/Action'
import Theme from '../../../Theme'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: Theme.palette.background.paper,
    padding: 10,
    borderRadius: 5
}

class NewRoutine extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            popup: false,
            id: props.match.params.id,
            routine: null,
            sources: [],
            modalTrigger: false,
            modalEffect: false
        }
    }


    render() {
            return (
                null
            )
    }
}

export default NewRoutine