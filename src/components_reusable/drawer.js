import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import LinearX from '../animations/LinearX'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AsyncStorage from '@react-native-async-storage/async-storage'
const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

export default class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onPress = (key) => {
        var { props: { userData: { user }, navigation, actions }, onDismiss } = this.props
        switch (key) {
            case "my_account":
                onDismiss()
                navigation.navigate("Account")
                break;
            case "my_orders":
                // onDismiss()
                // navigation.navigate("Account")
                break;
            case "my_wishlist":
                // onDismiss()
                // navigation.navigate("Account")
                break;
            case "address_book":
                // onDismiss()
                // navigation.navigate("Account")
                break;
            case "account_info":
                onDismiss()
                navigation.navigate("ChangeUserData")
                break;

            case "my_pr_review":
                // onDismiss()
                // navigation.navigate("ChangeUserData")
                break;
            case "logout":

                onDismiss()
                setTimeout(() => {
                    // console.log("Actions Redex", actions)
                    actions.userToken("")
                    actions.adminToken("")
                    actions.user("")
                    actions.myOrders("")
                    AsyncStorage.setItem("@aljaber_userLoginData", "")
                }, 1000)
                break;


        }
    }

    render() {
        var { props: { userData: { user } }, isOpen, onDismiss } = this.props
        return (
            <>
                {
                    isOpen &&
                    <View style={styles.mainContainer}>
                        <TouchableOpacity
                            onPress={onDismiss}
                            style={styles.mainContainer1}>

                            {/* Animation Componet */}

                        </TouchableOpacity>
                        <LinearX style={styles.inner_main}>
                            <View style={styles.inner_main1}>

                                <View style={styles.darkCont}>
                                    <Text style={styles.darkContText}>Welcome,</Text>
                                    <Text style={[styles.darkContText, { marginTop: 5 }]}>{user?.firstname} {user?.lastname}</Text>
                                </View>

                                {/* My Account */}
                                <TouchableOpacity
                                    onPress={() => this.onPress("my_account")}
                                    style={[styles.touchable, { marginTop: 20, }]}>
                                    <Text style={styles.text_touchable}>My Account</Text>
                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                </TouchableOpacity>

                                {/* My Orders */}
                                <TouchableOpacity
                                    onPress={() => this.onPress("my_orders")}
                                    style={styles.touchable}>
                                    <Text style={styles.text_touchable}>My Order</Text>
                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                </TouchableOpacity>

                                {/* My Wishlist */}
                                <TouchableOpacity
                                    onPress={() => this.onPress("my_wishlist")}
                                    style={styles.touchable}>
                                    <Text style={styles.text_touchable}>My Wishlist</Text>
                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                </TouchableOpacity>

                                {/* Address Book */}
                                <TouchableOpacity
                                    onPress={() => this.onPress("address_book")}
                                    style={styles.touchable}>
                                    <Text style={styles.text_touchable}>Address Book</Text>
                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                </TouchableOpacity>

                                {/* Address Book */}
                                <TouchableOpacity
                                    onPress={() => this.onPress("account_info")}
                                    style={styles.touchable}>
                                    <Text style={styles.text_touchable}>Account Info</Text>
                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                </TouchableOpacity>

                                {/* My product Reviews */}
                                <TouchableOpacity
                                    onPress={() => this.onPress("my_pr_review")}
                                    style={styles.touchable}>
                                    <Text style={styles.text_touchable}>My Product Reviews</Text>
                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                </TouchableOpacity>

                                {/* My product Reviews */}
                                <TouchableOpacity
                                    onPress={() => this.onPress("logout")}
                                    style={[styles.touchable, { position: "absolute", bottom: 15 }]}>
                                    <Text style={styles.text_touchable}>Logout</Text>
                                    <MaterialCommunityIcons name="location-exit" color='#3F51B5' size={24} />
                                </TouchableOpacity>

                            </View>
                        </LinearX>
                    </View >
                }
            </>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        height: height,
        backgroundColor: "rgba(52,52,52,0.05)",
        position: "absolute",
        zIndex: 400,
    },
    mainContainer1: {
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        backgroundColor: "rgba(52,52,52,0.05)",
        position: "absolute",
        zIndex: 1,
    },
    inner_main: {
        width: width / 1.9,
        height: "100%",
        backgroundColor: "white",
        zIndex: 400,
        // alignSelf:"flex-start"
        marginLeft: -1
    },
    inner_main1: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 400,
    },
    darkCont: {
        width: "100%",
        height: 120,
        backgroundColor: "#020621",
        justifyContent: "center",
        alignItems: "center",
    },
    darkContText: {
        color: "white",
        fontWeight: "500",
        fontSize: 14,
    },
    touchable: {
        width: "90%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    text_touchable: {
        color: "black",
        fontWeight: "400",
        fontSize: 15,
    }
})