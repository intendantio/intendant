
import React, { useEffect } from 'react'
import { SafeAreaView, RefreshControl, ScrollView } from 'react-native'
import { Button, Layout, Text, TopNavigationAction, TopNavigation, ListItem } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../components/Icon'
import { showMessage } from "react-native-flash-message";

const BackIcon = (props) => (
    <Icon {...props} name='arrow-ios-back-outline' />
)

export default function Application({ navigation, route }) {
    const [routines, setRoutines] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const loadRoutine = async () => {
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultRoutine = await fetch("http://" + address + "/api/routines", {
                    headers: {
                        Authorization: token
                    }
                })
                let resultRoutineJSON = await resultRoutine.json()
                if (resultRoutineJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultRoutineJSON.message
                    })
                } else {
                    setRoutines(resultRoutineJSON.data)
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

    const updateStatus = async (routine) => {
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultRoutine = await fetch("http://" + address + "/api/routines/" + routine.id + "/status", {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                        status: routine.status == 0 ? 1 : 0
                    })
                })
                let resultRoutineJSON = await resultRoutine.json()
                if (resultRoutineJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultRoutineJSON.message
                    })
                } else {
                    loadRoutine()
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
        loadRoutine()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation
                    alignment='center'
                    title={() => { return (<Text category='s1'>Intendant</Text>) }}
                    subtitle={() => { return (<Text appearance='hint' category='s1'>Routine</Text>) }}
                    accessoryLeft={() => <TopNavigationAction icon={BackIcon} onPress={() => navigation.pop()} />}
                />
                <ScrollView
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadRoutine() }} />}
                    style={{ flex: 1, paddingHorizontal: 10, marginBottom: 10 }}>
                    {
                        routines.map(routine => {
                            return (
                                <ListItem
                                    disabled
                                    key={routine.id}
                                    onPress={() => { }}
                                    title={<Text category='h6'> {routine.name} </Text>}
                                    accessoryLeft={(props) => <Icon {...props} name={routine.icon} />}
                                    accessoryRight={(props) => <Button onPress={() => { updateStatus(routine) }} status={routine.status == 0 ? "primary" : "danger"} size='small'>{routine.status == 0 ? "Activer" : "Desactiver"}</Button>}
                                />
                            )
                        })
                    }
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
}