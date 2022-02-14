import React from 'react'
import { BarChart } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, Box, CardActionArea } from '@mui/material'
import Request from '../../../utils/Request'
import Desktop from '../../../components/Desktop'

import AddButton from '../../../components/views/AddButton'
import Loading from '../../../components/Loading'


class Rapport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            rapports: []
        }
        props.setTitle("Rapport")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/rapports")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, rapports: result.data })
        }
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Rapport</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Capture your data</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        {
                            this.state.rapports.length == 0 ?
                            <Grid item xs={12} md={12} lg={12}>
                                <Card variant='outlined' style={{ padding: 12 }}  >
                                    <Typography variant='subtitle1' color="text.secondary" >You have not added a rapport</Typography>
                                </Card>
                            </Grid>
                            :
                            this.state.rapports.map((rapport,index) => {
                                return (
                                    <Grid key={index} item xs={12} md={12} lg={12} >
                                        <Card variant='outlined'   >
                                            <CardActionArea onClick={() => { this.props.history.push('/rapport/' + rapport.id) }} style={{ padding: 12, display: 'flex', justifyContent: 'flex-start' }} >
                                                <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                    <BarChart fontSize='large' />
                                                </Box>
                                                <Box style={{ display: 'flex', flex: 1 }} >
                                                    <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                        <Typography variant='subtitle1'  >
                                                            {String.capitalizeFirstLetter(rapport.configuration.module == "smartobject" ? (rapport.reference + " - " + rapport.smartobject.reference) : rapport.reference)}
                                                        </Typography>
                                                        <Typography variant='body2' color="text.secondary"  >
                                                            {String.capitalizeFirstLetter(rapport.configuration.name)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    <AddButton to="/rapport/new" />
                </Loading>
            </>
        )
    }
}


export default Rapport