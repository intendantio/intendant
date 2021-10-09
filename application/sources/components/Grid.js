
import React, { useEffect } from 'react'
import { View, Dimensions } from 'react-native'
import { Input, Text, Card } from '@ui-kitten/components'
import Icon from './Icon'
import { ScrollView } from 'react-native-gesture-handler';
import Cell from './Cell';
const screen = Dimensions.get("screen");

const minWidth = 130
const minHeight = 160

export default Grid = (props) => {

    const [grids, setGrids] = React.useState([[]])

    const getRows = () => {
        return Math.ceil(screen.height / minHeight)
    }

    const getColumns = () => {
        return Math.ceil(screen.width / minWidth)
    }

    const initialisation = () => {
        let grids = []
        for (let indexRow = 0; indexRow < getRows(); indexRow++) {
            let rows = []
            for (let indexColumn = 0; indexColumn < getColumns(); indexColumn++) {
                rows.push({
                    id: -1
                })
            }
            grids.push(rows)
        }
        setGrids(grids)
    }


    useEffect(() => {
        initialisation()
    }, [])

    return (
        <ScrollView style={{ flex: 1, marginHorizontal: 15 }} >
            {
                grids.map((rows, rIndex) => {
                    return (
                        <View key={rIndex} style={{ flexDirection: 'row', display: 'flex', flex: 1 }}>
                            {
                                rows.map((cell, index) => {
                                    return (
                                        <Cell maxWidth={screen.width / getColumns()} index={index} id={cell.id} />
                                    )
                                })
                            }
                        </View>
                    )
                })
            }
        </ScrollView>
    )
}
/*

  <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent:'center', alignSelf:'center' }}>
                                                <Icon style={{ height: 40, width: 40, marginRight: 16 }} fill='white' name={"dat.icon"} />
                                                <View style={{ marginRight: 20, alignSelf:'center', alignContent:'center', justifyContent:'center' }}>
                                                    <Text category='h6'>{"dat.name"}</Text>
                                                    <Text category='s1' appearance='hint'>{"dat.description"}</Text>
                                                </View>
                                            </View>
                                            */