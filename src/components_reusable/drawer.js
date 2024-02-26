import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import LinearX from '../animations/LinearX'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

export default class Drawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openAppointmentOptions: false,
        }
    }

    onPress = async (key) => {
        var { props: { userData: { user, offersobj, admintoken }, navigation, actions }, onDismiss } = this.props
        switch (key) {
            case "my_account":
                onDismiss()
                navigation.navigate("Account")
                break;
            case "my_orders":
                onDismiss()
                navigation.navigate("MyOrders")
                break;
            case "my_wishlist":
                onDismiss()
                navigation.navigate("Wishlist")
                break;
            case "address_book":
                onDismiss()
                navigation.navigate("AddressBook")
                break;
            case "account_info":
                onDismiss()
                navigation.navigate("ChangeUserData")
                break;
            case "my_pr_review":
                onDismiss()
                navigation.navigate("MyReviews")
                break;
            case "appointment":
                this.setState({ openAppointmentOptions: !this.state.openAppointmentOptions })
                break;
            case "eyetest":
                onDismiss()
                navigation.navigate("Eyetest")
                break;
            case "mobilebus":
                onDismiss()
                navigation.navigate("Mobile_Bus")
                break;
            case "offers":
                console.log("Offers", offersobj);

                var image = "/pub/media/wysiwyg/smartwave/porto/theme_assets/images/banner2.jpg"
                await api.get("categories/" + offersobj?.id, {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    }
                }).then((res) => {
                    // console.log("Response for Top Category API:", res?.data)
                    for (let r = 0; r < res?.data?.custom_attributes.length; r++) {
                        if (res?.data?.custom_attributes[r].attribute_code == "image") {
                            image = res?.data?.custom_attributes[r]?.value
                            break;
                        }

                    }
                }).catch((err) => {
                    console.log("Err Fetching image in DefaultCategoryItems: ", err)
                })
                onDismiss()
                navigation.navigate("Products", {
                    item: offersobj,
                    mainCat_selected: offersobj?.parent_position,
                    sub_category_id: offersobj?.id,
                    imageLinkMain: image,
                    otherCats: [],

                })

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
        // console.log("user", user);
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


                                {
                                    (Object.keys(user).length == 0 || user == "") ?
                                        <>
                                            {/* Signin */}
                                            <TouchableOpacity
                                                onPress={() => this.onPress("my_account")}
                                                style={[styles.touchable, { marginTop: 20, }]}>
                                                <Text style={styles.text_touchable}>Signin</Text>
                                                <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                            </TouchableOpacity>

                                              {/* Offers */}
                                              <TouchableOpacity
                                                onPress={() => this.onPress("offers")}
                                                style={styles.touchable}>
                                                <Text style={styles.text_touchable}>Offers</Text>
                                                <MaterialIcons name="discount" color='#3F51B5' size={20} style={{
                                                    transform: [{
                                                        rotate: "90deg"
                                                    }], marginRight: 6
                                                }} />
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <>
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

                                            {/* Appointment */}
                                            <TouchableOpacity
                                                onPress={() => this.onPress("appointment")}
                                                style={styles.touchable}>
                                                <Text style={styles.text_touchable}>Appointment</Text>
                                                <MaterialCommunityIcons name={this.state.openAppointmentOptions ? "chevron-down" : "chevron-right"} color='#3F51B5' size={30} />
                                            </TouchableOpacity>

                                            {this.state.openAppointmentOptions && <View style={{ width: "95%", alignItems: "flex-end" }}>

                                                {/* EyeTest */}
                                                <TouchableOpacity
                                                    onPress={() => this.onPress("eyetest")}
                                                    style={[styles.touchable, {
                                                        width: "80%",
                                                        alignSelf: "flex-end",
                                                    }]}>
                                                    <Text style={styles.text_touchable}>Eye Test</Text>
                                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                                    <View style={{ width: "95%", height: 1, backgroundColor: "#666666", position: "absolute", bottom: 0 }}></View>
                                                </TouchableOpacity>
                                                {/* Appointment */}
                                                <TouchableOpacity
                                                    onPress={() => this.onPress("mobilebus")}
                                                    style={[styles.touchable, {
                                                        width: "80%",
                                                        alignSelf: "flex-end",
                                                    }]}>
                                                    <Text style={styles.text_touchable}>Mobile Bus</Text>
                                                    <MaterialCommunityIcons name="chevron-right" color='#3F51B5' size={30} />
                                                    <View style={{ width: "95%", height: 0.5, backgroundColor: "#666666", position: "absolute", bottom: 0 }}></View>
                                                </TouchableOpacity>
                                            </View>}


                                            {/* Offers */}
                                            <TouchableOpacity
                                                onPress={() => this.onPress("offers")}
                                                style={styles.touchable}>
                                                <Text style={styles.text_touchable}>Offers</Text>
                                                <MaterialIcons name="discount" color='#3F51B5' size={20} style={{
                                                    transform: [{
                                                        rotate: "90deg"
                                                    }], marginRight: 6
                                                }} />
                                            </TouchableOpacity>

                                            {/* Logout */}
                                            <TouchableOpacity
                                                onPress={() => this.onPress("logout")}
                                                style={[styles.touchable, { position: "absolute", bottom: height >= 675 ? 30 : 15 }]}>
                                                <Text style={styles.text_touchable}>Logout</Text>
                                                <MaterialCommunityIcons name="location-exit" color='#3F51B5' size={24} />
                                            </TouchableOpacity>
                                        </>
                                }


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