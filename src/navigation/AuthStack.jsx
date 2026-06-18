import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screen/auth/Splash';
import Login from '../screen/auth/Login';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen name='Splash' component={Splash} options={{headerShown:false}}/>
        <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})