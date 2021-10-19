
import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { Layout, Text, TopNavigationAction, TopNavigation, ListItem } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../components/Icon'
import { showMessage } from "react-native-flash-message";

const forwardIcon = (props) => (
    <Icon {...props} name='arrow-ios-forward-outline' />
)

const BackIcon = (props) => (
    <Icon {...props} name='arrow-ios-back-outline' />
)

export default function List({ navigation }) {
    const [smartobjects, setSmartobjects] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const loadSmartobject = async () => {
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultSmartobject = await fetch(address + "/api/smartobjects", {
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
                    setSmartobjects(resultSmartobjectJSON.data)
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
        loadSmartobject()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation alignment='center' title={() => { return (<Text category='s1'>Intendant</Text>) }} subtitle={() => { return (<Text appearance='hint' category='s1'>Smartobject list</Text>) }} accessoryLeft={() => <TopNavigationAction style={{ marginLeft: 15 }} icon={BackIcon} onPress={() => { navigation.pop() }} />} />
                <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadSmartobject() }} />} style={{ flex: 1, paddingHorizontal: 10, marginBottom: 10 }}>
                    {
                        smartobjects.map(smartobject => {
                            return (
                                <ListItem
                                    key={smartobject.id}
                                    onPress={() => { navigation.push('SmartobjectDetail', { smartobject: smartobject.id }) }}
                                    title={
                                        <Text category='h6'>
                                            {
                                                smartobject.reference
                                            }
                                        </Text>
                                    }
                                    description={
                                        <Text appearance='hint' category='s1'>
                                            {
                                                smartobject.status.name
                                            }
                                        </Text>
                                    }
                                    accessoryLeft={(props) => <Icon {...props} name={smartobject.icon} />}
                                    accessoryRight={forwardIcon}
                                />
                            )
                        })
                    }
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
}