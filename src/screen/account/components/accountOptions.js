import { Text, StyleSheet, View, Dimensions, NativeModules, TouchableOpacity, Platform, Image } from 'react-native'
import React, { Component, PureComponent, memo, useState } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import moment from 'moment'

const width = Dimensions.get("screen").width

const AccountOptions = ({ navProps,props, Logout, orders, country_ship_add, country_bill_add, def_bill_add, def_ship_add }) => {
    const [openOrders, setOpenOrders] = useState(false)
    const [openNL, setOpenNL] = useState(false)
    const [openAB, setOpenAB] = useState(false)
console.log("props",props)
    return (
        <>
            <View style={{ width: width - 20, alignSelf: "center", height: 1, backgroundColor: "#020621", marginTop: 15 }} />
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenNL(!openNL)}
                style={[styles.mainContainer, { marginTop: 20 }]}>
                <Entypo name="newsletter" size={30} color="#3F51B5" />
                <Text style={styles.text_list}>News Letters</Text>
                <MaterialCommunityIcons name={openNL ? "chevron-down" : "chevron-right"} color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            {/* NewsLetters Block */}
            {openNL && <View style={[styles.blockContainer, { marginTop: 10, marginBottom: 20 }]}>
                {/* Upper Conatiner */}
                <View style={styles.upper_block_cont}>
                    <Text style={styles.upper_block_text}>NEWSLETTERS</Text>
                </View>
                {/* middle Conatiner */}
                <View style={styles.middle_block_cont}>
                    {
                        props?.extension_attributes?.is_subscribed ?
                            <Text style={styles.middle_block_text}>You are subscribed to "General Subscription".</Text>
                            :
                            <NewsLetter
                                props={this.props}
                                style={{ backgroundColor: "white", marginLeft: -5, width: width - 60, }}
                                innerMainStyle={{ marginVertical: 10 }}
                                txtInpStyle={{ width: width - 80 }}
                                paraStyle={{ width: width - 80 }}
                            />
                    }
                    {/* <Text style={styles.middle_block_text}>{user?.email}</Text> */}
                </View>
                {/* Lower Conatiner */}
                <View style={styles.lower_block_cont}>
                    <TouchableOpacity style={{ padding: 5 }}>
                        <Text style={styles.lower_block_text}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>}



            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenAB(!openAB)}
                style={[styles.mainContainer, { marginTop: 0 }]}>
                <FontAwesome5 name="address-book" size={26} color="#3F51B5" />
                <Text style={[styles.text_list, { marginLeft: 20 }]}>Address Book</Text>
                <MaterialCommunityIcons name={openAB ? "chevron-down" : "chevron-right"} color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>
            {
                openAB &&
                <>

                    {
                        def_ship_add == "" ? <></> :
                            <>
                                {/* default Shipping Address Block */}
                                < View style={[styles.blockContainer, { marginTop: 10 }]}>
                                    {/* Upper Conatiner */}
                                    <View style={styles.upper_block_cont}>
                                        <Text style={styles.upper_block_text}>DEFAULT SHIPPING ADDRESS</Text>

                                    </View>
                                    {/* middle Conatiner */}
                                    <View style={styles.middle_block_cont}>

                                        <Text style={[styles.middle_block_text, { fontWeight: "400" }]}>{props?.firstname} {props?.lastname}</Text>
                                        <Text style={[styles.middle_block_text, { fontWeight: "400" }]}>{def_ship_add?.street[0]}</Text>
                                        <Text style={[styles.middle_block_text, { fontWeight: "400" }]}>{def_ship_add?.region?.region}, {def_ship_add?.postcode}</Text>
                                        <Text style={styles.middle_block_text}>{(country_ship_add == "" || country_ship_add == undefined) ? "" : country_ship_add?.country}</Text>
                                        <Text style={styles.middle_block_text}>T: {def_ship_add?.telephone}</Text>
                                    </View>
                                    {/* Lower Conatiner */}
                                    <View style={styles.lower_block_cont}>
                                        <TouchableOpacity style={{ padding: 5 }}>
                                            <Text style={styles.lower_block_text}>Edit Address</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>

                    }
                    {
                        def_bill_add == "" ? <></> :
                            <>
                                {/* default Shipping Address Block */}
                                < View style={[styles.blockContainer, { marginTop: 20, marginBottom: 20 }]}>
                                    {/* Upper Conatiner */}
                                    <View style={styles.upper_block_cont}>
                                        <Text style={styles.upper_block_text}>DEFAULT BILLING ADDRESS</Text>

                                    </View>
                                    {/* middle Conatiner */}
                                    <View style={styles.middle_block_cont}>

                                        <Text style={[styles.middle_block_text, { fontWeight: "400" }]}>{props?.firstname} {props?.lastname}</Text>
                                        <Text style={[styles.middle_block_text, { fontWeight: "400" }]}>{def_bill_add?.street[0]}</Text>
                                        <Text style={[styles.middle_block_text, { fontWeight: "400" }]}>{def_bill_add?.region?.region}, {def_ship_add?.postcode}</Text>
                                        <Text style={styles.middle_block_text}>{(country_bill_add == "" || country_bill_add == undefined) ? "" : country_bill_add?.country}</Text>
                                        <Text style={styles.middle_block_text}>T: {def_bill_add?.telephone}</Text>
                                    </View>
                                    {/* Lower Conatiner */}
                                    <View style={styles.lower_block_cont}>
                                        <TouchableOpacity style={{ padding: 5 }}>
                                            <Text style={styles.lower_block_text}>Edit Address</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>

                    }
                </>
            }


            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenOrders(!openOrders)}
                style={[styles.mainContainer, { marginTop: 0 }]}>
                <Ionicons name="cube-outline" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Recent Orders</Text>
                <MaterialCommunityIcons name={openOrders ? "chevron-down" : "chevron-right"} color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            {
                openOrders &&
                <>
                    {(orders !== null || orders == "") &&
                        orders.map((item, index) => {
                            // console.log("Item in orders", item)
                            return (
                                <View key={index}>
                                    {index <= 2 && <View
                                        style={styles.orderItemCont}
                                    >
                                        {/* Order No# */}
                                        <View style={styles.flex_column}>
                                            <Text style={styles.flex_row_title_text}>Order#:
                                                <Text style={styles.flex_row_title_text}>{item?.increment_id}</Text>
                                            </Text>
                                            <Text style={styles.flex_row_title_text}>Date:
                                                <Text style={styles.flex_row_title_text}> {moment(item?.created_at).format("YYYY-MM-DD")}</Text>
                                            </Text>
                                            <Text style={styles.flex_row_title_text}>Ship to:
                                                <Text style={styles.flex_row_title_text}> {item?.customer_firstname} {item?.customer_lastname}</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.flex_column}>
                                            <Text style={styles.flex_row_title_text}>Order Total:
                                                <Text style={styles.flex_row_title_text}> AED {item?.grand_total}</Text>
                                            </Text>
                                            <Text style={styles.flex_row_title_text}>Status:
                                                <Text style={styles.flex_row_title_text}> {item?.status}</Text>
                                            </Text>
                                            <Text style={styles.flex_row_title_text}>Action:
                                                <TouchableOpacity
                                                onPress={()=> navProps.navigate("My_orders",{
                                                    "order_detail":item,
                                                })}
                                                >
                                                    <Text style={[styles.flex_row_title_text, {
                                                        color: "#3F51B5",
                                                        textDecorationLine: "underline"
                                                    }]}> View</Text>
                                                </TouchableOpacity>
                                            </Text>
                                        </View>
                                    </View>}
                                </View>
                            )
                        })
                    }
                </>
            }


            {/* Logout Button */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={Logout}
                style={[styles.mainContainer, { marginTop: 0 }]}>
                <MaterialCommunityIcons name="logout" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Logout</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity>

            {/* <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mainContainer}>
                <Ionicons name="eye" color='#3F51B5' size={30} />
                <Text style={styles.text_list}>Book an appointment</Text>
                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} style={{ position: "absolute", right: 20 }} />
            </TouchableOpacity> */}
            <View style={{ width: width, height: 1, backgroundColor: "#020621", marginTop: 15 }} />
        </>
    )
}

export default AccountOptions

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
    flex_row_title_text: {
        fontWeight: "500",
        color: "#666666",
        fontSize: 14,
    },
    flex_row_value_text: {
        fontWeight: "500",
        color: "black",
        fontSize: 14,
    },
    orderItemCont: {
        width: width - 50,
        // height: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 0.2,
        borderBottomWidth: 0.2,
        alignSelf: "center",
        marginVertical: 10,
        paddingVertical: 10
        // marginTop: 10
    },
    flex_column: {
        // flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    blockContainer: {
        width: width - 80,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 20,
    },
    upper_block_cont: {
        width: "100%",
        height: 30,
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#233468"
    },
    upper_block_text: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
        marginLeft: 10,
    },
    middle_block_cont: {
        width: "100%",
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#ffffff"
    },
    middle_block_text: {
        fontSize: 12,
        fontWeight: "600",
        color: "#020621",
        marginLeft: 10,
        marginBottom: 5,
    },
    lower_block_text: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
        marginLeft: 10,
        textDecorationLine: "underline"
    },
    lower_block_cont: {
        width: "100%",
        height: 30,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#233468"
    },
})