import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList, Platform } from 'react-native'
import React, { Component } from 'react'


{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';


const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT
const imageUrl = "https://aljaberoptical.com/media/catalog/product/"

import api from '../../api/api';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Add_NewAddress from './components/add_NewAddress_Modal';
import HeaderComp from '../../components_reusable/headerComp';
import CustomTextInp from '../checkout/components/CustomTextInp';
import TextInput_Dropdown from '../cart/components/textInput_Dropdown';

class Billing_Shipping_Guest extends Component {
    constructor(props) {
        super(props);
        var { userData: { countries } } = this.props
        this.state = {
            addresses: [],
            addressEmpty: false,
            country_id: null,
            countries: countries == undefined ? [] : countries,
            countryDDSelected: "",
            openCountryDD: false,
            country: null,
            province: null,
            // shipping: "free",
            // flatrate: 0,
            firstname: null,
            lastname: null,
            email: null,
            zipcode: null,
            phone: null,
            address: [],
            addressLine1: null,
            addressLine2: null,
            city: null,
            region: null,
            isShippingFree: false,
            orderSummaryOpen: false,
            shippingSelected: false,
            loadNext: false,
        };
    }


    onChangeText = (txt, key) => {
        switch (key) {
            case "email":
                setImmediate(() => {
                    this.setState({ email: txt });
                })
                break;
            case "firstname":
                setImmediate(() => {
                    this.setState({ firstname: txt });
                })
                break;
            case "lastname":
                setImmediate(() => {
                    this.setState({ lastname: txt });
                })
                break;
            case "phone":
                setImmediate(() => {
                    this.setState({ phone: txt });
                })
                break;
            case "country":
                setImmediate(() => {
                    this.setState({ country: txt });
                })
                break;
            case "province":
                setImmediate(() => {
                    this.setState({ province: txt });
                })
                break;
            case "addressLine1":
                setImmediate(() => {
                    this.setState({ addressLine1: txt });
                })
                break;
            case "addressLine2":
                setImmediate(() => {
                    this.setState({ addressLine2: txt });
                })
                break;
            case "city":
                setImmediate(() => {
                    this.setState({ city: txt });
                })
                break;
            case "zip_code":
                setImmediate(() => {
                    this.setState({ zipcode: txt });
                })
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


        var { subtotal } = this.props?.route?.params
        // console.log("Selected Address: ", item)


        switch (key) {
            case "country":
                if ((val?.country_id == "AE" || val?.country == "United Arab Emirates") && subtotal >= 150) {
                    this.setState({
                        isShippingFree: true
                    })
                } else {
                    this.setState({
                        isShippingFree: false
                    })
                }
                this.setState({
                    country: val?.country,
                    country_id: val?.country_id,
                    countryDDSelected: val,
                    shippingSelected: false,
                    openCountryDD: !this.state.openCountryDD
                })
        }
    }

    checkInputFeilds = () => {
        var { city, country_id, country, province, zipcode, phone, email, addressLine1, addressLine2, firstname, lastname, isShippingFre } = this.state
        if (email == null) {
            console.log("email");
            return true
        }
        if (firstname == null) {
            console.log("firstname");
            return true
        }
        if (lastname == null) {
            console.log("lastname");
            return true
        }
        if (phone == null) {
            console.log("phone");
            return true
        }
        if (addressLine1 == null) {
            console.log("addressLIne1");
            return true
        }
        if (country == null) {
            console.log("country");
            return true
        }
        if (country_id == null) {
            console.log("country_id");
            return true
        }
        if (province == null) {
            console.log("province");
            return true
        }
        if (zipcode == null) {
            console.log("zipcode");
            return true
        }
        if (city == null) {
            console.log("city");
            return true
        }

        return false
    }

    onNext = () => {


        let { userData: { token, guestcartkey, guestcartid } } = this.props
        var { city, country_id, country, province, zipcode, phone, email, addressLine1, addressLine2, firstname, lastname, isShippingFree } = this.state

        this.setState({ loadNext: true })

        if (this.state.shippingSelected == false) {
            this.setState({ loadNext: false })
            return alert("Please Select Shipping!")
        }

        const check = this.checkInputFeilds()

        if (check == true) {
            this.setState({ loadNext: false });
            return alert("Please fill all feilds!");
        }

        let obj = {
            "addressInformation": {
                "shipping_address": {
                    "region": province,
                    "region_id": 509,
                    "region_code": province,
                    "country_id": country_id,
                    "street": [addressLine1, addressLine2],
                    "postcode": zipcode,
                    "city": city,
                    "email": email,
                    "firstname": firstname,
                    "lastname": lastname,
                    "telephone": phone
                },
                "billing_address": {
                    "region": province,
                    "region_id": 509,
                    "region_code": province,
                    "country_id": country_id,
                    "street": [addressLine1, addressLine2],
                    "postcode": zipcode,
                    "city": city,
                    "email": email,
                    "firstname": firstname,
                    "lastname": lastname,
                    "telephone": phone
                },
                "shipping_carrier_code": isShippingFree == false ? "flatrate" : "freeshipping",
                "shipping_method_code": isShippingFree == false ? "flatrate" : "freeshipping"
            }
        }
        console.log("OBJ", obj)

        api.post("guest-carts/" + guestcartkey + "/shipping-information", obj)
            .then((res) => {

                console.log("fetch order data billing_shipping_guest:", res?.data);
                this.setState({ loadNext: false })

                this.props.navigation.navigate("Review_Payment_Guest", {
                    order_summary: res?.data,
                    billing_shipping_address: obj,
                    country: country,
                })

                // this.checkAddress()
            }).catch((err) => {
                this.setState({ loadNext: false })
                console.log("shipping information API ERR", err.response.data.message)
            })

    }

    render() {
        var { cartItems } = this.props.route?.params
        return (

            <View style={styles.mainContainer}>
                {/* Header */}
                <HeaderComp titleEN={"Shipping Address"} navProps={this.props.navigation} />
                <View style={styles.inner_main}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ marginBottom: 160 }} >

                        {/* Email */}
                        <CustomTextInp
                            // value={this.state.firstname}
                            titleEN={"Email *"}
                            onChangeText={(txt) => this.onChangeText(txt, "email")}
                            style={{ width: width - 180, alignSelf: "flex-start", marginTop: 20 }}
                        />

                        {/* First Name */}
                        <CustomTextInp
                            // value={this.state.firstname}
                            titleEN={" First Name*"}
                            onChangeText={(txt) => this.onChangeText(txt, "firstname")}
                            style={{ width: width - 180, alignSelf: "flex-start", marginTop: 20 }}
                        />

                        {/* Last Name */}
                        <CustomTextInp
                            // value={this.state.lastname}
                            titleEN={" Last Name*"}
                            onChangeText={(txt) => this.onChangeText(txt, "lastname")}
                            style={{ width: width - 180, alignSelf: "flex-start" }}
                        />

                        {/* Phone Number */}
                        <CustomTextInp
                            // value={this.state.phone}
                            titleEN={"Phone*"}
                            onChangeText={(txt) => this.onChangeText(txt, "phone")}
                            style={{ width: width - 180, alignSelf: "flex-start" }}
                        />

                        <Text style={styles.title}>Address</Text>

                        <Text style={[styles.title, { marginTop: 10, color: "black", alignSelf: "flex-start" }]}>Street Address*</Text>
                        {/* Street Address Line1 */}
                        <CustomTextInp
                            // value={this.state.street1}
                            titleEN={"Street Address: Line 1 *"}
                            onChangeText={(txt) => this.onChangeText(txt, "addressLine1")}
                            style={{ width: width - 60, alignSelf: "flex-start" }}
                        />

                        {/* Street Address Line2 */}
                        <CustomTextInp
                            // titleEN={"Street Address: Line 1 *"}
                            // value={this.state.street2}
                            // style={{  }}
                            onChangeText={(txt) => this.onChangeText(txt, "addressLine2")}
                            style={{ width: width - 60, alignSelf: "flex-start", marginTop: -3 }}
                        />

                        {/* Country */}
                        <TextInput_Dropdown
                            dataDropdown={this.state.countries}
                            titleEN={"Country *"}
                            titleAR={""}
                            type={"dropdown"}
                            defaultSelected={""}
                            purpose={"country"}
                            isModalOpen={this.state.openCountryDD}
                            openDropDown={() => this.openDropDowns("country")}
                            selectItem={(val) => this.selectItem(val, "country")}
                            style={{ width: width - 180, alignSelf: "flex-start" }}
                        />

                        {/* Province */}
                        <CustomTextInp
                            // value={this.state.province}
                            titleEN={"State / Province *"}
                            onChangeText={(txt) => this.onChangeText(txt, "province")}
                            style={{ width: width - 180, alignSelf: "flex-start" }}
                        />

                        {/* City */}
                        <CustomTextInp
                            // value={this.state.city}
                            titleEN={"City *"}
                            onChangeText={(txt) => this.onChangeText(txt, "city")}
                            style={{ width: width - 180, alignSelf: "flex-start" }}
                        />

                        {/* ZIP/POSTAL CODE */}
                        <CustomTextInp
                            // value={this.state.zipcode}
                            keyboardType={"numeric"}
                            titleEN={"Zip / Postal Code *"}
                            onChangeText={(txt) => this.onChangeText(txt, "zip_code")}
                            style={{ width: width - 180, alignSelf: "flex-start" }}
                        />

                        {/* Shipping Methods */}
                        <View style={styles.shipping_method_cont}>
                            {this.state.isShippingFree ?
                                <>

                                    {this.state.shippingSelected ?
                                        <>
                                            <TouchableOpacity
                                                style={{ paddingVertical: 10 }}
                                                // disabled={this.state.shippingSelected}
                                                onPress={() => this.setState({ shippingSelected: !this.state.shippingSelected })}>
                                                <AntDesign name="checkcircle" size={18} color="black" />
                                            </TouchableOpacity>
                                            <Text style={styles.ship_tax_text}>AED 0.00</Text>
                                            <Text style={[styles.ship_tax_text, { fontWeight: "500" }]}>Free Shipping</Text>
                                        </>
                                        :
                                        <>
                                            <TouchableOpacity
                                                style={{ paddingVertical: 10 }}
                                                // disabled={this.state.shippingSelected}
                                                onPress={() => this.setState({ shippingSelected: !this.state.shippingSelected })}>
                                                <Entypo name="circle" size={18} color="black" />
                                            </TouchableOpacity>
                                            <Text style={styles.ship_tax_text}>AED 0.00</Text>
                                            <Text style={[styles.ship_tax_text, { fontWeight: "500" }]}>Free Shipping</Text>
                                        </>
                                    }
                                </>
                                :
                                <>
                                    {this.state.shippingSelected ?
                                        <>
                                            <TouchableOpacity
                                                style={{ paddingVertical: 10 }}
                                                // disabled={this.state.shippingSelected}
                                                onPress={() => this.setState({ shippingSelected: !this.state.shippingSelected })}>
                                                <AntDesign name="checkcircle" size={18} color="black" />
                                            </TouchableOpacity>
                                            <Text style={styles.ship_tax_text}>AED 20.00</Text>
                                            <Text style={[styles.ship_tax_text, { fontWeight: "500" }]}>Flat Rate</Text>
                                            <Text style={[styles.ship_tax_text, { fontWeight: "500" }]}>Flat Rate</Text>
                                        </>
                                        :
                                        <>
                                            <TouchableOpacity
                                                style={{ paddingVertical: 10 }}
                                                // disabled={this.state.shippingSelected}
                                                onPress={() => this.setState({ shippingSelected: !this.state.shippingSelected })}>
                                                <Entypo name="circle" size={18} color="black" />
                                            </TouchableOpacity>
                                            <Text style={styles.ship_tax_text}>AED 20.00</Text>
                                            <Text style={[styles.ship_tax_text, { fontWeight: "500" }]}>Flat Rate</Text>
                                            <Text style={[styles.ship_tax_text, { fontWeight: "500" }]}>Flat Rate</Text>
                                        </>
                                    }
                                </>
                            }
                        </View>


                        {/* Next Button */}
                        <TouchableOpacity
                            onPress={() => this.onNext()}
                            style={styles.nextBtn}>
                            {this.state.loadNext ?
                                <ActivityIndicator size={"large"} color={"white"} />
                                :
                                <Text style={[styles.text_style, { color: "white", fontSize: 16 }]}>Next</Text>
                            }
                        </TouchableOpacity>

                    </ScrollView>
                </View>


                {/* Order Summary List */}

                <View style={[styles.order_summary_cont, {
                    height: this.state.orderSummaryOpen ?
                        height / 1.8
                        :
                        Platform.OS == "ios" ?
                            120
                            :
                            100,
                    justifyContent: this.state.orderSummaryOpen ? "flex-start" : "center",

                }]}>
                    <Text style={[styles.order_summary_title, {
                        marginTop: this.state.orderSummaryOpen ? 20 : 0,
                    }]}>Order Summary</Text>
                    <TouchableOpacity
                        onPress={() => this.setState({ orderSummaryOpen: !this.state.orderSummaryOpen })}
                        style={styles.order_summary_Btn}>

                        <Text style={styles.items_in_cart_text}>{cartItems?.length} Items in Cart</Text>
                        {this.state.orderSummaryOpen ?
                            <MaterialIcons name="arrow-drop-up" size={30} color="black" />
                            :
                            <MaterialIcons name="arrow-drop-down" size={30} color="black" />
                        }
                    </TouchableOpacity>

                    {this.state.orderSummaryOpen &&
                        <View style={styles.listCont}>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{ width: "100%" }}>

                                {cartItems.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.order_summary_item}>
                                            <Image
                                                source={{ uri: imageUrl + item?.image }}
                                                resizeMode='contain'
                                                style={{ width: 80, height: 60, marginHorizontal: 10, }}
                                            />

                                            <View style={styles.text_cont}>
                                                <Text style={[styles.text_style, { fontSize: 14 }]}>{item?.name}</Text>
                                                <View style={{
                                                    borderWidth: 1,
                                                    padding: 5,
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 10,
                                                    borderRadius: 20,
                                                }}>
                                                    <Text style={[styles.text_style, { fontSize: 13, fontWeight: "700", }]}>AED {item?.price}</Text>
                                                </View>
                                                {item?.product_option !== undefined &&

                                                    <>

                                                        {item?.product_option?.extension_attributes?.configurable_item_options !== undefined &&
                                                            item?.product_option?.extension_attributes?.configurable_item_options.map((data, index) => {
                                                                // console.log("configurable_item_options", data)
                                                                return (
                                                                    <>
                                                                        <View style={styles.option_cont}>
                                                                            <Text style={[styles.text_style, { fontSize: 12, fontWeight: "700", marginTop: 5 }]}>{data?.option_title}</Text>
                                                                            <Text style={[styles.text_style, { fontSize: 12, marginTop: 5 }]}>: {data?.option_value_name}</Text>
                                                                        </View>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                        {item?.product_option?.extension_attributes?.custom_options.map((data, index) => {
                                                            return (
                                                                <>
                                                                    <View style={styles.option_cont}>
                                                                        <Text style={[styles.text_style, { fontSize: 12, fontWeight: "700", marginTop: 5 }]}>{data?.option_title}</Text>
                                                                        <Text style={[styles.text_style, { fontSize: 12, marginTop: 5 }]}>: {data?.option_value_name}</Text>
                                                                    </View>
                                                                </>
                                                            )
                                                        })
                                                        }
                                                    </>
                                                }
                                            </View>


                                        </View>
                                    )
                                })}

                            </ScrollView>
                        </View>
                    }
                </View>

                {/* Order Summary Background to cancel */}
                {
                    this.state.orderSummaryOpen && <TouchableOpacity
                        onPress={() => this.setState({ orderSummaryOpen: !this.state.orderSummaryOpen })}
                        style={{
                            width: width,
                            height: height,
                            backgroundColor: 'rgba(52, 52, 52, 0.1)',
                            // opacity:0.2,
                            position: "absolute",

                        }}>

                    </TouchableOpacity>
                }
            </View>
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
        backgroundColor: "white"
    },
    inner_main: {
        width: width - 20,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    header_comp: {
        width: width,
        justifyContent: "center",
        backgroundColor: "#020621",
        alignItems: "center",
        paddingTop: 0,
        paddingBottom: 10,
        position: "absolute",
        top: 0,
        zIndex: 200,
    },

    header_comp_title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#ffffff"
    },
    nextBtn: {
        width: 80,
        height: 40,
        backgroundColor: "#08c",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 40,
        borderRadius: 5,
    },
    itemCont: {
        width: width / 2 - 20,
        height: width / 2 - 20,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 10,
    },
    itemText: {
        color: "#848484",
        fontWeight: "600",
        fontSize: 14
    },
    order_summary_title: {
        color: "black",
        fontWeight: "600",
        fontSize: 18,
        alignSelf: "flex-start",
        marginLeft: 20,
    },
    order_summary_item: {
        width: "100%",
        // height: 120,
        // borderWidth: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 10,
    },
    items_in_cart_text: {
        color: "black",
        fontWeight: "500",
        fontSize: 16,
    },
    text_cont: {
        width: "68%",
        // borderWidth:1,
        minHeight: 50,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start"
    },
    text_style: {
        fontSize: 20,
        fontWeight: "600",
        color: "#222529"
    },
    option_cont: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    listCont: {
        width: width - 40,
        height: height / 2.5,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#999",
        borderBottomWidth: 0.5,
        // borderLeftWidth: 0.5,
        // borderRightWidth: 0.5,
    },
    order_summary_cont: {
        width: width,
        zIndex: 100,
        backgroundColor: "white",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    order_summary_Btn: {
        width: "90%",
        height: 40,
        // borderWidth:1,
        borderColor: "#999",
        borderBottomWidth: 0.5,
        // marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    shipping_method_title: {
        color: "black",
        fontWeight: "600",
        fontSize: 16,
        marginTop: 40,
    },
    shipping_method_cont: {
        width: "95%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 15,
    },
    ship_tax_text: {
        fontSize: 16,
        fontWeight: "700",
        color: "#313131"
    },
    add_new_address_btn: {
        width: 150,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 0.5,
        marginTop: 30,
    },
    add_new_address_btn_text: {
        color: "#848484",
        fontWeight: "600",
        fontSize: 16,
        marginLeft: 5,
    },
    redBox: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
        position: "absolute",
        top: 0,
        right: 0
    },
    flatlistCont: {
        marginTop: 0,
        width: width - 20,
        // height: width / 2 - 20,
        // flexWrap:"wrap",
        // borderWidth: 1,
        justifyContent: "space-between"
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

export default connect(mapStateToProps, mapDispatchToProps)(Billing_Shipping_Guest);