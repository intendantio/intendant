
import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { Layout, Text, TopNavigationAction, TopNavigation, ListItem } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../components/Icon'
import { showMessage } from "react-native-flash-message";

const BackIcon = (props) => (
    <Icon {...props} name='arrow-ios-back-outline' />
)

export default function Application({ navigation, route }) {

    const [espaces, setEspaces] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    const loadEspace = async () => {
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultEspace = await fetch(address + "/api/espaces", {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                let resultEspaceJSON = await resultEspace.json()
                if (resultEspaceJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultEspaceJSON.message
                    })
                } else {
                    setEspaces(resultEspaceJSON.data)
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
        loadEspace()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation
                    alignment='center'
                    title={() => { return (<Text category='s1'>Intendant</Text>) }}
                    subtitle={() => { return (<Text appearance='hint' category='s1'>Espace</Text>) }}
                    accessoryLeft={() => <TopNavigationAction icon={BackIcon} onPress={() => navigation.pop()} />}
                />
                <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); loadEspace() }} />} style={{ flex: 1, paddingHorizontal: 10, marginBottom: 10 }}>
                    {
                        espaces.map((espace, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    onPress={() => { navigation.push('Process', { espace: espace.id }) }}
                                    title={<Text category='h6'>{espace.name}</Text>}
                                    description={<Text appearance='hint' category='s1'>{espace.description}</Text>}
                                    accessoryLeft={(props) => <Icon {...props} name={espace.icon} />}
                                />
                            )
                        })
                    }
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
}