import React from 'react'
import { Typography, Paper, Grid, Card, CardActionArea, Box } from '@mui/material'
import Desktop from '../../../components/Desktop'
import Loading from '../../../components/Loading'
import Request from '../../../utils/Request'
import md5 from 'md5'
import DownloadButton from '../../../components/views/DownloadButton'
import Utils from '../../../utils/Utils'


class Module extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            modules: []
        }
        props.setTitle("Module")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/modules")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, modules: result.data })
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Module</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Execute action</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        {
                            this.state.modules.length == 0 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card variant='outlined' style={{ padding: 12 }}  >
                                        <Typography variant='subtitle1' color="text.secondary" >You have not installed a module</Typography>
                                    </Card>
                                </Grid>
                                :
                                this.state.modules.map((pModule, index) => {
                                    return (
                                        <Grid key={index} item xs={12} md={4} lg={4}  >
                                            <Card variant={'outlined'}   >
                                                <CardActionArea style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} onClick={() => { this.props.history.push('/module/' + Utils.getSum(pModule.name)) }}  >
                                                    <Box style={{ display: 'flex', flex: 1 }} >
                                                        <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                            <Typography variant='subtitle1' color={"text.primary"} >
                                                                {pModule.reference}
                                                            </Typography>
                                                            <Typography variant='body2' color={"text.secondary"}  >
                                                                {pModule.name}
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
                    <DownloadButton to="/module/gallery" />
                </Loading>
            </>
        )
    }
}

export default Module