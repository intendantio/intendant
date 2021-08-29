
import React, { useEffect } from 'react'
import { View, SafeAreaView, Linking, Image } from 'react-native'
import { Button, Layout, Text, Input, TopNavigation } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../components/Icon'

const ErrorIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

const CheckIcon = (props) => (
    <Icon {...props} name='checkmark-circle-2-outline' />
);

const InformationIcon = (props) => (
    <Icon {...props} name='info-outline' />
);

const LoadingIcon = (props) => (
    <Icon {...props} name='sync-outline' />
);

export default function ConfigurationScreen({ navigation, route }) {

    const [client, setClient] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [fieldStatus, setFieldStatus] = React.useState({ status: 'basic', accessory: InformationIcon, information: '' });

    const updateAddress = async (pAddress) => {
        setAddress(pAddress)
        if (pAddress == "") {
            setFieldStatus({ status: 'basic', accessory: InformationIcon, information: '' })
        } else {
            setFieldStatus({ status: 'warning', accessory: LoadingIcon })
            let pError = false
            let pWarning = false
            try {
                let result = await fetch("http://" + pAddress + "/api/ping", {}, 2000)
                let resultJSON = await result.json()
                if (resultJSON.message != "pong" || resultJSON.code != "ok") {
                    pError = true
                } else {
                    if (resultJSON.getStarted) {
                        pWarning = true
                    }
                }
            } catch (error) {
                pError = true
            }
            if (pWarning) {
                setFieldStatus({ status: 'warning', accessory: ErrorIcon, information: 'Before starting, you must access the administrator interface to set an administrator password' })
            } else if (pError) {
                setFieldStatus({ status: 'danger', accessory: ErrorIcon, information: 'Connection to server failed' })
            } else {
                setFieldStatus({ status: 'success', accessory: CheckIcon })
            }
        }
    }

    initialisation = async () => {
        let pAddress = await AsyncStorage.getItem('pegasus-address', address)
        if (pAddress) {
            updateAddress(pAddress)
        }
        let pClient = await AsyncStorage.getItem('pegasus-client', client)
        if (pClient) {
            setClient(pClient)
        }
    }

    useEffect(() => {
        if (route.params && route.params.already == undefined) {
            navigation.addListener('beforeRemove', event => event.preventDefault())
        }
        initialisation()
    }, [])

    const next = async () => {
        await AsyncStorage.setItem('pegasus-address', address)
        await AsyncStorage.setItem('pegasus-client', client)
        navigation.navigate('Authentification')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation alignment='center' title={() => { return (<Text category='s1'>Intendant</Text>) }} subtitle={() => { return (<Text appearance='hint' category='s1'>Configuration</Text>) }} />
                <View style={{ flex: 1, justifyContent: 'center', padding: 15 }}>
                    <View style={{ alignItems: 'center', marginBottom: 30 }}>
                        <Image source={require('../../assets/ic_launcher_foreground.png')} resizeMode='contain' style={{ height: 125 }} />
                        <Text status={"basic"} category='h3' style={{ textAlign: 'center' }}   >
                            Welcome to Intendant
                        </Text>
                        <Text appearance='hint' category='s1' style={{ textAlign: 'center' }} >
                            Before beginning, some configurations are necessary
                        </Text>
                    </View>
                    <View>
                        <Input
                            status={client.length > 0 ? 'success' : 'basic'}
                            label={() => { return (<Text appearance='hint' category='s2' style={{ marginBottom: 4 }} >{'Name'}</Text>) }}
                            size='large'
                            placeholder='John Doe'
                            value={client}
                            onChangeText={nextValue => { setClient(nextValue) }}
                        />
                        <Input
                            style={{ marginTop: 5 }}
                            status={fieldStatus.status}
                            label={() => { return (<Text appearance='hint' category='s2' style={{ marginBottom: 4 }} >{'Address of the server Intendant'}</Text>) }}
                            size='large'
                            placeholder='https://intendant.io'
                            value={address}
                            onChangeText={nextValue => updateAddress(nextValue)}
                            accessoryRight={fieldStatus.accessory}
                        />
                        <Text status={fieldStatus.status} category='label' appearance='hint'>
                            {fieldStatus.information}
                        </Text>
                        <Button onPress={() => { next() }} status='success' disabled={client.length == 0 || fieldStatus.status != 'success'} >
                            <Text category='s1' appearance={client.length == 0 || fieldStatus.status != 'success' ? 'hint' : 'default'} >{'Confirmation'}</Text>
                        </Button>
                    </View>
                </View>
                <View style={{ padding: 15, justifyContent: 'space-between', flexDirection: 'row' }}>
                    
                    <View style={{ flexDirection: 'row' }}>
                        <Button size='small' style={{ marginRight: 5 }} onPress={() => { Linking.openURL("https://intendant.io") }} status='basic' accessoryLeft={(props) => (
                            <Icon {...props} name='globe-3' />
                        )}>
                        </Button>
                        <Button size='small' onPress={() => { Linking.openURL("https://github.com/intendantio/intendant") }} status='basic' accessoryLeft={(props) => (
                            <Icon {...props} name='github' />
                        )}>
                        </Button>
                    </View>
                </View>
            </Layout>
        </SafeAreaView>

    );
}
