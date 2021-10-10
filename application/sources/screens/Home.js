
import React, { useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'
import Icon from '../components/Icon'
import { Button, Layout, Text, Modal, TopNavigationAction, TopNavigation, Spinner, Card, Select, IndexPath, SelectItem } from '@ui-kitten/components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ScreenOrientation from 'expo-screen-orientation'

import ComponentWidget from '../components/Widget'
import ComponentProcess from '../components/Process'
import ComponentSmartobject from '../components/Smartobject'

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
const EditIcon = (props) => (
    <Icon {...props} name='options-2-outline' />
)

const WidgetIcon = (props) => (
    <Icon {...props} name='copy-outline' />
)

const ProcessIcon = (props) => (
    <Icon {...props} name='grid-outline' />
)


export default function Widget({ navigation, route }) {

    const [rows, setRows] = React.useState(0)
    const [sources, setSources] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [edit, setEdit] = React.useState(false)
    const [mode, setMode] = React.useState("view")
    const [type, setType] = React.useState(false)
    const [sourceIndex, setSourceIndex] = React.useState(new IndexPath(0))
    const [actionSourceIndex, setActionSourceIndex] = React.useState(new IndexPath(0))
    const [preview, setPreview] = React.useState({
        widgets: [],
        process: [],
        smartobjects: []
    })

    const loadSource = async (type) => {
        setLoading(true)
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultSources = await fetch(address + "/api/" + type, {
                    headers: {
                        Authorization: token
                    }
                })
                let resultSourcesJSON = await resultSources.json()
                if (resultSources.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultSourcesJSON.message
                    })
                } else {
                    if(resultSourcesJSON.data.length == 0) {
                        showMessage({
                            type: "warning",
                            message: "Warning: " + type + " sources is empty"
                        })
                        setEdit(false)
                    } else {
                        setSources(resultSourcesJSON.data)
                    }
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

    const initialisation = async () => {
        if(await ScreenOrientation.getOrientationAsync() == 1) {
            setRows(2)
        } else {
            setRows(4)
        }
        let result = await AsyncStorage.getItem('source-preview')
        if (result) {
            setPreview(JSON.parse(result))
        }
    }

    const openModal = async (type) => {
        setType(type)
        setEdit(true)
        setSourceIndex(new IndexPath(0))
        setActionSourceIndex(new IndexPath(0))
        await loadSource(type)
    }

    const insertSource = async () => {
        let currentPreview = preview
        let el = {id: sources[sourceIndex.row].id  ,type:type}
        if(type == 'smartobjects') {
            el["action"] =  sources[sourceIndex.row].actions[actionSourceIndex.row].id
        }
        currentPreview[type].push(el)
        setPreview(currentPreview)
        
        await AsyncStorage.setItem('source-preview',JSON.stringify(currentPreview))
        setEdit(false)
    }

    const deleteSource = async (type,pIndex) => {
        let currentPreview = preview
        currentPreview[type] = currentPreview[type].filter((el,index) => {
            return pIndex != index
        })
        setPreview({
            widgets: [],
            process: [],
            smartobjects: []
        })
        await AsyncStorage.setItem('source-preview',JSON.stringify(currentPreview))
        setPreview(currentPreview)
    }

    useEffect(() => {
        ScreenOrientation.addOrientationChangeListener((info) => {
            if(info.orientationInfo.orientation == 1) {
                setRows(2)
            } else {
                setRows(4)
            }
        })

        initialisation()
    }, [])

    let actions = []

    if(type == "smartobjects") {
        if(sources[sourceIndex.row]) {
            actions = sources[sourceIndex.row].actions
        }
    } 

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout level='1' style={{ flex: 1, minHeight: 128, paddingTop: 20 }}>
                <TopNavigation alignment='center' title={() => { return (<Text category='s1'>Intendant</Text>) }} subtitle={() => { return (<Text appearance='hint' category='s1'>{"Home" + (mode == 'edit' ? " (edit mode)" : "")}</Text>) }} accessoryLeft={() => <TopNavigationAction style={{ marginLeft: 15 }} icon={GridIcon} onPress={() => { navigation.push("Espace") }} />} accessoryRight={() => <TopNavigationAction style={{ marginRight: 15 }} icon={LayoutIcon} onPress={() => navigation.push('Routine')} />} />
                <View style={{ flex: 1, marginHorizontal: 15, flexDirection: 'row' }} >
                    {
                        preview.widgets.slice(0,rows).map((widget,index) => {
                            return (
                                <ComponentWidget key={index} id={widget.id} rows={rows} size={preview.widgets.length} onDelete={() => { deleteSource("widgets",index)}} />
                            )
                        })
                    }
                    {
                        preview.widgets.length < rows && mode == 'edit'?
                            <Card onPress={() => { openModal("widgets") }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon style={{ height: 35, width: 35 }} fill='rgb(143, 155, 179)' name={"plus-outline"} />
                            </Card> : null
                    }
                </View>
                <View style={{ flex: 1, marginHorizontal: 15, flexDirection: 'row' }} >
                    {
                        preview.process.slice(0,rows).map((process,index) => {
                            return (
                                <ComponentProcess key={index} id={process.id} rows={rows} size={preview.process.length} onDelete={() => { deleteSource("process",index)}} />
                            )
                        })
                    }
                    {
                        preview.process.length < rows && mode == 'edit'?
                            <Card onPress={() => { openModal("process") }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon style={{ height: 35, width: 35 }} fill='rgb(143, 155, 179)' name={"plus-outline"} />
                            </Card> : null
                    }
                </View>
                <View style={{ flex: 1, marginHorizontal: 15, flexDirection: 'row' }} >
                    {
                        preview.smartobjects.slice(0,rows).map((smartobject,index) => {
                            return (
                                <ComponentSmartobject key={index}  rows={rows} id={smartobject.id} action={smartobject.action}  size={preview.smartobjects.length} onDelete={() => { deleteSource("smartobjects",index)}} />
                            )
                        })
                    }
                    {
                        preview.smartobjects.length < 4  && mode == 'edit' ?
                            <Card onPress={() => { openModal("smartobjects") }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon style={{ height: 35, width: 35 }} fill='rgb(143, 155, 179)' name={"plus-outline"} />
                            </Card> : null
                    }
                </View>
                <View style={{ padding: 15, justifyContent: 'space-between', flexDirection: 'row' }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Button size='small' style={{marginRight: 5}} onPress={async () => {
                            navigation.push('Smartobject')
                        }} status='basic' appearance='outline' accessoryLeft={SmartphoneIcon}>
                        </Button>
                        <Button size='small'  onPress={async () => {
                            navigation.push('Widget')
                        }} status='basic' appearance='outline' accessoryLeft={WidgetIcon}>
                        </Button>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button size='small' style={{marginRight: 5}} onPress={ () => {
                            setMode(mode == 'view' ? "edit" : "view")
                        }} status='basic' appearance='outline' accessoryLeft={EditIcon}>
                        </Button>
                        <Button size='small' onPress={async () => {
                            AsyncStorage.removeItem('pegasus-auto')
                            AsyncStorage.removeItem('pegasus-token')
                            navigation.push('Authentification')
                        }} status='basic' appearance='outline' accessoryLeft={LogIcon}>
                        </Button>
                    </View>
                </View>
            </Layout>
            <Modal
                visible={edit}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onBackdropPress={() => setEdit(false)}>
                <Card disabled={true}>

                    {
                        loading ?
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                                <Spinner />
                                <Text category='p1' appearance='hint'>{"Loading " + type}</Text>
                            </View>
                            :
                            <>
                            
                                <Text category='p1' appearance='hint'>{"Select " + type}</Text>
                                <Select
                                    style={{ width: 300, marginTop: 5 }}
                                    selectedIndex={sourceIndex}
                                    placeholder='source'
                                    value={sources[sourceIndex.row] ? <Text>{sources[sourceIndex.row].reference}</Text> : <Text>{"Loading " + type}</Text>}
                                    onSelect={index => { setSourceIndex(index) }}>
                                    {
                                        sources.map((source, index) => {
                                            return (
                                                <SelectItem
                                                    key={index}
                                                    title={source.reference}
                                                    accessoryLeft={type == 'smartobjects' ? SmartphoneIcon : type == 'widgets' ? WidgetIcon : ProcessIcon}
                                                />
                                            )
                                        })
                                    }
                                </Select>
                                {
                                    type == "smartobjects"  ?
                                    <Select
                                    style={{ width: 300, marginTop: 10 }}
                                    selectedIndex={actionSourceIndex}
                                    placeholder='source'
                                    value={actions[actionSourceIndex.row] ? <Text>{actions[actionSourceIndex.row].name}</Text> : <Text>{""}</Text>}
                                    onSelect={index => { setActionSourceIndex(index) }}>
                                    {
                                        actions.map((action, index) => {
                                            return (
                                                <SelectItem
                                                    key={index}
                                                    title={action.name}
                                                />
                                            )
                                        })
                                    }
                                </Select> : null
                                }
                                    <Button style={{marginTop: 15}} disabled={ sources[sourceIndex.row] == undefined  }   appearance='filled' onPress={() => { insertSource() }} status={"primary"} >
                                        Submit
                                    </Button>
                            </>
                    }
                </Card>
            </Modal>
        </SafeAreaView>
    );
}
