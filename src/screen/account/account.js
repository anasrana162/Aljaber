import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView } from 'react-native'
import React, { Component } from 'react'
import TabNavigator from '../../components_reusable/TabNavigator';
import OrderList from './components/orderList';
import Settings from './components/settings';
import Entypo from 'react-native-vector-icons/Entypo'
import AuthSelector from './components/authSelector';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authModal: false,
        };
    }


    closeAuthModalHandler = (key) => {
        switch (key) {
            case "open":
                setImmediate(() => {
                    this.setState({
                        authModal: true
                    })
                })
                break;

            case "close":
                setImmediate(() => {
                    this.setState({
                        authModal: false
                    })
                })
        }

    }

    render() {
        return (
            <View style={styles.mainContainer}>

                {/* <View style={styles.colorView}></View> */}

                <ScrollView style={{ width: "100%", }}>

                    <View style={styles.inner_cont_main}>


                        {/** Title screen */}
                        <Text style={styles.heading}>Your Account</Text>

                        {/**login/Register Button */}
                        <TouchableOpacity
                            onPress={() => this.closeAuthModalHandler("open")}
                            activeOpacity={0.8}
                            style={styles.login_reg_btn}
                        >
                            <Text style={styles.log_reg_btn_text}>Login / Register</Text>
                        </TouchableOpacity>

                        {/** Order Track */}
                        <Text style={styles.track_order_text}>Track your orders and check out quicker</Text>
                        <OrderList navProps={this.props.navigation} />

                        {/** Settings */}
                        <Settings />

                        {/** logo copyright */}
                        <Image
                            source={require("../../../assets/aljabirlogo.png")}
                            style={{ width: 130, height: 130 }}
                        />
                        <Text style={[styles.copyright_text, { marginTop: -10 }]}>© copyright 2023 Al-Jaber Alll rights reserved</Text>
                        <Text style={styles.copyright_text}>Version 1.0 build 1</Text>

                        <View style={styles.social_icon_main_cont}>
                        <FontAwesome name="facebook-f" size={34} color="#3F51B5" />
                        <FontAwesome name="twitter" size={34} color="#3F51B5" />
                        <FontAwesome name="instagram" size={34} color="#3F51B5" />
                        <FontAwesome name="youtube-play" size={34} color="#3F51B5" />
                        </View>

                        <View style={{ width: width, height: 1, backgroundColor: "#020621", marginTop: 20 }} />
                    </View>

                </ScrollView>

                {/** Tab Navigator Custom */}
                <TabNavigator screenName={"account"} navProps={this.props.navigation} />

                {/** Modal for login/register */}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.authModal}
                    onRequestClose={() => this.closeAuthModalHandler("close")}
                    style={{ justifyContent: "flex-end", alignItems: "center" }}
                >
                    <Pressable
                        onPress={() => this.closeAuthModalHandler("close")}
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(52,52,52,0.8)",
                            justifyContent: "flex-end",
                            zIndex: 170
                        }}>
                    </Pressable>
                    <View style={styles.modal_cont}>

                        {/** close button and app logo */}
                        <View
                            style={styles.modal_crossBtn_logo}>
                            <TouchableOpacity
                                onPress={() => this.closeAuthModalHandler("close")}
                                style={{ position: "absolute", left: 10 }} >
                                <Entypo name="circle-with-cross" size={25} color='#020621' />
                            </TouchableOpacity>
                            <Image
                                source={require("../../../assets/aljabirlogo.png")}
                                style={{ width: 130, height: 130 }}
                            />
                        </View>

                        {/** Line */}
                        <View style={{ width: width, height: 1, backgroundColor: "#999", marginTop: -10 }} />

                        {/** Login or Register */}
                        <AuthSelector props={this.props} />
                    </View>


                </Modal>

            </View>

        )
    }
}

export default Account;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
    modal_cont: {
        width: width,
        backgroundColor: "#fff",
        height: height - 100,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        zIndex: 200,
        position: "absolute",
        bottom: 0
    },
    modal_crossBtn_logo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: width,

    },
    colorView: {
        width: width,
        backgroundColor: "#020621",
        height: 20
    },
    inner_cont_main: {
        marginBottom:150,
        alignItems: "center",
        width: width - 20,
        height: height,
        alignSelf: "center",
        backgroundColor: "white",
        marginTop: Platform.OS == "ios" ? 10 : 20,
    },
    heading: {
        fontSize: 28,
        color: "#020621",
        fontWeight: "600",
        alignSelf: "flex-start"
    },
    login_reg_btn: {
        width: width - 40,
        height: 45,
        borderRadius: 15,
        marginTop: 20,
        backgroundColor: "#020621",//"#3F51B5",
        justifyContent: "center",
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
    log_reg_btn_text: {
        fontSize: 20,
        fontWeight: "500",
        color: "white",
    },
    track_order_text: {
        fontSize: 14,
        fontWeight: "500",
        color: "#020621",
        marginTop: 15,
        marginBottom: 10
    },
    copyright_text: {
        color: "#020621",
        fontSize: 12,
    },
    social_icon_main_cont: {
        width: width - 120,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
    }
})