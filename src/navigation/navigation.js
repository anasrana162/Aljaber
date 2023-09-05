import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/home/homeScreen';
import GetStarted from '../screen/getstarted/getStarted';
import Account from '../screen/account/account';
import Categories from '../screen/categories/categories';


const Stack = createNativeStackNavigator();
export default class Navigation extends Component {
    render() {
        const language = 'EN'
        return (
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation:
                            language == 'AR' ? 'slide_from_left' : 'slide_from_right',
                    }}>
                    <Stack.Screen name="GetStarted" component={GetStarted} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="Account" component={Account} />
                    <Stack.Screen name="Categories" component={Categories} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const styles = StyleSheet.create({})