
import React, { useEffect } from 'react'
import { View, Dimensions, TouchableOpacity, RefreshControl, ScrollView, Layout } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Modal, Button, Text, Card, Spinner, SelectItem, IndexPath, ViewPager } from '@ui-kitten/components'
import Icon from './Icon'
import ActionComponent from './Action'
import { showMessage } from "react-native-flash-message"
const screen = Dimensions.get("screen");


export default Process = (props) => {

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
                let resultSources = await fetch(address + "/api/process/" + props.id , {
                    headers: {
                        Authorization: token
                    }
                })
                let resultSourcesJSON = await resultSources.json()
                if (resultSourcesJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultSourcesJSON.message
                    })
                } else {
                    setData(resultSourcesJSON.data)
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

    useEffect(() => {
        initialisation()
    }, [])

    const middleware = () => {
        inputsValue = {}
        if(data.inputs.length == 0) {
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
                let resultProcess = await fetch(address + "/api/process/" + props.id + "/execute", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        inputs: inputsValue
                    })
                })
                let resultProcessJSON = await resultProcess.json()
                if (resultProcessJSON.error) {
                    showMessage({
                        type: "danger",
                        message: resultProcessJSON.code + " : " + resultProcessJSON.message
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

    if(loading) {
        return (
            <Card onPress={() => { }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
            </Card>
        )
    } else if(onRemove) {
        return (
            <Card  onLongPress={() => { setOnRemove(false) }} onPress={() => { props.onDelete() }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ height: 60, width: 60, alignSelf:'center' }} fill='rgb(143, 155, 179)' name={"close"} />
            </Card>
        )
    } else{
        return (
            <Card onLongPress={() => { setOnRemove(true) }}   onPress={() => { middleware() }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ height: 35, width: 35, alignSelf:'center', marginBottom: 5 }} fill='rgb(143, 155, 179)' name={data.icon} />
                {
                    data.mode == "simple" ?
                    <Text category={props.size > 2 ? "s1" : "h5"} appearance={"default"}>{data.name}</Text>
                    : 
                    <Text category={props.size > 2 ? "s1" : "h5"} appearance={"default"}>{data.enable == 0 ? data.name_enable : data.name_disable}</Text>
                }
                <Modal
                visible={modal}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onBackdropPress={() => setModal(false)}>
                    <Card disabled={true}>
                    {
                                data.inputs.map((settings,index) => {
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
    }
    
}