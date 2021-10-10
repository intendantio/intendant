
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, Card, Spinner } from '@ui-kitten/components'
import Icon from './Icon'
import { showMessage } from "react-native-flash-message"

export default Widget = (props) => {

    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState(false)
    const [onRemove, setOnRemove] = React.useState(false)

    const initialisation = async () => {
        setLoading(true)
        let address = await AsyncStorage.getItem('pegasus-address')
        if (address) {
            try {
                let token = await AsyncStorage.getItem('pegasus-token')
                let resultSources = await fetch(address + "/api/widgets/" + props.id , {
                    headers: {
                        Authorization: token
                    }
                })
                let resultSourcesJSON = await resultSources.json()
                if (resultSourcesJSON.error) {
                    showMessage({
                        type: "danger",
                        message: 'Error: ' + resultSourcesJSON.message
                    })
                    props.onDelete()
                    return
                } else {
                    setData(resultSourcesJSON.data)
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
        initialisation()
    }, [])


    if(loading) {
        return (
            <Card onPress={() => { }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
            </Card>
        )
    } else if(onRemove) {
        return (
            <Card  onLongPress={() => { setOnRemove(false) }} onPress={() => { props.onDelete() }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ height: 60, width: 60, alignSelf:'center' }} fill='rgb(143, 155, 179)' name={"close"} />
            </Card>
        )
    } else {
        return (
            <Card onLongPress={() => { setOnRemove(true) }}   onPress={() => { initialisation() }} style={{ flex: 1, margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                {
                    data && data.contents.map((content,index) => {
                        if(content.type.reference == "list") {
                            return content.content.split("\n").map((pcontent,pindex) => {
                                if(pcontent[0] == " ") {
                                    pcontent = pcontent.slice(1,pcontent.length)
                                }
                                return (
                                    <Text key={pindex + "0" + index} category={(props.size > 2 && props.rows == 4 ? "label" : "s2")} appearance={"hint"}>{pcontent}</Text>
                                )
                            })
                        } else {
                            return (
                                <Text key={index} category={content.type.reference == "title" ? (props.size > 2 && props.rows == 4 ? "h6" : "h5") : (props.size > 2 && props.rows == 4 ? "label" : "s1")} appearance={content.type.reference == "title" ? "default" : "hint"}>{content.content}</Text>
                            )
                        }
                    })
                }
            </Card>
        )
    }
    
}