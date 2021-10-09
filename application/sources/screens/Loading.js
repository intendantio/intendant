
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native';
import { Layout, TopNavigation, Text } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})

export default function DetailsScreen({ navigation }) {
    const initialisation = async () => {
        let token = await getPushToken()
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            let auto = await AsyncStorage.getItem('pegasus-auto')
            if (auto) {
                navigation.navigate('Home')
            } else {
                navigation.navigate('Authentification')
            }
        } else {
            navigation.navigate('Configuration')
        }
    }

    const getPushToken = async () => {
        return ""
        try {
            if (Constants.isDevice) {
                let permissionsNotification = await Notifications.getPermissionsAsync()
                if (permissionsNotification.status !== 'granted') {
                    permissionsNotification = await Notifications.getPermissionsAsync()
                }
                if (permissionsNotification.status !== 'granted') {
                    return ""
                } else {
                    let token = await Notifications.getExpoPushTokenAsync();
                    return token.data
                }
            }
            if (Constants.platform.android) {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                })
            }
            return ""
        } catch (error) {
            console.error(error)
            return ""
        }
    }

    useEffect(() => {
        initialisation()
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation alignment='center' title={() => { return (<Text category='s1'>Intendant</Text>) }} subtitle={() => { return (<Text appearance='hint' category='s1'>Chargement</Text>) }} />
            </Layout>
        </SafeAreaView>
    )
}
