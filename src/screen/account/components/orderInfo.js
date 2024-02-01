import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView, FlatList } from 'react-native'
import React, { Component, useEffect, useState } from 'react'

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height


import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const OrderInfo = ({ shipping_address, billing_address, shipping_method, payment_method, customer_name, countries }) => {

    // States
    const [openSA, setOpenSA] = useState(false)
    const [openSM, setOpenSM] = useState(false)
    const [openBA, setOpenBA] = useState(false)
    const [openPM, setOpenPM] = useState(false)


    var check_country = countries.filter((data) => data?.country_id == shipping_address?.country_id)[0]
    var country = check_country == undefined ? "" : check_country?.country
    // console.log("check_country",check_country);
    return (
        <View style={styles.mainCont}>

            {/* Shipping Address */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenSA(!openSA)}
                style={styles.touchableCont}>
                <Text style={styles.text_list}>Shipping Address</Text>
                <MaterialCommunityIcons name={openSA ? "chevron-down" : "chevron-right"} color='black' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <View style={styles.line}></View>
            {openSA &&
                <>
                    <Text style={styles.text}>{customer_name}</Text>
                    <Text style={styles.text}>{shipping_address?.street}</Text>
                    <Text style={styles.text}>{shipping_address?.city}, {shipping_address?.region}</Text>
                    <Text style={styles.text}>{country}</Text>
                    <Text style={styles.text}>{shipping_address?.telephone}</Text>
                    <View style={[styles.line, { marginTop: 10 }]}></View>
                </>
            }


            {/* Shipping Method */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenSM(!openSM)}
                style={styles.touchableCont}>
                <Text style={styles.text_list}>Shipping Method</Text>
                <MaterialCommunityIcons name={openSM ? "chevron-down" : "chevron-right"} color='black' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <View style={styles.line}></View>
            {openSM &&
                <>

                    <Text style={styles.text}>{shipping_method}</Text>

                    <View style={[styles.line, { marginTop: 10 }]}></View>
                </>
            }
            {/* Billing Address */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenBA(!openBA)}
                style={styles.touchableCont}>
                <Text style={styles.text_list}>Billing Address</Text>
                <MaterialCommunityIcons name={openBA ? "chevron-down" : "chevron-right"} color='black' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <View style={styles.line}></View>
            {openBA &&
                <>
                    <Text style={styles.text}>{customer_name}</Text>
                    <Text style={styles.text}>{billing_address?.street}</Text>
                    <Text style={styles.text}>{billing_address?.city}, {billing_address?.region}</Text>
                    <Text style={styles.text}>{country}</Text>
                    <Text style={styles.text}>{billing_address?.telephone}</Text>
                    <View style={[styles.line, { marginTop: 10 }]}></View>
                </>
            }


            {/* Payment Method*/}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenPM(!openPM)}
                style={styles.touchableCont}>
                <Text style={styles.text_list}>Payment Method</Text>
                <MaterialCommunityIcons name={openPM ? "chevron-down" : "chevron-right"} color='black' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            <View style={styles.line}></View>
            {openPM &&
                <>

                    <Text style={styles.text}>{payment_method}</Text>

                    <View style={[styles.line, { marginTop: 10 }]}></View>
                </>
            }


        </View >
    )
}

export default OrderInfo

const styles = StyleSheet.create({
    mainCont: {
        width: "100%",
        alignItems: "flex-start",
        alignSelf: "center",
        // marginBottom:100
    },

    touchableCont: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        marginTop:10,
        width: "100%",
    },
    text_list: {
        fontWeight: "500",
        color: "black",
        fontSize: 16,
    },
    text: {
        fontWeight: "500",
        color: "black",
        fontSize: 14,
        marginTop:3
    },
    line: {
        width: "100%",
        height: 0.5,
        backgroundColor: "#666666",
        marginBottom: 10
    }
})