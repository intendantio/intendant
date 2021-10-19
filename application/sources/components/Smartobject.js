
import React, { useEffect } from 'react'
import { View, Dimensions, TouchableOpacity, RefreshControl, ScrollView, Layout } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Modal, Button, Text, Card, Spinner, SelectItem, IndexPath, ViewPager } from '@ui-kitten/components'
import Icon from './Icon'
import ActionComponent from './Action'
import { showMessage } from "react-native-flash-message"
const screen = Dimensions.get("screen");


export default Smartobject = (props) => {

    let inputsValue = {}

    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState(false)
    const [onRemove, setOnRemove] = React.useState(false)
    const [modal, setModal] = React.useState(false)

    const initialisation = async () => {
        setLoading(true)
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultSources = await fetch(address + "/api/smartobjects/" + props.id, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                let resultSourcesJSON = await resultSources.json()
                if (resultSourcesJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultSourcesJSON.message
                    })
                } else {
                    let pSmartobject = resultSourcesJSON.data
                    pSmartobject.action = {
                        id: "no_id",
                        name: "No action",
                        settings: []
                    }
                    pSmartobject.actions.forEach(paction => {
                        if (paction.id == props.action) {
                            pSmartobject.action = paction
                        }
                    })
                    
                    setData(pSmartobject)
                }
            } catch (error) {
                showMessage({
                    type: "danger",
                    message: 'Error: A creash error has occurred ' + JSON.stringify(error)
                })
            }
        } else {
            showMessage({
                type: "danger",
                message: 'Error: A server error has occurred'
            })
        }
        setLoading(false)
    }

    const middleware = () => {
        if(data.action.id == "no_id") {
            return
        }
        inputsValue = {}
        if(data.action.settings.length == 0) {
            execute()
        } else {
            setModal(true)
        }
    }

    const execute = async () => {
        setModal(false)
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultProcess = await fetch(address + "/api/smartobjects/" + props.id + "/actions/" + data.action.id, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        settings: inputsValue
                    })
                })
                let resultSmartobjectJSON = await resultProcess.json()
                if (resultSmartobjectJSON.error) {
                    showMessage({
                        type: "danger",
                        message: resultSmartobjectJSON.code + " : " + resultSmartobjectJSON.message
                    })
                }
            } catch (error) {
                showMessage({
                    type: "danger",
                    message: 'Error: A server error has occurred'
                })
            }
        } else {
            showMessage({
                type: "danger",
                message: 'Error: A server error has occurred'
            })
        }
    }

    useEffect(() => {
        initialisation()
    }, [])



    if (loading) {
        return (
            <Card onPress={() => { }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
            </Card>
        )
    } else if (onRemove) {
        return (
            <Card onLongPress={() => { setOnRemove(false) }} onPress={() => { props.onDelete() }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ height: 60, width: 60, alignSelf: 'center' }} fill='rgb(143, 155, 179)' name={"close"} />
            </Card>
        )
    } else if(data) {
        return (
            <Card onLongPress={() => { setOnRemove(true) }} onPress={() => { middleware()}} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ height: 30, width: 30, alignSelf: 'center', marginBottom: 5 }} fill='rgb(143, 155, 179)' name={data.icon} />
                <Text category={props.size > 2 && props.rows == 4 ? "s1" : "h5"} appearance={"default"}>{data.reference}</Text>
                <Text category={props.size > 2 && props.rows == 4 ? "s2" : "h6"} appearance={"hint"}>{data.action.name}</Text>
                <Modal
                visible={modal}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onBackdropPress={() => setModal(false)}>
                    <Card disabled={true}>
                    {
                                data.action.settings.map((settings,index) => {
                                    return (
                                        <ActionComponent key={index} settings={settings} onUpdate={(id, value) => { inputsValue[id] = value }} />
                                    )
                                })
                            }
                            <Button style={{ marginTop: 15 }} appearance='filled' onPress={() => { execute() }} status={process.enable == 1 ? "primary" : "danger"} >
                                Valider
                            </Button>
                    </Card>
            </Modal>
            </Card>
        )
    } else {
        return (
            <Card onPress={() => { }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
            </Card>
        )
    }

}