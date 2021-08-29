
import React, {useEffect} from 'react'
import { Text, Toggle } from '@ui-kitten/components'
import Theme from '../Theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as eva from '@eva-design/eva'

export default DarkSwitch = () => {
    const themeContext = React.useContext(Theme)
    const [checked, setChecked] = React.useState(false)
    const onCheckedChange = (isChecked) => { setChecked(isChecked); themeContext.toggleTheme() }


    const initialisation = async () => {
        let mode = await AsyncStorage.getItem('pegasus-mode')
        if(mode == JSON.stringify(eva.dark) ) {
            setChecked(true)
        }
    };

    useEffect(() => {
        initialisation()
    },[])

    return (
        <Toggle checked={checked} onChange={onCheckedChange}>
            <Text appearance='hint'>
                {checked ? 'Dark Theme' : 'Light Theme'}
            </Text>
        </Toggle>
    );
}
