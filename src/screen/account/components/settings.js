import { Text, StyleSheet, View, Dimensions, NativeModules, TouchableOpacity, Platform, Image } from 'react-native'
import React, { Component, PureComponent, memo } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const width = Dimensions.get("screen").width
const Settings = ({ navProps }) => {
    return (
        <>

            <Text style={styles.heading}>Settings</Text>

            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.mainContainer, { marginTop: 20 }]}>
                <Ionicons name="map-outline" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Store locator</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainContainer}>
                <MaterialCommunityIcons name="home-city" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Country</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainContainer}>
                <Ionicons name="globe-outline" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Language</Text>
                {/* <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} /> */}
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainContainer}>
                <Ionicons name="headset-outline" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Help center</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainContainer}>
                <Ionicons name="star-outline" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Rate our app</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <View style={{ width: width, height: 1, backgroundColor: "#020621", marginTop: 15 }} />
        </>
    )
}

export default Settings

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
    },
    heading: {
        fontSize: 18,
        color: '#3F51B5',
        fontWeight: "600",
        alignSelf: "flex-start",
        marginTop: 20,
        marginLeft: 15
    },
})