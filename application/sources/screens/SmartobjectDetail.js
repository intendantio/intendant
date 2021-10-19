
import React, { useEffect } from 'react'
import { View, SafeAreaView, RefreshControl, ScrollView, useWindowDimensions  } from 'react-native'
import { Button, Layout, Text, Card, TopNavigation, Modal, TopNavigationAction } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../components/Icon'
import ActionComponent from '../components/Action'
import { showMessage } from "react-native-flash-message";

const BackIcon = (props) => (
    <Icon {...props} name='arrow-ios-back-outline' />
)

export default function Detail({ navigation, route }) {

    const [smartobject, setSmartobject] = React.useState(false)
    const [visible, setVisible] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [action, setAction] = React.useState(null)
    const window = useWindowDimensions()
    let inputsValue = {}

    const loadSmartobject = async () => {
        let address = await AsyncStorage.getItem('pegasus-address')
        let profile = await AsyncStorage.getItem('pegasus-profile')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultSmartobject = await fetch(address + "/api/smartobjects/" + route.params.smartobject, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                let resultSmartobjectJSON = await resultSmartobject.json()
                if (resultSmartobjectJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultSmartobjectJSON.message
                    })
                } else {
                    let allow = false
                    resultSmartobjectJSON.data.profiles.forEach(pprofile => {
                        if (pprofile.profile + "" == profile) {
                            allow = true
                        }
                    })
                    resultSmartobjectJSON.data.allow = allow

                    setSmartobject(resultSmartobjectJSON.data)
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
        setLoading(false)
    }

    const executeAction = async (pAction) => {
        setVisible(false)
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultProcess = await fetch(address + "/api/smartobjects/" + smartobject.id + "/actions/" + pAction.id, {
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
                } else {
                    setLoading(true)
                    await loadSmartobject()
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
        loadSmartobject()
    }, [])


    const selectAction = (pAction) => {
        if (pAction.settings.length > 0) {
            setAction(pAction)
            setVisible(true)
        } else {
            executeAction(pAction)
        }
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation alignment='center' accessoryLeft={() => <TopNavigationAction icon={BackIcon} onPress={() => navigation.pop()} />} title={() => { return (<Text category='s1'>Intendant</Text>) }} subtitle={() => { return (<Text appearance='hint' category='s1'>Smartobject</Text>) }} />
                {
                    smartobject && action ? <Modal
                        visible={visible}
                        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onBackdropPress={() => setVisible(false)}>
                        <Card disabled={true} style={{maxWidth: 400, width: window.width * 0.8}}>
                            <Text category='h5' style={{ textAlign: 'center' }}  >{action.name}</Text>
                            {
                                action.settings.map(settings => {
                                    return (
                                        <ActionComponent settings={settings} onUpdate={(id, value) => { inputsValue[id] = value }} />
                                    )
                                })
                            }
                            <Button style={{ marginTop: 15 }} appearance='filled' onPress={() => { executeAction(action) }} status={process.enable == 1 ? "primary" : "danger"} >
                                Valider
                            </Button>
                        </Card>
                    </Modal> : null
                }
                <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadSmartobject() }} />}>
                    {
                        smartobject ?
                            <View style={{ flex: 1, paddingHorizontal: 25 }}>
                                <Text category='h5'>{smartobject.reference}</Text>
                                <Text appearance='hint' category='p1'>{smartobject.module}</Text>
                                <View style={{ marginTop: 25 }}>
                                    <Text category='h6'>{"Action"}</Text>
                                    {
                                        smartobject.actions.map(action => {
                                            return (
                                                <Button key={action.id} appearance='filled' status='primary' onPress={() => { selectAction(action) }} disabled={smartobject.allow == false} style={{ marginVertical: 5, alignSelf: 'flex-start', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                                    <Text category='s1' style={{ textAlign: 'center' }}  >{action.name}</Text>
                                                </Button>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            :
                            null
                    }
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
}