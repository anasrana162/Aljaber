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
            zipcode: propAddress?.zipcode,
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
            case "zipcode":
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
                            onChangeText={(txt) => onChangeText(txt, "street_address_line1")}
                        />

                        {/* Street Address Line2 */}
                        <CustomTextInp
                            // titleEN={"Street Address: Line 1 *"}
                            value={this.state.street2}
                            style={{ marginTop: -3 }}
                            onChangeText={(txt) => onChangeText(txt, "street_address_line2")}
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
                            onChangeText={(txt) => onChangeText(txt, "city")}
                        />

                        {/* ZIP/POSTAL CODE */}
                        <CustomTextInp
                            value={this.state.zipcode}
                            titleEN={"Zip / Postal Code *"}
                            onChangeText={(txt) => onChangeText(txt, "zip_code")}
                        />

                        {/* use as default billing */}
                        <View style={{ flexDirection: 'row', alignItems: "center", alignSelf: "flex-end", marginRight: 15 }}>
                            {
                                user?.default_billing == propAddress?.id ?

                                    <View
                                        style={{ padding: 5 }}>
                                        <AntDesign name="warning" size={24} color="black" />
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
                            <Text style={styles.checkboxText}>Use as my default billing address</Text>
                        </View>

                        {/* use as default shipping */}
                        <View style={{ flexDirection: 'row', alignItems: "center", alignSelf: "flex-end", }}>
                            {
                                user?.default_shipping == propAddress?.id ?

                                    <View
                                        style={{ padding: 5 }}>
                                        <AntDesign name="warning" size={24} color="black" />
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
                            <Text style={styles.checkboxText}>Use as my default shipping address</Text>
                        </View>

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
        fontWeight: "400",
        color: "black",
        fontSize: 14,
    },
})