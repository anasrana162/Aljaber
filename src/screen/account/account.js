import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView } from 'react-native'
import React, { Component } from 'react'
import TabNavigator from '../../components_reusable/TabNavigator';
import AccountOptions from './components/accountOptions';
import Settings from './components/settings';
import Entypo from 'react-native-vector-icons/Entypo'
import AuthSelector from './components/authSelector';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Information from './components/information';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import NewsLetter from '../../components_reusable/newsLetter';
import ContactInfo from './components/contactInfo';

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // authModal: false,
            def_ship_add: "",
            def_bill_add: "",
            def_ship_add_found: false,
            def_bill_add_found: false,
            countries: [],
            orders: null,
        };
    }


    // closeAuthModalHandler = (key) => {
    //     switch (key) {
    //         case "open":
    //             setImmediate(() => {
    //                 this.setState({
    //                     authModal: true
    //                 })
    //             })
    //             break;

    //         case "close":
    //             setImmediate(() => {
    //                 this.setState({
    //                     authModal: false
    //                 })
    //             })
    //     }

    // }
    getCountries = () => {

        api.get("aljaber/getallcountry").then((result) => {
            // console.log("Get Country Api Result: ", result?.data)
            setImmediate(() => {
                this.setState({ countries: result?.data })
            })
        }).catch(err => {
            console.log("Get Country Api Error: ", err)
        })

    }

    Logout = () => {
        var { actions } = this.props
        this.props.navigation.navigate("HomeScreen")
        setTimeout(() => {
            // console.log("Actions Redex", actions)
            actions.userToken("")
            actions.adminToken("")
            actions.user("")
            actions.myOrders("")
            AsyncStorage.setItem("@aljaber_userLoginData", "")
        }, 1000)

    }

    // checkProps = () => {
    //     if (this.props?.route?.params?.modal !== undefined && this.props?.route?.params?.modal == "open") {

    //         setImmediate(() => {
    //             this.setState({
    //                 authModal: true
    //             })
    //         })
    //     } else {
    //         console.log("Nothing to check Account.js")
    //     }
    // }

    componentDidMount = () => {
        // this.checkProps()
        this.checkUserData()
    }

    fetchUserOrders = () => {
        var { userData: { user, admintoken, orders }, actions } = this.props
        // console.log("customer?.id", user?.id)
        if (orders == null || orders == "") {

            api.get("orders?searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bfield%5d=" + "customer_id"
                + "&searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bvalue%5d=" + user?.id
                + "searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bconditionType%5d=eq",
                {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                })
                .then((res) => {
                    console.log("Orders of Coustomer are:", res?.data)
                    actions.myOrders(res?.data?.items)
                    this.setState({ orders: res?.data?.items })
                }).catch((err) => {
                    console.log("Err get customer orders api:  ", err?.response?.data?.message)
                })
        } else {
            this.setState({ orders: orders })
            console.log("Orders already exits")
        }
    }

    checkUserData = () => {
        var { userData: { user } } = this.props

        if (Object.keys(user)?.length == 0) {

        } else {
            setImmediate(() => {
                this.getCountries()
                this.getDefaultAddresses()
                this.fetchUserOrders()
            })
        }

    }

    getDefaultAddresses = () => {
        var { userData: { user: { default_billing, default_shipping, addresses } } } = this.props

        for (let a = 0; a < addresses?.length; a++) {
            if (addresses[a].id == default_billing) {

                this.setState({
                    def_bill_add: addresses[a],
                    def_bill_add_found: true,
                })

            }
            if (addresses[a].id == default_shipping) {
                this.setState({
                    def_ship_add: addresses[a],
                    def_ship_add_found: true,
                })
            }
            if (this.state.def_bill_add_found == true && this.state.def_ship_add_found == true) {
                // beaking loop if both addresses are found
                break;
            }
        }

    }

    render() {
        var { userData: { user } } = this.props
        var country_def_bill_add = this.state.def_bill_add == "" ? "" : this.state.countries.filter((item) => item?.country_id == this.state.def_bill_add?.country_id)[0]
        var country_ship_add = this.state.def_ship_add == "" ? "" : this.state.countries.filter((item) => item?.country_id == this.state.def_ship_add?.country_id)[0]

        // console.log(country_def_bill_add)
        // console.log("country_ship_add , country_def_bill_add", country_ship_add, "  ", country_def_bill_add)
        return (
            <View style={styles.mainContainer}>
                {Object.keys(user)?.length == 0 || user == "" ?
                    <>
                        <View style={styles.header_comp}>
                            {/** Title screen */}
                            <Text style={styles.heading}>My Account</Text>
                        </View>
                        {/** Modal for login/register */}


                        {/* <View style={styles.modal_cont}>                               */}
                        {/** Login or Register */}
                        <AuthSelector
                            props={this.props}
                            style={{ backgroundColor: "#f0f0f0", marginTop: 120 }}
                        />
                        {/* </View> */}



                    </>
                    :
                    <>
                        <View style={styles.header_comp}>
                            {/** Title screen */}
                            <Text style={styles.heading}>My Account</Text>
                        </View>

                        <View style={styles.inner_cont_main}>
                            <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ width: "100%", }}>
                                {/**login/Register Button */}
                                {/* <TouchableOpacity
                                    onPress={() => this.closeAuthModalHandler("open")}
                                    activeOpacity={0.8}
                                    style={styles.login_reg_btn}
                                >
                                    <Text style={styles.log_reg_btn_text}>Login / Register</Text>
                                </TouchableOpacity> */}

                                {/** Contact Information */}
                                <ContactInfo userData={user} navProps={this.props} />

                                {/** Order Track */}
                                {/* <Text style={styles.track_order_text}>Track your orders and check out quicker</Text> */}
                                <AccountOptions
                                    props={this.props.userData.user}
                                    Logout={() => this.Logout()}
                                    orders={this.state.orders}
                                    navProps={this.props.navigation}
                                    def_bill_add={this.state.def_bill_add}
                                    def_ship_add={this.state.def_ship_add}
                                    country_bill_add={country_def_bill_add}
                                    country_ship_add={country_ship_add}
                                />

                                {/** Settings */}
                                {/* <Settings /> */}

                                {/** Infromation */}
                                {/* <Information navProps={this.props.navigation} /> */}

                                <Text style={[styles.copyright_text, { marginTop: 20,}]}>© copyright 2023 Al-Jaber Alll rights reserved</Text>
                                <Text style={styles.copyright_text}>Version 1.0 build 1</Text>

                                <View style={styles.social_icon_main_cont}>
                                    <FontAwesome name="facebook-f" size={34} color="#3F51B5" />
                                    <FontAwesome name="twitter" size={34} color="#3F51B5" />
                                    <FontAwesome name="instagram" size={34} color="#3F51B5" />
                                    <FontAwesome name="youtube-play" size={34} color="#3F51B5" />
                                </View>

                                {/* <View style={{ width: width, height: 1, backgroundColor: "#020621", marginTop: 20 }} /> */}
                                {/** Tab Navigator Custom */}
                            </ScrollView>
                        </View>
                        <TabNavigator screenName={"account"} navProps={this.props.navigation} />
                    </>
                }
                {/** Modal for login/register */}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={false}
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

            </View >

        )
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "#f0f0f0"
    },
    // modal_cont: {
    //     width: width,
    //     backgroundColor: "#fff",
    //     height: height - 100,
    //     borderTopRightRadius: 40,
    //     borderTopLeftRadius: 40,
    //     zIndex: 200,
    //     position: "absolute",
    //     bottom: 0
    // },
    modal_cont: {
        width: width,
        backgroundColor: "#f0f0f0",
        height: height - 100,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        zIndex: 200,
        position: "absolute",
        bottom: 0
    },
    blockContainer: {
        width: width - 60,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 20,
    },
    upper_block_cont: {
        width: "100%",
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#233468"
    },
    upper_block_text: {
        fontSize: 16,
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
        fontSize: 14,
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
        height: 40,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#233468"
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
        marginBottom: 20,
        alignItems: "center",
        width: width - 20,
        height: height-140,
        alignSelf: "center",
        backgroundColor: "#f0f0f0",
        marginTop: Platform.OS == "ios" ? 10 : 20,
    },
    heading: {
        fontSize: 24,
        color: "white",
        fontWeight: "600",

    },
    header_comp: {
        width: width,
        justifyContent: "center",
        backgroundColor: "#020621",
        alignItems: "center",
        paddingTop: 0,
        paddingBottom: 10
    },
    subHeading: {
        fontSize: 20,
        color: "#020621",
        fontWeight: "600",
        alignSelf: "flex-start",
        marginTop: 10,
    },
    login_reg_btn: {
        width: width - 160,
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
        fontSize: 18,
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
        alignSelf:"center" 
    },
    social_icon_main_cont: {
        width: width - 120,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        alignSelf:"center" 
    }
})
{/* {---------------redux State ------------} */ }
const mapStateToProps = state => ({
    userData: state.userData
});

{/* {---------------redux Actions ------------} */ }

const ActionCreators = Object.assign(
    {},
    userActions,
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
