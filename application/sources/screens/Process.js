
import React, { useEffect } from 'react'
import { View, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { Button, Layout, Text, TopNavigationAction, TopNavigation, Modal, Card } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ActionComponent from '../components/Action'
import Icon from '../components/Icon'
import { showMessage } from "react-native-flash-message"

const BackIcon = (props) => (
    <Icon {...props} name='arrow-ios-back-outline' />
)

export default function Espace({ navigation, route }) {
    let inputsValue = {}
    const [processs, setProcesss] = React.useState([])
    const [profile, setProfile] = React.useState("")
    const [loading, setLoading] = React.useState(true)
    const [process, setProcess] = React.useState({ inputs: [] })
    const [visible, setVisible] = React.useState(false)
    const loadProcess = async () => {
        let address = await AsyncStorage.getItem('pegasus-address')
        let profile = await AsyncStorage.getItem('pegasus-profile')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultProcess = await fetch(address + "/api/process", {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                let resultProcessJSON = await resultProcess.json()
                if (resultProcessJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultProcessJSON.message
                    })
                } else {
                    setProfile(profile)
                    setProcesss(resultProcessJSON.data.filter(process => {
                        return process.espace.id == route.params.espace
                    }))
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

    useEffect(() => {
        loadProcess()
    }, [])

    const executeAction = async (process) => {
        setVisible(false)
        setProcess({ inputs: [] })
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultProcess = await fetch(address + "/api/process/" + process.id + "/execute", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + token
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
                } else {
                    setLoading(true)
                    setProcesss([])
                    await loadProcess()
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

    const selectProcess = (process) => {
        let sizeInput = 0
        inputsValue = {}
        if (process.mode == "switch") {
            sizeInput = process.inputs.filter(input => {
                return process.enable == input.enable
            }).length
        } else {
            sizeInput = process.inputs.length
        }
        if (sizeInput > 0) {
            setProcess(process)
            setVisible(true)
        } else {
            executeAction(process)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation
                    alignment='center'
                    accessoryLeft={() => <TopNavigationAction icon={BackIcon} onPress={() => navigation.pop()} />}
                    title={() => { return (<Text category='s1'>Intendant</Text>) }}
                    subtitle={() => { return (<Text appearance='hint' category='s1'>Processus</Text>) }}
                />
                <Modal
                    visible={visible}
                    backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onBackdropPress={() => setVisible(false)}>
                    <Card disabled={true}>
                        <Text category='h6' style={{ marginBottom: 5 }}  >{process.description}</Text>
                        {
                            process.inputs.map((input,index) => {
                                return <ActionComponent key={index} settings={input} onUpdate={(id, value) => { inputsValue[id] = value }} />
                            })
                        }
                        <Button style={{ marginTop: 15 }} appearance='filled' onPress={() => { executeAction(process) }} status={process.enable == 1 ? "primary" : "danger"} >
                            Valider
                        </Button>
                    </Card>
                </Modal>
                <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadProcess() }} />} style={{ flex: 1, paddingHorizontal: 10 }}>
                    {
                        processs.map(process => {
                            let allow = false
                            process.profiles.forEach(pprofile => {
                                if (pprofile.profile + "" == profile) {
                                    allow = true
                                }
                            })
                            return (
                                <View key={process.id} style={{ alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 5 }} >
                                    <Button size='small' appearance='filled' disabled={allow == false} onPress={() => { selectProcess(process) }} status={process.enable == 1 ? "danger" : "primary"} accessoryLeft={(props) => <Icon {...props} name={allow == false ? 'lock-outline' : process.icon} />}  >
                                        <Text category='h6'>
                                            {process.mode == 'simple' ? process.name : process.enable == 0 ? process.name_disable : process.name_enable}
                                        </Text>
                                    </Button>
                                    <Text appearance='hint' category='s2' style={{ marginTop: 2 }} >{process.description}</Text>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </Layout>
        </SafeAreaView>
    )
}