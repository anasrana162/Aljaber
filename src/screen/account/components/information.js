import { Text, StyleSheet, View, Dimensions, NativeModules, TouchableOpacity, Platform, Image } from 'react-native'
import React, { Component, PureComponent, memo } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
const width = Dimensions.get("screen").width

const Information = ({ navProps }) => {

    const onPress = (key) => {
        switch (key) {
            case "about_us":
                navProps.navigate("About_us")
                break;
            case "contact_us":
                navProps.navigate("Contact_us")
                break;
        }
    }

    return (
        <>

            <Text style={styles.heading}>Information</Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPress("about_us")}
                style={[styles.mainContainer, { marginTop: 20 }]}>
                <Entypo name="info" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>About us</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPress("contact_us")}
                style={styles.mainContainer}>
                <MaterialIcons name="contact-mail" size={24} color='#3F51B5' />
                <Text style={styles.text_list}>Contact us</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            {/* <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainContainer}>
                <Ionicons name="globe-outline" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Language</Text>
                <Text style={[styles.text_list, { position: "absolute", right: 30 }]}>English</Text>
                
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
            </TouchableOpacity> */}

            <View style={{ width: width, height: 1, backgroundColor: "#020621", marginTop: 15 }} />
        </>
    )
}

export default Information

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