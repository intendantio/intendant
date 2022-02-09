import React from 'react'
import { Link } from "react-router-dom"
import Moment from 'moment'
import { Add, FlashOff, FlashOn, Light } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, CardActionArea, TableContainer, TableHead, TableRow, TablePagination, IconButton, Box } from '@mui/material'
import Icon from '../../../utils/Icon'
import Request from '../../../utils/Request'
import Alert from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import AddButton from '../../../components/views/AddButton'
import Status from '../../../components/views/Status'
import TypeProduct from '../../../components/TypeProduct'


class Smartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            product: "light",
            smartobjects: []
        }
        props.setTitle("Smartobject")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({
                smartobjects: result.data
            })
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >Smartobject</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Automate your home</Typography>
                    </Paper>
                </Desktop>
                <Grid container spacing={2} style={{marginBottom: 10}}>
                    <TypeProduct product={this.state.product} onChange={(product) => { this.setState({ product: product }) }} />
                </Grid>
                <Grid container spacing={2}>
                    {
                        this.state.loading ?
                            <>
                                <ProcessSkeleton />
                                <ProcessSkeleton />
                                <ProcessSkeleton />
                                <ProcessSkeleton />
                            </>
                            :
                            this.state.smartobjects.length == 0 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card variant='outlined' style={{ padding: 12 }}  >
                                        <Typography variant='subtitle1' color="text.secondary" >You have not added a process</Typography>
                                    </Card>
                                </Grid>
                                :
                                this.state.smartobjects.filter(smartobject => {
                                    if (smartobject.configuration) {
                                        return smartobject.configuration.product == this.state.product
                                    }
                                    return false
                                }).map(smartobject => {
                                    return (
                                        <Grid item xs={12} md={6} lg={6} >
                                            <Card variant={'outlined'}   >
                                                <CardActionArea style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} onClick={() => { this.props.history.push('/smartobject/' + smartobject.id) }}  >

                                                    <Box style={{ display: 'flex', flex: 1 }} >
                                                        <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                            {smartobject.state.status == "online" ? <FlashOn fontSize='large' /> : <FlashOff color='disabled' fontSize='large' />}
                                                        </Box>
                                                        <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                            <Typography variant='subtitle1' color={smartobject.state.status == "online" ? "text.primary" : "text.secondary"} >
                                                                {smartobject.reference}
                                                            </Typography>
                                                            <Typography variant='body2' color={smartobject.state.status == "online" ? "text.secondary" : "text.secondary"}  >
                                                                {smartobject.module}
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
                <AddButton to="/smartobject/gallery" />
            </>
        )
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Smartobject