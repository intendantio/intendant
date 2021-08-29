
import React, { useEffect } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Card, Input } from '@ui-kitten/components'

const screen = Dimensions.get("screen");

export default ColorPicker = (props) => {

    const [color, setColor] = React.useState("#ffffff")

    return (
        <View style={{  padding: 10, borderWidth: 1, borderRadius: 5, borderColor: color }} >
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setColor("#ff6900"); props.onChange && props.onChange("#ff6900") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(255, 105, 0)' }}/>
                <TouchableOpacity onPress={() => { setColor("#fcb900"); props.onChange && props.onChange("#fcb900") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(252, 185, 0)' }}/>
                <TouchableOpacity onPress={() => { setColor("#7bd2b5"); props.onChange && props.onChange("#7bd2b5") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(123, 210, 181)' }}/>
                <TouchableOpacity onPress={() => { setColor("#00d084"); props.onChange && props.onChange("#00d084") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(0, 208, 132)' }}/>
                <TouchableOpacity onPress={() => { setColor("#8ed1fc"); props.onChange && props.onChange("#8ed1fc") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(142, 209, 252)' }}/>

            </View>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setColor("#eb144c"); props.onChange && props.onChange("#eb144c") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(235, 20, 76) ' }}/>
                <TouchableOpacity onPress={() => { setColor("#f78da7"); props.onChange && props.onChange("#f78da7") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(247, 141, 167)' }}/>
                <TouchableOpacity onPress={() => { setColor("#9900ef"); props.onChange && props.onChange("#9900ef") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(153, 0, 239)' }}/>
                <TouchableOpacity onPress={() => { setColor("#0693e3"); props.onChange && props.onChange("#0693e3") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(6, 147, 227)' }}/>
                <TouchableOpacity onPress={() => { setColor("#abb8c3"); props.onChange && props.onChange("#abb8c3") }} style={{ borderRadius: 5, margin: 3, width: screen.width * 0.09, height: screen.width * 0.09, backgroundColor: 'rgb(171, 184, 195)' }}/>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Input size='small' onChangeText={(text) => {setColor(text)}} value={color} style={{ margin: 3, width: screen.width * 0.3 }} placeholder='#000000' />
            </View>
        </View>
    )
}
