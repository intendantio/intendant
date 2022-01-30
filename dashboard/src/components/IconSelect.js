import React from 'react'
import IconList from './IconList'
import { Grid, Paper, Popover } from '@mui/material'

class IconSelect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            popup: false,
            icon: "activity"
        }
    }


    render() {
        return (
            <>
            <Paper variant="outlined" onClick={() => { this.setState({ popup: true }) }} style={{height: 56,width:56, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignContent: 'center', padding: 12, alignItems: 'center', alignSelf: 'center' }}>
                <img style={{  alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + this.state.icon + ".svg"} />
            </Paper>
            <Popover
                open={this.state.popup}
                onClose={() => { this.setState({ popup: false }) }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
                transformOrigin={{ vertical: 'top', horizontal: 'center', }}
            >
                <IconList onSelect={(icon) => { this.setState({ popup: false, icon: icon }) }} />
            </Popover>
            </>
                
        )
    }

}

export default IconSelect