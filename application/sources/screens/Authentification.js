
import React, { useEffect } from 'react'
import { View, SafeAreaView, Image, Linking } from 'react-native'
import { Button, Layout, Text, CheckBox, Input, TopNavigation } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Application from 'expo-application'
import Constants from 'expo-constants'
import { showMessage } from "react-native-flash-message";
import Icon from '../components/Icon'

export default function AuthentificationScreen({ navigation, route }) {

    const [checkbox, setCheckbox] = React.useState('')
    const [login, setLogin] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const setAuthentification = async () => {
        setLoading(true)
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            if (login.length > 0) {
                if (password.length > 0) {
                    try {
                        let result = await fetch(address + "/api/ping")
                        let resultJSON = await result.json()
                        if (resultJSON.message == "pong" && resultJSON.code == "ok") {

                            let resultAuthentification = await fetch(address + "/api/authentification", {
                                method: 'POST',
                                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    login: login,
                                    password: password
                                })
                            })
                            let resultAuthentificationJSON = await resultAuthentification.json()
                            if (resultAuthentificationJSON.error) {
                                showMessage({
                                    type: "danger",
                                    message: 'Error: Invalid authentication'
                                })
                                setPassword('')
                            } else {
                                await AsyncStorage.setItem('pegasus-token', resultAuthentificationJSON.token)
                                await AsyncStorage.setItem('pegasus-profile', "" + resultAuthentificationJSON.profile)
                                if (checkbox) {
                                    await AsyncStorage.setItem('pegasus-auto', 'auto')
                                }
                                let client = await AsyncStorage.getItem('pegasus-client')
                                let resultClient = await fetch(address + "/api/client", {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        imei: Application.androidId ? Application.androidId : Constants.installationId,
                                        name: client,
                                        token: resultAuthentificationJSON.token
                                    }),
                                    headers: {
                                        'Authorization': resultAuthentificationJSON.token,
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    }
                                })
                                let resultClientJSON = await resultClient.json()
                                if (resultClientJSON.error) {
                                    showMessage({
                                        type: "danger",
                                        message: 'Error: ' + resultClientJSON.message
                                    })
                                    setPassword('')
                                } else {
                                    navigation.push('Home')
                                }
                            }
                        } else {
                            showMessage({
                                type: "danger",
                                message: 'Error: ' + resultJSON.message
                            })
                            setPassword('')
                        }
                    } catch (error) {
                        showMessage({
                            type: "danger",
                            message: 'Error: Unable to find the Intendant server'
                        })
                        setPassword('')
                    }
                } else {
                    showMessage({
                        type: "danger",
                        message: 'Error: Password field is empty'
                    })
                    setPassword('')
                }
            } else {
                showMessage({
                    type: "danger",
                    message: 'Error: Login field is empty'
                })
                setPassword('')
            }
        } else {
            showMessage({
                type: "danger",
                message: 'Error: Unable to find the Intendant server'
            })
            setPassword('')
        }
        setLoading(false)
    }

    useEffect(() => {
        navigation.addListener('beforeRemove', event => event.preventDefault())
    }, [])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation alignment='center' title={() => { return (<Text category='s1'>Intendant</Text>) }} subtitle={() => { return (<Text appearance='hint' category='s1'>Authentification</Text>) }} />
                <View style={{ flex: 1, justifyContent: 'center', padding: 15 }}>
                    <View style={{ alignItems: 'center', marginBottom: 30 }}>
                        <Image source={require('../../assets/ic_launcher_foreground.png')} resizeMode='contain' style={{ height: 125 }} />
                        <Text status={"basic"} category='h2' style={{ textAlign: 'center' }}   >
                            Intendant
                        </Text>
                        <Text appearance='hint' category='s1' style={{ textAlign: 'center' }} >
                            Log in to your account to access your space.
                        </Text>
                    </View>
                    <View>
                        <Input
                            status={'basic'}
                            label={() => { return (<Text appearance='hint' category='s2' style={{ marginBottom: 4 }} >{'Login'}</Text>) }}
                            size='large'
                            placeholder='John'
                            value={login}
                            onChangeText={nextValue => { setLogin(nextValue) }}
                        />
                        <Input
                            style={{ marginTop: 5 }}
                            secureTextEntry={true}
                            label={() => { return (<Text appearance='hint' category='s2' style={{ marginBottom: 4 }} >{'Password'}</Text>) }}
                            size='large'
                            placeholder='*******'
                            value={password}
                            onChangeText={nextValue => { setPassword(nextValue) }}
                        />
                        <CheckBox
                            style={{ marginTop: 10 }}
                            checked={checkbox}
                            onChange={nextChecked => setCheckbox(nextChecked)}>
                            Logging automatically 
                        </CheckBox>
                        <Button onPress={() => { setAuthentification() }} status='success' disabled={password.length == 0 || login.length == 0 || loading} style={{ marginTop: 20 }} >
                            <Text category='s1' appearance={password.length == 0 || login.length == 0 || loading ? 'hint' : 'default'} >{'Connexion'}</Text>
                        </Button>
                    </View>
                </View>
                <View style={{ padding: 15, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Button size='small' onPress={() => { navigation.navigate('Configuration', { already: true }) }} status='basic' appearance='outline' accessoryLeft={(props) => (
                        <Icon {...props} name='settings-outline' />
                    )}>
                    </Button>
                </View>
            </Layout>
        </SafeAreaView>
    );
}
