
import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, View, RefreshControl } from 'react-native'
import Icon from '../components/Icon'
import { Button, Layout, Text, TopNavigationAction, TopNavigation, ListItem } from '@ui-kitten/components'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { showMessage } from "react-native-flash-message";

const LogIcon = (props) => (
    <Icon {...props} name='log-in-outline' />
)

const SmartphoneIcon = (props) => (
    <Icon {...props} name='smartphone-outline' />
)

const LayoutIcon = (props) => (
    <Icon {...props} name='layout' />
)

const GridIcon = (props) => (
    <Icon {...props} name='grid' />
)


export default function Widget({ navigation, route }) {
    const [widgets, setWidgets] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    const loadWidget = async () => {
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultEspace = await fetch("http://" + address + "/api/widgets", {
                    headers: {
                        Authorization: token
                    }
                })
                let resultEspaceJSON = await resultEspace.json()
                if (resultEspaceJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultEspaceJSON.message
                    })
                } else {
                    setWidgets(resultEspaceJSON.data)
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
        loadWidget()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation alignment='center' title={() => { return (<Text category='s1'>Intendant</Text>) }} subtitle={() => { return (<Text appearance='hint' category='s1'> Widget </Text>) }} accessoryLeft={() => <TopNavigationAction style={{ marginLeft: 15 }} icon={GridIcon} onPress={() => { navigation.push("Espace") }} />} accessoryRight={() => <TopNavigationAction style={{ marginRight: 15 }} icon={LayoutIcon} onPress={() => navigation.push('Routine')} />} />

                <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadWidget() }} />} style={{ flex: 1, paddingHorizontal: 10, marginBottom: 10 }}>
                    {
                        widgets.map((widget, index) => {
                            let titles = []
                            let descriptions = []
                            widget.contents.forEach(content => {
                                if (content.type.reference == "title") {
                                    titles.push(content)
                                } else {
                                    descriptions.push(content)
                                }
                            })
                            return (
                                <ListItem
                                    disabled
                                    key={index}
                                    title={
                                        <Text category='h6'>
                                            {
                                                titles.map((title, index) => {
                                                    if (titles.length - 1 != index) {
                                                        return (
                                                            title.content + "\n"
                                                        )
                                                    }
                                                    return (
                                                        title.content
                                                    )
                                                })
                                            }
                                        </Text>
                                    }
                                    description={
                                        <Text appearance='hint' category='s1'>
                                            {
                                                descriptions.map((description, index) => {
                                                    if (descriptions.length - 1 != index) {
                                                        return (
                                                            description.content + "\n"
                                                        )
                                                    }
                                                    return (
                                                        description.content
                                                    )
                                                })
                                            }
                                        </Text>
                                    }
                                    accessoryLeft={(props) => (
                                        <Icon {...props} name={widget.icon} />
                                    )}
                                />
                            )
                        })
                    }
                </ScrollView>
                <View style={{ padding: 15, justifyContent: 'space-between', flexDirection: 'row' }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Button size='small' onPress={async () => {
                            navigation.push('Smartobject')
                        }} status='basic' appearance='outline' accessoryLeft={SmartphoneIcon}>
                        </Button>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button size='small' onPress={async () => {
                            AsyncStorage.removeItem('pegasus-auto')
                            AsyncStorage.removeItem('pegasus-token')
                            navigation.push('Authentification')
                        }} status='basic' appearance='outline' accessoryLeft={LogIcon}>
                        </Button>
                    </View>
                </View>
            </Layout>
        </SafeAreaView>
    );
}