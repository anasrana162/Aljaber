import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'

import api, { custom_api_url, basis_auth } from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components_reusable/loading';
import HeaderComp from '../../components_reusable/headerComp';
import CustomTextInp from '../checkout/components/CustomTextInp';
import TextInput_Dropdown from '../cart/components/textInput_Dropdown';
import AntDesign from "react-native-vector-icons/AntDesign"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class EditAddress extends Component {
    constructor(props) {
        super(props)
        var { propAddress } = this.props?.route.params
        this.state = {
            province: propAddress?.region?.region,
            country: propAddress?.country,
            countryDDSelected: "",
            openCountryDD: false,
            firstname: propAddress?.firstname,
            lastname: propAddress?.lastname,
            phone: propAddress?.telephone,
            street1: propAddress?.street[0],
            street2: propAddress?.street[1] == undefined ? "" : propAddress?.street[1],
            city: propAddress?.city,
            zipcode: propAddress?.postcode,
            shippingChecked: false,
            billingChecked: false,
        }
    }

    onChangeText = (txt, key) => {
        switch (key) {
            case "firstname":
                this.setState({ firstname: txt });
                break;
            case "lastname":
                this.setState({ lastname: txt });
                break;
            case "phone":
                this.setState({ phone: txt });
                break;
            case "country":
                this.setState({ country: txt });
                break;
            case "province":
                this.setState({ province: txt });
                break;
            case "street1":
                this.setState({ street1: txt });
                break;
            case "street2":
                this.setState({ street2: txt });
                break;
            case "city":
                this.setState({ city: txt });
                break;
            case "zip_code":
                this.setState({ zipcode: txt });
                break;
        }
    }

    openDropDowns = (key) => {
        switch (key) {
            case "country":
                this.setState({ openCountryDD: !this.state.openCountryDD })
                break;
        }
    }

    selectItem = (val, key) => {
        console.log("country selected", val);
        switch (key) {
            case "country":
                this.setState({
                    country: val?.country,
                    countryDDSelected: val,
                    openCountryDD: !this.state.openCountryDD
                })
        }
    }

    onSaveAddress = () => {
        var { userData: { countries, user: { addresses, id, default_billing, default_shipping }, admintoken }, route: { params: { propAddress, addressIndex } } } = this.props
        var { firstname, lastname, email, street1, street2, phone, countryDDSelected, province, city, zipcode, billingChecked, shippingChecked } = this.state
        var tempAddress = addresses

        this.setState({
            loader: true
        })

        for (let i = 0; i < tempAddress?.length; i++) {
            delete tempAddress[i].country
        }

        tempAddress[addressIndex].firstname = firstname;
        tempAddress[addressIndex].lastname = lastname;
        tempAddress[addressIndex].telephone = phone;
        tempAddress[addressIndex].street[0] = street1;
        // tempAddress[addressIndex].street[1] !== undefined ? null : street2 == '' ? undefined : street2,
        if (tempAddress[addressIndex].street[1] !== undefined) {

            tempAddress[addressIndex].street[1] = street2 == '' ? tempAddress[addressIndex].street[1] : street2;
            // }else{
        } else {
            tempAddress[addressIndex].street[1] = street2 == '' ? undefined : street2;
        }
        tempAddress[addressIndex].region.region_code = province,
            tempAddress[addressIndex].region.region = province,
            tempAddress[addressIndex].country_id = countryDDSelected == "" ? tempAddress[addressIndex].country_id : countryDDSelected?.country_id,
            tempAddress[addressIndex].city = city
        tempAddress[addressIndex].postcode = zipcode

        console.log("addresses", addresses);
        // console.log("default_billing propAddress?.id ", propAddress?.id ,"     default_billing  ",default_billing);
        // console.log("default_shipping propAddress?.id", propAddress?.id,'      default_shipping ',default_shipping);

        // "default_billing": billingChecked ? propAddress?.id : default_billing,
        // "default_shipping": shippingChecked ? propAddress?.id : default_shipping,

        let final_obj = {
            "customer": {
                "addresses": tempAddress
            }
        }

        console.log("final_obj", final_obj);

        api.put("customers/" + id,
            final_obj,
            {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            }
        ).then((res) => {
            console.log("Res customer profile update API Edit Addess Screen:", res?.data)
            this.loginUser()

        }).catch((err) => {
            console.log("Err customer profile update API Edit Addess Screen", err.response)
        })
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
                            this.setState({
                                loader: false
                            })

                            alert("Address Saved!")
                        }
                    }).catch((err) => {
                        alert("Network Error Code: (cd1)")
                        console.log("customer data Api error HOme: ", err)

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

    render() {

        var { userData: { user, countries } } = this.props
        var { propAddress } = this.props?.route.params
        // console.log("propAddress",propAddress);

        return (
            <View style={styles.mainContainer}>

                <HeaderComp navProps={this.props.navigation} titleEN={"Edit Address"} />
                <ScrollView>
                    <View style={styles.innerMain}>

                        <Text style={styles.title}>Contact Information</Text>

                        {/* First Name */}
                        <CustomTextInp
                            value={this.state.firstname}
                            titleEN={"First Name*"}
                            onChangeText={(txt) => this.onChangeText(txt, "firstname")}
                        />

                        {/* Last Name */}
                        <CustomTextInp
                            value={this.state.lastname}
                            titleEN={"Last Name*"}
                            onChangeText={(txt) => this.onChangeText(txt, "lastname")}
                        />

                        {/* Phone Number */}
                        <CustomTextInp
                            value={this.state.phone}
                            titleEN={"Phone*"}
                            onChangeText={(txt) => this.onChangeText(txt, "phone")}
                        />

                        <Text style={styles.title}>Address</Text>

                        <Text style={[styles.title, { marginTop: 10, color: "black", alignSelf: "flex-start" }]}>Street Address*</Text>
                        {/* Street Address Line1 */}
                        <CustomTextInp
                            value={this.state.street1}
                            titleEN={"Street Address: Line 1 *"}
                            onChangeText={(txt) => this.onChangeText(txt, "street1")}
                        />

                        {/* Street Address Line2 */}
                        <CustomTextInp
                            // titleEN={"Street Address: Line 1 *"}
                            value={this.state.street2}
                            style={{ marginTop: -3 }}
                            onChangeText={(txt) => this.onChangeText(txt, "street2")}
                        />

                        {/* Country */}
                        <TextInput_Dropdown
                            dataDropdown={countries}
                            titleEN={"Country *"}
                            titleAR={""}
                            type={"dropdown"}
                            defaultSelected={this.state.country}
                            purpose={"country"}
                            isModalOpen={this.state.openCountryDD}
                            openDropDown={() => this.openDropDowns("country")}
                            selectItem={(val) => this.selectItem(val, "country")}
                        />

                        {/* Province */}
                        <CustomTextInp
                            value={this.state.province}
                            titleEN={"State / Province *"}
                            onChangeText={(txt) => this.onChangeText(txt, "province")}
                        />

                        {/* City */}
                        <CustomTextInp
                            value={this.state.city}
                            titleEN={"City *"}
                            onChangeText={(txt) => this.onChangeText(txt, "city")}
                        />

                        {/* ZIP/POSTAL CODE */}
                        <CustomTextInp
                            value={this.state.zipcode}
                            keyboardType={"numeric"}
                            titleEN={"Zip / Postal Code *"}
                            onChangeText={(txt) => this.onChangeText(txt, "zip_code")}
                        />


                        {/* it is a default billing */}
                        {user?.default_billing == propAddress?.id && <View style={{
                            flexDirection: 'row', alignItems: "center", alignSelf: "flex-end",
                            paddingHorizontal: 18,
                            // backgroundColor: user?.default_shipping == propAddress?.id ? "#6f4400" : "white",
                            marginBottom: 10,
                            marginTop: 10,
                        }}>
                            <View
                                style={{ padding: 5 }}>
                                <AntDesign name="warning" size={24} color={"#c07600"} />
                            </View>
                            <Text style={[styles.checkboxText, {
                                color: "#c07600"
                            }]}>it's a default billing address</Text>
                        </View>}

                        {/* use as default shipping */}
                        {user?.default_shipping == propAddress?.id && <View style={{
                            flexDirection: 'row', alignItems: "center", alignSelf: "flex-end",
                            paddingHorizontal: 10,
                            // backgroundColor: user?.default_shipping == propAddress?.id ? "#6f4400" : "white",
                            marginBottom: 20,
                        }}>

                            <View
                                style={{ padding: 5 }}>
                                <AntDesign name="warning" size={24} color={"#c07600"} />
                            </View>


                            <Text style={[styles.checkboxText, {
                                color: "#c07600"
                            }]}> its's a default shipping address</Text>
                        </View>}


                        {/* use as default billing */}
                        {/* <View style={{
                            flexDirection: 'row', alignItems: "center", alignSelf: "flex-end",
                            paddingHorizontal: 18,
                            // backgroundColor: user?.default_shipping == propAddress?.id ? "#6f4400" : "white",
                            marginBottom: 10,
                            marginTop: 10,
                        }}>
                            {
                                user?.default_billing == propAddress?.id ?

                                    <View
                                        style={{ padding: 5 }}>
                                        <AntDesign name="warning" size={24} color={user?.default_billing == propAddress?.id ? "#c07600" : "black"} />
                                    </View>

                                    :
                                    <>
                                        {this.state.billingChecked ?
                                            <TouchableOpacity
                                                onPress={() => this.setState({ billingChecked: !this.state.billingChecked })}
                                                style={{ padding: 5 }}>
                                                <AntDesign name="checksquare" size={24} color="black" />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => this.setState({ billingChecked: !this.state.billingChecked })}
                                                style={{ padding: 5 }}>
                                                <FontAwesome5 name="square" size={24} color="black" />
                                            </TouchableOpacity>
                                        }
                                    </>
                            }
                            <Text style={[styles.checkboxText, {
                                color: user?.default_billing == propAddress?.id ? "#c07600" : "black"
                            }]}>{user?.default_billing == propAddress?.id ? "it's a default billing address" : "Use as my default billing address"}</Text>
                        </View> */}

                        {/* use as default shipping */}
                        {/* <View style={{
                            flexDirection: 'row', alignItems: "center", alignSelf: "flex-end",
                            paddingHorizontal: 10,
                            // backgroundColor: user?.default_shipping == propAddress?.id ? "#6f4400" : "white",
                            marginBottom: 20,
                        }}>
                            {
                                user?.default_shipping == propAddress?.id ?

                                    <View
                                        style={{ padding: 5 }}>
                                        <AntDesign name="warning" size={24} color={user?.default_shipping == propAddress?.id ? "#c07600" : "black"} />
                                    </View>

                                    :
                                    <>
                                        {this.state.shippingChecked ?
                                            <TouchableOpacity
                                                onPress={() => this.setState({ shippingChecked: !this.state.shippingChecked })}
                                                style={{ padding: 5 }}>
                                                <AntDesign name="checksquare" size={24} color="black" />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                onPress={() => this.setState({ shippingChecked: !this.state.shippingChecked })}
                                                style={{ padding: 5 }}>
                                                <FontAwesome5 name="square" size={24} color="black" />
                                            </TouchableOpacity>
                                        }
                                    </>
                            }
                            <Text style={[styles.checkboxText, {
                                color: user?.default_shipping == propAddress?.id ? "#c07600" : "black"
                            }]}>{user?.default_shipping == propAddress?.id ? "its's a default shipping address" : "Use as my default shipping address"}</Text>
                      </View> */}

                        <TouchableOpacity style={{
                            width: 140,
                            height: 45,
                            backgroundColor: "#08c",
                            marginBottom: 50,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                            onPress={() => this.onSaveAddress()}
                        >
                            <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>Save address</Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAddress);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
    innerMain: {
        width: width - 40,
        alignItems: "center"
    },
    title: {
        fontWeight: "500",
        color: "#08c",
        fontSize: 18,
        marginTop: 30,
        alignItems: "flex-start",
    },
    checkboxText: {
        fontWeight: "500",
        color: "black",
        fontSize: 14,
    },
})