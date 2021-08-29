
import React, { useEffect } from 'react'
import { View,  Dimensions } from 'react-native'
import { Input, Select, SelectItem  } from '@ui-kitten/components'
import Slider from '@react-native-community/slider'
import ColorPicker from '../components/ColorPicker'
import * as eva from '@eva-design/eva'
import Theme from '../Theme'

const screen = Dimensions.get("screen");

export default Action = (props) => {
    const themeContext = React.useContext(Theme)
    const primary = eva[themeContext.theme]["color-primary-600"]
    switch (props.settings.type) {
        case 'text':
            return (
                <View key={props.settings.id} style={{ marginTop: 10 }} >
                    <Input style={{ alignSelf: 'center' }} placeholder={props.settings.id} onChangeText={(text) => { props.onUpdate(props.settings.id,text) }} />
                </View>
            )
        case 'number':
            return (
                <View key={props.settings.id} style={{ marginTop: 10 }} >
                    <Input placeholder={props.settings.id} onChangeText={(text) => { props.onUpdate(props.settings.id,text)  }} />
                </View>
            )
        case 'colorpicker':
            return (
                <View key={props.settings.id} style={{ marginTop: 10 }} >
                    <ColorPicker onChange={(value) => { props.onUpdate(props.settings.id,value)}} />
                </View>
            )
        case 'slider':
            return (
                <View key={props.settings.id} style={{ marginTop: 10 }} >
                    <Slider
                        value={props.settings.default}
                        onValueChange={(value) => { props.onUpdate(props.settings.id,value)}}
                        style={{ width:  (screen.width * 0.09 + 12) * 5 , height: 40 }}
                        minimumValue={props.settings.min}
                        maximumValue={props.settings.max}
                        step={props.settings.step}
                        thumbTintColor={primary}
                        minimumTrackTintColor={primary}
                        maximumTrackTintColor={primary}
                    />
                </View>
            )
            case 'select':
                
                const [select, setSelect] = React.useState(0)
                                
            return (
                <View key={props.settings.id} style={{ marginTop: 10 }} >
                    <Select
                    placeholder={props.settings.id}
                    value={props.settings.values.slice(select-1,select)[0]}
                    selectedIndex={select}
                    onSelect={(index) => {setSelect(index);props.onUpdate(props.settings.id,props.settings.values.slice(index-1,index)[0])}}>
                    {
                        props.settings.values.map((value,index) => {
                            return (
                                <SelectItem key={index} title={value}/>
                            )
                        })
                    }
                </Select>
                </View>
            )
        default:
            return null
    }

}
