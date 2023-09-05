import { Text, StyleSheet, View, Dimensions, NativeModules, TouchableOpacity, Platform } from 'react-native'
import React, { Component } from 'react'

import Ionicons from "react-native-vector-icons/Ionicons"


const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

const navigateT0 = (key, navProps) => {
    navProps?.navigate(key)
}

const TabNavigator = ({ navProps, screenName }) => {
    return (
        <View style={styles.mainContainer}>

            <TouchableOpacity
                onPress={() => navigateT0("HomeScreen", navProps)}
                disabled={screenName == "home" ? true : false}
                activeOpacity={0.4}
                style={styles.iconContainer} >
                {screenName == "home" && <View style={styles.activeBar} />}
                <Ionicons name="home" size={25} color="white" />
                <Text style={styles.iconText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigateT0("Categories",navProps)}
                activeOpacity={0.4}
                disabled={screenName == "category" ? true : false}
                style={styles.iconContainer} >
                {screenName == "category" && <View style={styles.activeBar} />}
                <Ionicons name="grid-outline" size={25} color="white" />
                <Text style={styles.iconText}>Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
                // onPress={() => navigateT0("homeScreen")}
                activeOpacity={0.4}
                disabled={screenName == "cart" ? true : false}
                style={styles.iconContainer} >
                {screenName == "cart" && <View style={styles.activeBar} />}
                <Ionicons name="cart-outline" size={25} color="white" />
                <Text style={styles.iconText}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigateT0("Account",navProps)}
                activeOpacity={0.4}
                disabled={screenName == "account" ? true : false}
                style={styles.iconContainer} >
                {screenName == "account" && <View style={styles.activeBar} />}
                <Ionicons name="person-sharp" size={25} color="white" />
                <Text style={styles.iconText}>Account</Text>
            </TouchableOpacity>
        </View>
    )
}

export default TabNavigator

const styles = StyleSheet.create({
    mainContainer: {
        width: width - 20,
        borderWidth:1,
        borderColor:"white",
        height: 55,
        backgroundColor: "#020621",
        borderRadius: 15,
        position: "absolute",
        bottom: Platform.OS == "ios" ? 25 : 10,
        zIndex: 150,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    iconText: {
        color: "white",
        fontSize: 11,
        fontWeight: "600"
    },
    activeBar: {
        width: "100%",
        height: 2,
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 3
    }
})