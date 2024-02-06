import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'

import HomeHeader from '../home/components/homeHeader';
import Drawer from '../../components_reusable/drawer';
import api, { custom_api_url, basis_auth } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components_reusable/loading';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class AddressBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawer: false,
            loader: false,
            default_billing_address: {},
            default_shipping_address: {},
        }
    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }
    componentDidMount = () => {
        this.props.navigation.addListener('focus', async () => {
            this.fetchDefaultAddresses()
        })

        this.fetchDefaultAddresses()
    }

    loginUser = async () => {

        var { actions } = this.props

        var LoginData = await AsyncStorage.getItem("@aljaber_userLoginData")
        var objLoginData = JSON.parse(LoginData)
        console.log("LoginData", objLoginData)
        if (objLoginData !== null) {

            var customerToken = await api.post('integration/customer/token', {
                username: objLoginData?.username,
                password: objLoginData?.password,
            })

            // console.log("customerToken", customerToken?.data)
            if (customerToken?.data !== "") {
                const res = await api.post(
                    "carts/mine",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${customerToken?.data}`,
                            "Content-Type": "application/json",
                        },
                    }
                ).then((result) => {


                    // console.log("========Success ALJEBER============ Home", result?.data);

                    api.get('customers/me', {
                        headers: {
                            Authorization: `Bearer ${customerToken?.data}`,
                        },
                    }).then((user_data) => {


                        if (user_data?.data) {
                            // console.log("TOKEN GENERATED============Home",)
                            actions.userToken(customerToken?.data)
                            user_data.data.cartID = result?.data
                            actions.user(user_data?.data)
                            this.fetchDefaultAddresses()

                        }
                    }).catch((err) => {
                        alert("Network Error Code: (cd1)")
                        console.log("customer data Api error HOme: ", err?.response)

                    })
                }).catch((err) => {
                    console.log("Error AddtoCart ID API Home:", err?.message)

                })
            }
        }
        else {
            console.log("No credentials found for login")
        }
    }

    fetchDefaultAddresses = () => {
        var { userData: { countries, user: { addresses, default_billing, default_shipping } }, } = this.props

        this.setState({
            loader: true
        })

        var check = []

        for (let a = 0; a < addresses.length; a++) {
            var country = countries.filter((item, index) => item?.country_id == addresses[a]?.country_id)[0]
            addresses[a].country = country?.country
            // console.log("country", country);
            if (default_billing == addresses[a]?.id) {
                this.setState({
                    default_billing_address: addresses[a]
                })
                check.push("1")
            }
            if (default_shipping == addresses[a]?.id) {
                this.setState({
                    default_shipping_address: addresses[a]
                })
                check.push("1")
            }
            if (check.length == 2) {
                this.setState({
                    loader: false,
                })
                break;
            }
        }


    }

    deleteAddress = (index) => {
        var { userData: { countries, user: { addresses, id }, admintoken } } = this.props

        var tempAddress = addresses

        this.setState({
            loader: true
        })

        tempAddress.splice(index, 1)

        for (let a = 0; a < tempAddress.length; a++) {
            delete tempAddress[a].country
        }

        console.log("addresses", tempAddress);

        let final_obj = {
            "customer": {
                "addresses": tempAddress
            }
        }

        api.put("customers/" + id,
            final_obj,
            {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            }
        ).then((res) => {
            console.log("Res customer profile update API (Save to address Book) Address Book Screen:", res?.data)
            this.loginUser()

        }).catch((err) => {
            console.log("Err customer profile update API (Save to address Book) Address Book Screen", err?.response)
        })

    }

    render() {
        var { userData: { countries, user: { addresses }, user } } = this.props
        var { default_billing_address, default_shipping_address } = this.state
        // console.log('this.state.default_billing_address :>> ', this.state.default_billing_address);
        // console.log('this.state.default_shipping_address :>> ', this.state.default_shipping_address);
        return (
            <View style={styles.mainContainer}>
                {/** Header for Address Book*/}
                <HomeHeader
                    navProps={this.props.navigation}
                    openDrawer={() => this.openDrawer()}
                />

                {/* Loader */}
                {this.state.loader &&
                    <Loading />
                }


                {/* Drawer */}
                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Address Book</Text>
                        <Text style={[styles.title, { fontWeight: "500", marginTop: 20 }]}>Default Addresses</Text>

                        {/* Default Billing Address */}
                        {Object.keys(default_billing_address).length !== 0 && <View style={styles.defaultAddressCont}>
                            <View style={styles.defaultAddressTitleCont}>
                                <Text style={[styles.title, { marginTop: 0, fontSize: 16, marginLeft: 10, }]}>Default Billing Address</Text>
                            </View>

                            <View style={{ rowGap: 5, alignSelf: "flex-start", marginLeft: 10, }}>
                                <Text style={styles.defaultAddressText}>{default_billing_address?.firstname} {default_billing_address?.lastname}</Text>
                                <Text style={styles.defaultAddressText}>{default_billing_address?.street}</Text>
                                <Text style={styles.defaultAddressText}>{default_billing_address?.region?.region}, {default_billing_address?.city}, {default_billing_address?.postcode}</Text>
                                <Text style={styles.defaultAddressText}>{default_billing_address?.country}</Text>
                                <Text style={styles.defaultAddressText}>{default_billing_address?.telephone}</Text>
                            </View>

                            <View style={styles.defaultAddressTitleCont}>
                                <TouchableOpacity>
                                    <Text style={[styles.title, {
                                        marginTop: 0,
                                        fontSize: 16,
                                        marginLeft: 10,
                                        color: "#08c",
                                        textDecorationLine: "underline",
                                        paddingVertical: 10
                                    }]}>Change Billing Address</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                        {/* Default Billing Address */}
                        {Object.keys(default_shipping_address).length !== 0 && <View style={styles.defaultAddressCont}>
                            <View style={styles.defaultAddressTitleCont}>
                                <Text style={[styles.title, { marginTop: 0, fontSize: 16, marginLeft: 10, }]}>Default Shipping Address</Text>
                            </View>

                            <View style={{ rowGap: 5, alignSelf: "flex-start", marginLeft: 10, }}>
                                <Text style={styles.defaultAddressText}>{default_shipping_address?.firstname} {default_shipping_address?.lastname}</Text>
                                <Text style={styles.defaultAddressText}>{default_shipping_address?.street}</Text>
                                <Text style={styles.defaultAddressText}>{default_shipping_address?.region?.region}, {default_shipping_address?.city}, {default_shipping_address?.postcode}</Text>
                                <Text style={styles.defaultAddressText}>{default_shipping_address?.country}</Text>
                                <Text style={styles.defaultAddressText}>{default_shipping_address?.telephone}</Text>
                            </View>

                            <View style={styles.defaultAddressTitleCont}>
                                <TouchableOpacity>
                                    <Text style={[styles.title, {
                                        marginTop: 0,
                                        fontSize: 16,
                                        marginLeft: 10,
                                        color: "#08c",
                                        textDecorationLine: "underline",
                                        paddingVertical: 10
                                    }]}>Change Shipping Address</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}

                        {/* Additional Entries */}
                        <Text style={[styles.title, { fontWeight: "500", marginTop: 20 }]}>Additional Address Entries</Text>

                        {Object.keys(user).length !== 0 &&
                            <>
                                {addresses.length !== 0 &&
                                    <FlatList
                                        data={addresses}
                                        scrollEnabled={false}
                                        contentContainerStyle={{ marginBottom: 30 }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={styles.listCont}>
                                                    <Text style={[styles.defaultAddressText, { fontWeight: "500", color: "black" }]}>Name:  <Text style={styles.defaultAddressText} >{item?.firstname} {item?.lastname}</Text></Text>
                                                    <Text style={[styles.defaultAddressText, { fontWeight: "500", color: "black" }]}>Street Address: <Text style={styles.defaultAddressText} >{item?.street[0]} {item?.street[1] == undefined ? "" : item?.street[1]}</Text> </Text>
                                                    <Text style={[styles.defaultAddressText, { fontWeight: "500", color: "black" }]}>City:  <Text style={styles.defaultAddressText} >{item?.city}</Text></Text>
                                                    <Text style={[styles.defaultAddressText, { fontWeight: "500", color: "black" }]}>Country:  <Text style={styles.defaultAddressText} >{item?.country}</Text></Text>
                                                    <Text style={[styles.defaultAddressText, { fontWeight: "500", color: "black" }]}>State:  <Text style={styles.defaultAddressText} >{item?.region?.region}</Text></Text>
                                                    <Text style={[styles.defaultAddressText, { fontWeight: "500", color: "black" }]}>Zip / Postal Code:  <Text style={styles.defaultAddressText} >{item?.postcode}</Text></Text>
                                                    <Text style={[styles.defaultAddressText, { fontWeight: "500", color: "black" }]}>Phone:  <Text style={styles.defaultAddressText} >{item?.telephone}</Text></Text>
                                                    <View style={{
                                                        // width: "100%",
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        alignSelf: "flex-end"
                                                    }}>
                                                        <TouchableOpacity>
                                                            <Text style={styles.editBtnTxt}>Edit</Text>
                                                        </TouchableOpacity>
                                                        <Text style={styles.defaultAddressText}> | </Text>
                                                        <TouchableOpacity
                                                            onPress={() => this.deleteAddress(index)}
                                                        >
                                                            <Text style={styles.deleteBtnTxt}>delete</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                }
                                {/* } */}
                            </>
                        }


                    </View>
                </ScrollView >

            </View >
        )
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(AddressBook);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
    innerContainer: {
        width: width - 20,
        // height: "100%",
        justifyContent: "center",

    },
    listCont: {
        width: width - 40,
        // height: 200,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 20,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    title: {
        fontWeight: "400",
        color: "black",
        fontSize: 18,
        marginTop: 30,
        alignItems: "flex-start",
    },
    defaultAddressCont: {
        width: width - 40,
        height: 200,
        alignSelf: "center",
        backgroundColor: "#f0f0f0",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,

    },
    defaultAddressTitleCont: {
        width: "100%",
        height: 40,
        backgroundColor: "#ddd",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    defaultAddressText: {
        color: "#666666",
        fontWeight: "400",
        fontSize: 14,
    },
    editBtnTxt: {
        color: "#08c",
        fontSize: 16,
        fontWeight: "600",
        padding: 5
    },
    deleteBtnTxt: {
        color: "red",
        fontSize: 16,
        fontWeight: "600",
        padding: 5
    }
})