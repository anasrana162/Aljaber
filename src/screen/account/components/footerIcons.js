import { Text, StyleSheet, View, Dimensions, ScrollView, TextInput, TouchableOpacity, Platform, Image, LogBox } from 'react-native'
import React, { Component } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import AuthTxtInp from '../../../components_reusable/authTxtInp'

const width = Dimensions.get("screen").width

const FooterIcons = () => {
    return (
        <>
            {/** Text Benefits */}
            <Text style={styles?.benefits_text}>Benefits of having an account</Text>

            {/** View of three icons */}
            < View style={styles.icons_view} >

                {/** location icon */}
                < View style={styles.main_icon_cont} >
                    <View style={styles.icon_cont}>
                        <Entypo name="location" size={24} color="#3F51B5" />
                    </View>
                    <Text style={styles.main_icon_text}>Manage Addresses</Text>
                </View >

                {/** Timer Icon */}
                < View style={styles.main_icon_cont} >
                    <View style={styles.icon_cont}>
                        <Ionicons name="timer-sharp" size={24} color="#3F51B5" />
                    </View>
                    <Text style={styles.main_icon_text}>Checkout Faster</Text>
                </View >

                {/** Route Icon */}
                < View style={styles.main_icon_cont} >
                    <View style={styles.icon_cont}>
                        <FontAwesome5 name="route" size={24} color="#3F51B5" />
                    </View>
                    <Text style={styles.main_icon_text}>Track Your Order</Text>
                </View >
            </View >
        </>
    )
}

export default FooterIcons

const styles = StyleSheet.create({
    main_icon_cont: {
        justifyContent: "center",
        alignItems: "center",
    },
    main_icon_text: {
        fontSize: 11,
        color: "#020621",
        marginTop: 10,
        width: 60,
        textAlign: 'center',
        fontWeight:"500"
    },
    icons_view: {
        width: width - 140,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20
    },
    icon_cont: {
        width: 50,
        height: 50,
        backgroundColor: '#f2f4fa',
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    benefits_text: {
        color: "#020621",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 40,
    }
})