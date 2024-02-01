import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/home/homeScreen';
import GetStarted from '../screen/getstarted/getStarted';
import Account from '../screen/account/account';
import Categories from '../screen/categories/categories';
import Products from '../screen/products/products';
import ProductDetails from '../screen/products/productDetails';
import About_us from '../screen/account/about_us';
import Contact_us from '../screen/account/contact_us';
import Cart from '../screen/cart/cart';
import Search from '../screen/search/search';
import Billing_Shipping from '../screen/checkout/billing_Shipping';
import Review_Payment from '../screen/checkout/review_Payment';
import Order_Details from '../screen/account/orders_details';
import ChangeUserData from '../screen/account/changeUserData';
import MyOrders from '../screen/account/myOrders';

const Stack = createNativeStackNavigator();
export default class Navigation extends Component {
    render() {
        const language = 'EN'
        return (
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: 'fade'
                        // language == 'AR' ? 'slide_from_left' : 'slide_from_right',
                    }}>
                    <Stack.Screen name="GetStarted" component={GetStarted} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="Cart" component={Cart} />
                    <Stack.Screen name="Billing_Shipping" component={Billing_Shipping} />
                    <Stack.Screen name="Review_Payment" component={Review_Payment} />
                    <Stack.Screen name="Search" component={Search} />
                    <Stack.Screen name="Account" component={Account} />
                    <Stack.Screen name="MyOrders" component={MyOrders} />
                    <Stack.Screen name="ChangeUserData" component={ChangeUserData} />
                    <Stack.Screen name="About_us" component={About_us} />
                    <Stack.Screen name="Contact_us" component={Contact_us} />
                    <Stack.Screen name="Order_Details" component={Order_Details} />
                    <Stack.Screen name="Categories" component={Categories} />
                    <Stack.Screen name="Products" component={Products} options={{ gestureEnabled: false }} />
                    <Stack.Screen name="ProductDetails" component={ProductDetails} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const styles = StyleSheet.create({})