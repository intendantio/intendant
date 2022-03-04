import React from 'react'
import { Add, FlashOff, FlashOn, Light } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, CardActionArea, TableContainer, TableHead, TableRow, TablePagination, IconButton, Box } from '@mui/material'
import Request from '../../../utils/Request'
import Desktop from '../../../components/Desktop'
import AddButton from '../../../components/views/AddButton'
import TypeProduct from '../../../components/TypeProduct'
import Loading from '../../../components/Loading'


class Smartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            product: "light",
            smartobjects: [],
            loading: true
        }
        props.setTitle("Smartobject")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ smartobjects: result.data, loading: false })
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Smartobject</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Automate your home</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{marginTop: 0}} >
                        <TypeProduct product={this.state.product} onChange={(product) => { this.setState({ product: product }) }} />
                    </Grid>
                    <Grid container spacing={1} style={{marginTop: 0}}>
                        {
                            this.state.smartobjects.filter(smartobject => {
                                if (smartobject.configuration) { return smartobject.configuration.product == this.state.product }
                                return false
                            }).length == 0 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card variant='outlined' style={{ padding: 12 }}  >
                                        <Typography variant='subtitle1' color="text.secondary" >You have not added a smartobject</Typography>
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
                </Loading>
            </>
        )
    }
}

export default Smartobject