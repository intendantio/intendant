import React from 'react'
import { Download, FlashOff, FlashOn, HourglassEmpty } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, Box, CardActionArea } from '@mui/material'
import Desktop from '../../../components/Desktop'
import Loading from '../../../components/Loading'
import Request from '../../../utils/Request'
import Utils from '../../../utils/Utils'

class Module extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            modules: [],
            loadingAction: []
        }
        props.setTitle("Module")
        props.setActionType("return")
    }

    async componentDidMount() {
        let result = await fetch("https://market.intendant.io/modules.json")
        let resultModule = await new Request().get().fetch("/api/modules")
        let resultJSON = await result.json()
        if (resultJSON.error) {
            this.props.setMessage(resultJSON.package + " : " + resultJSON.message)
        } else if (resultModule.error) {
            this.props.setMessage(resultModule.package + " : " + resultModule.message)
        } else {
            let modules = resultJSON.map(pModule => {
                let find = false
                resultModule.data.forEach(installModule => {
                    if (installModule.name == pModule.name) {
                        find = true
                    }
                })
                pModule.install = find
                return pModule
            })
            this.setState({
                loading: false,
                modules: modules
            })
        }
    }


    async install(idModule) {
        let loadingAction = this.state.loadingAction
        loadingAction.push(idModule)
        this.setState({ loadingAction: loadingAction })

        let result = await new Request().patch().fetch("/api/modules/" + idModule)
        console.log(result)
        let index = this.state.loadingAction.indexOf(idModule)
        loadingAction = this.state.loadingAction
        loadingAction.splice(index, 1)

        this.setState({ loadingAction: loadingAction })
        
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            
            this.componentDidMount()
        }
    }


    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Module</Typography>
                        <Typography variant='subtitle2' color="text.secondary"  >Automate your home</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        {
                            this.state.modules.map((pModule, index) => {
                                return (
                                    <Grid key={index} item xs={12} md={6} lg={4} >
                                        <Card variant={'outlined'}  >
                                            <CardActionArea onClick={() => {this.install(Utils.getSum(pModule.name))}}  disabled={this.state.loadingAction.includes(Utils.getSum(pModule.name)) || pModule.install} style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}   >
                                                <Box style={{ display: 'flex', flex: 1 }} >
                                                    <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                        {this.state.loadingAction.includes(Utils.getSum(pModule.name)) ? <HourglassEmpty  fontSize='large'  /> :  pModule.install ? <FlashOn fontSize='large' color='disabled' /> : <Download fontSize='large' />}
                                                    </Box>
                                                    <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                        <Typography variant='subtitle1' color={ pModule.install ?  "text.secondary"  : "text.primary"} >
                                                            {pModule.reference}
                                                        </Typography>
                                                        <Typography variant='body2' color={ pModule.install ?  "text.secondary"  : "text.primary"}  >
                                                            {"Free"}
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
                </Loading>
            </>
        )
    }
}

export default Module