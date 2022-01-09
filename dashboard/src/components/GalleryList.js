import React from 'react'
import {Paper, Grid} from '@mui/material'
import _ from 'lodash'

class GalleryList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            icons: []
        }
    }

    async componentDidMount() {
        try {
            let result = await fetch(this.props.action.remote.url)
            let resultJSON = await result.json()
            this.setState({ icons: resultJSON.data.slice })
        } catch (error) {
            this.setState({ icons: [] })
        }
    }

    render() {
        return (
            <Grid container spacing={1} style={{ width: '32vw', height: '32vw',  padding: 10, marginRight: 10 }}>
                {

                    this.state.icons.map((icon,index) => {
                        return (
                            <Grid item xs key={index} >
                                <Paper variant="outlined" onClick={() => {this.props.onSelect && this.props.onSelect(_.get(icon,this.props.action.remote.id))}} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignContent: 'center', padding: 5, alignItems: 'center', alignSelf: 'center' }}>
                                    <img style={{ height: 30, width: 30, alignSelf: 'center' }} src={_.get(icon,this.props.action.remote.image) } />
                                </Paper>
                            </Grid>
                        )
                    })
                }
            </Grid>
        )
    }

}

export default GalleryList