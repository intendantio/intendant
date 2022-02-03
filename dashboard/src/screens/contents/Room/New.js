import React from 'react'
import { IconButton, TextField, Select, Grid, Card, InputLabel, Typography, Paper, CardActionArea } from '@mui/material'
import { Hotel, KingBed, Balcony, Bathtub, Shower, Kitchen, Blender, Weekend, Chair, Tv, Crib, MeetingRoom, Park, LocalFlorist, AutoStories } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import SaveButton from '../../../components/views/SaveButton'
import Request from '../../../utils/Request'

const IconContainer = (props) => {
    return (
        <Card variant="outlined" style={{borderColor: props.enabled ? 'white' : null ,  alignSelf: 'center', height: 'minContent', marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}>
            <CardActionArea onClick={() => props.onClick(props.name)} style={{ padding: 5 }}>
                {
                    props.children
                }
            </CardActionArea>
        </Card>
    )
}


class NewLocalisation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            description: "",
            icon: "Hotel"
        }
        props.setTitle("New room")
        props.setActionType("return")
    }


    async add() {
        if (this.state.name === "") {
            this.setState({ enabled: true, message: "Missing-parameter : name is empty" })
        } else {
            let result = await new Request().post({ name: this.state.name, icon: this.state.icon, description: this.state.description }).fetch("/api/rooms")
            if (result.error) {
                this.setState({
                    enabled: true,
                    message: result.package + " : " + result.message
                })
            } else {
                this.props.history.push('/room')
            }
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Card variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >New room</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Adding a room to your home</Typography>
                    </Card>
                </Desktop>
                <Grid container spacing={1} style={{ marginTop: -10 }} >
                    <Grid item xs={12} md={12} lg={12}>
                        <Card variant="outlined" style={{ padding: 10, textAlign: 'center', display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                            <IconContainer enabled={this.state.icon == "Hotel"} name="Hotel" onClick={(icon) => { this.setState({ icon: icon }) }} >
                                <Hotel fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "KingBed"} name="KingBed" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <KingBed fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Crib"} name="Crib" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Crib fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Bathtub"} name="Bathtub" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Bathtub fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Shower"} name="Shower" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Shower fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Kitchen"} name="Kitchen" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Kitchen fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Blender"} name="Blender" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Blender fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Chair"} name="Chair" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Chair fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Weekend"} name="Weekend" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Weekend fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Tv"} name="Tv" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Tv fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Balcony"} name="Balcony" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Balcony fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "MeetingRoom"} name="MeetingRoom" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <MeetingRoom fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "Park"} name="Park" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <Park fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "LocalFlorist"} name="LocalFlorist" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <LocalFlorist fontSize='large' />
                            </IconContainer>
                            <IconContainer enabled={this.state.icon == "AutoStories"} name="AutoStories" onClick={(icon) => { this.setState({ icon: icon }) }}>
                                <AutoStories fontSize='large' />
                            </IconContainer>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <Card variant="outlined" style={{ padding: 10 }}>
                            <TextField onChange={(event) => { this.setState({ name: event.nativeEvent.target.value }) }} style={{ width: '100%', marginRight: 10 }} label="Name" variant="outlined" />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <Card variant="outlined" style={{ padding: 10 }}>
                            <TextField onChange={(event) => { this.setState({ description: event.nativeEvent.target.value }) }} style={{ width: '100%', marginRight: 10 }} label="Description" variant="outlined" />
                        </Card>
                    </Grid>
                </Grid>
                <SaveButton onClick={() => { this.add() }} />
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </>
        )
    }
}

export default NewLocalisation