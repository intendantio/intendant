import React from 'react'
import { Typography, Paper, Card, Button } from '@mui/material'
import Alert from '../../../components/Alert'
import { Link } from 'react-router-dom'
import Request from '../../../utils/Request'
import Desktop from '../../../components/Desktop'

class RedirectSmartobject extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            message: "",
            error: false
        }

    }

    async componentDidMount() {
        try {

            let result = await fetch("https://market.intendant.io/docs?id=" + this.props.match.params.id)
            let resultJSON = await result.json()
    

            let settings = {}
            if (location.search.split("?").length == 2) {
                location.search.split("?")[1].split("&").map(param => {
                    let tmp = param.split("=")
                    if (tmp.length == 2) {
                        settings[tmp[0]] = tmp[1]
                    }
                })
            }
            
            if(settings.error == "true") {
                this.setState({
                    message: settings.message.replace(/\%20/g," "),
                    error: true
                })
            } else if(settings.reference == undefined || settings.reference == "") {
                this.setState({
                    message: "Missing reference, please retry",
                    error: true
                })
            } else if(settings.room == undefined || settings.room == "") {
                this.setState({
                    message: "Missing room, please retry",
                    error: true
                })
            } else {
                let reference = settings.reference 
                delete settings.reference
                let room = settings.room
                delete settings.room
                delete settings.error

                let realSettings = []
                for (const key in settings) {
                    realSettings.push({
                        reference: key,
                        value: settings[key]
                    })
                }

                let resultInsert = await new Request().post({ room: room, module: resultJSON.package.name, reference: reference.replace(/\%20/g," "), settings: realSettings }).fetch("/api/smartobjects")
                if (resultInsert.error) {
                    this.setState({
                        message: resultInsert.message,
                        error: true
                    })
                } else {
                    this.props.history.push('/smartobject/' + resultInsert.data.id)
                }
            }

        } catch (error) {
            this.setState({
                message: error.toString(),
                error: true
            })
        }
    }



    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >Smartobject</Typography>
                        <Typography variant='sutitle2' color="text.secondary" >{"oAuth redirect"}</Typography>
                    </Paper>
                </Desktop>
                {
                    this.state.error ?
                    <Card variant='outlined' style={{padding: 10}}>
                    <Typography variant='h5' >{"Oups ! Smartobject cannot to be create"}</Typography>
                    <Typography style={{marginTop: 5}} variant='subtitle1' >{"Reason : " + this.state.message}</Typography>
                    <Link to={'/smartobject/new/' + this.props.match.params.id}>
                        <Button variant='outlined' color='inherit' style={{marginTop: 10, borderColor:'white', color:'white'}}>
                            {"Retry now"}
                        </Button>
                    </Link>
                    </Card> : null
                }
            </>
        )
    }
}

export default RedirectSmartobject