import React from 'react'
import { Paper, Grid, Card } from '@mui/material'

class IconList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            icons: [],
            mode: 'normal'
        }
    }

    async componentDidMount() {
        try {
            let result = await fetch(process.env.PUBLIC_URL + '/ressource/icon.json')
            let resultJSON = await result.json()
            this.setState({ icons: resultJSON })
        } catch (error) {
            this.setState({ icons: [] })
        }
    }

    render() {
        return (
            <Card variant="outlined" style={{overflowY: 'inherit'}}>
            <Grid container variant="outlined" spacing={1} style={{ width: '400px', height: '400px', padding: 10, marginRight: 10 }}>
                
                <Grid item xs={6} >
                    <Paper variant="outlined" elevation={0} onClick={() => { this.setState({ mode: 'normal' }) }} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignContent: 'center', padding: 5, alignItems: 'center', alignSelf: 'center' }}>
                        <img style={{ height: 30, width: 30, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/star.svg"} />
                    </Paper>
                </Grid>
                <Grid item xs={6} >
                    <Paper variant="outlined" elevation={0} onClick={() => { this.setState({ mode: 'outline' }) }} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignContent: 'center', padding: 5, alignItems: 'center', alignSelf: 'center' }}>
                        <img style={{ height: 30, width: 30, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/star-outline.svg"} />
                    </Paper>
                </Grid>
                {

                    this.state.icons.filter(icon => {
                        if (icon.search("outline") != -1 && this.state.mode == "outline") {
                            return true
                        } else if (icon.search("outline") == -1 && this.state.mode == "normal") {
                            return true
                        } else {
                            return false
                        }
                    }).map(icon => {
                        return (
                            <Grid item xs >
                                <Paper variant="outlined" elevation={0}  onClick={() => { this.props.onSelect && this.props.onSelect(icon) }} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignContent: 'center', padding: 5, alignItems: 'center', alignSelf: 'center' }}>
                                    <img style={{ height: 30, width: 30, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + icon + ".svg"} />
                                </Paper>
                            </Grid>
                        )
                    })
                }
                
            </Grid>
                </Card>
        )
    }

}

export default IconList