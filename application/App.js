import 'react-native-gesture-handler'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native';
import React, { useEffect } from 'react'

import Authentification from './sources/screens/Authentification'
import SmartobjectDetail from './sources/screens/SmartobjectDetail'
import Espace from './sources/screens/Espace'
import Smartobject from './sources/screens/Smartobject'
import Configuration from './sources/screens/Configuration'
import Process from './sources/screens/Process'
import Widget from './sources/screens/Widget'
import Routine from './sources/screens/Routine'
import Loading from './sources/screens/Loading'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import Theme from './sources/Theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EvaIconsPack } from '@ui-kitten/eva-icons'

import FlashMessage from "react-native-flash-message"

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  const [theme, setTheme] = React.useState("dark");
  const toggleTheme = async () => {
    const nextTheme = theme === "light" ? "dark" : "light"
    setTheme(nextTheme);
    await AsyncStorage.setItem('pegasus-mode', nextTheme)
  }

  return (
    <Theme.Provider value={{ theme, toggleTheme }}>
      <StatusBar style={"light"} />
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <IconRegistry icons={EvaIconsPack} />
        <NavigationContainer theme={DarkTheme}  >
          <Navigator initialRouteName='Loading' headerMode='none' mode="modal" screenOptions={{ cardOverlay: () => (<View style={{ flex: 1, backgroundColor: theme === "light" ? '#FFFFFF' : '#222B45' }} />) }}   >
            <Screen name="Loading" component={Loading} />
            <Screen name="Configuration" component={Configuration} />
            <Screen name="Authentification" component={Authentification} />
            <Screen name="SmartobjectDetail" component={SmartobjectDetail} />
            <Screen name="Smartobject" component={Smartobject} />
            <Screen name="Widget" component={Widget} />
            <Screen name="Espace" component={Espace} />
            <Screen name="Routine" component={Routine} />
            <Screen name="Process" component={Process} />
          </Navigator>
        </NavigationContainer>
      </ApplicationProvider>
      <FlashMessage duration={3000} titleStyle={{fontSize: 15, lineHeight: 15, marginTop: 15}} position="top" />
    </Theme.Provider>
  )
}
