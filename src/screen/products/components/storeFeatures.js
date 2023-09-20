import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
const width = Dimensions.get("screen").width
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'


const StoreFeatures = () => {
    return (
        <View style={styles.mainContainer}>

            {/* First Column */}
            <View style={styles.inner_mains}>

                {/* First Row */}
                <View
                    style={styles.item_cont}
                >
                    <MaterialIcons name="local-shipping" size={35} color="#020621" />
                    <View style={{ width: "75%", marginLeft: 10 }} >
                        <Text style={styles.item_title}>Free shipping</Text>
                        <Text style={styles.item_text}>Free shipping on order over $100</Text>
                    </View>
                </View>

                {/* Second Row */}
                <View
                    style={styles.item_cont}
                >
                    <MaterialCommunityIcons name="hours-24" size={35} color="#020621" />
                    <View style={{ width: "75%", marginLeft: 10 }} >
                        <Text style={styles.item_title}>Support 24/7</Text>
                        <Text style={styles.item_text}>Contact us 24 hours a day and 7 days a week</Text>
                    </View>
                </View>
            </View>

            {/* Second Column */}
            <View style={styles.inner_mains}>

                {/* First Row */}
                <View
                    style={styles.item_cont}
                >
                    <Ionicons name="card" size={35} color="#020621" />
                    <View style={{ width: "75%", marginLeft: 10 }} >
                        <Text style={styles.item_title}>Secure Payment</Text>
                        <Text style={styles.item_text}>We ensure secure payment with PEV</Text>
                    </View>
                </View>

                {/* Second Row */}
                <View
                    style={styles.item_cont}
                >
                    <FontAwesome5 name="undo" size={27} color="#020621" />
                    <View style={{ width: "75%", marginLeft: 10 }} >
                        <Text style={styles.item_title}>30 Days Exchange</Text>
                        <Text style={styles.item_text}>Simply return it within 30 days for exchange</Text>
                    </View>
                </View>

            </View>

        </View>
    )
}

export default StoreFeatures

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        // height:200,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 20,
    },
    inner_mains: {
        width: "48%",
        height: "100%",
        alignItems: "center",
        //  backgroundColor: 'red'
    },
    item_cont: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 10,
        overflow:"hidden"
    },

    item_title: {
        fontWeight: "500",
        fontSize: 14,
        color: "#020621"
    },
    item_text: {
        fontWeight: "400",
        fontSize: 11,
        color: "#020621"
    }
})