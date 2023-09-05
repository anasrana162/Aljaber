import { Text, StyleSheet, View, Dimensions, NativeModules, TouchableOpacity, Platform, Image } from 'react-native'
import React, { Component, PureComponent, memo } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const width = Dimensions.get("screen").width

const OrderList = () => {
    return (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.mainContainer, { marginTop: 20 }]}>
                <Ionicons name="cube-outline" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Orders</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainContainer}>
                <Ionicons name="eye" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Book an appointment</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <View style={{ width: width, height: 1, backgroundColor: "#020621", marginTop: 15 }} />
        </>
    )
}

export default OrderList

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        alignSelf: "flex-start",
        width: width - 20,
        marginLeft: 15
    },
    text_list: {
        fontWeight: "500",
        color: "#020621",
        fontSize: 16,
        marginLeft: 15
    }
})