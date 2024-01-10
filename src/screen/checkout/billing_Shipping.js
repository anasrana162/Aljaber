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

class Billing_Shipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: [],
            addressEmpty: false,
            countries: [],
            countrySelected: '',
            countryParams: "",
            provinces: [],
            provinceSelected: "",
            selectedAddress: {},
            selectedAddressIndex: 0,
            // shipping: "free",
            // flatrate: 0,
            newAddressModal: false,
            firstName: this.props.userData?.user?.firstname,
            lastName: this.props.userData?.user?.lastname,
            zipCode: "",
            phone: "",
            address: [],
            addressLine1: "",
            addressLine2: "",
            city: "",
            region: "",
            saveToAddressBook: false,
            addressAdded: false,
            addressToEdit: '',
            isShippingFree: false,
            orderSummaryOpen: false,
            shippingSelected: false,
            selectFirstTimeAddress: true,
            loadNext: false,
        };
    }

    componentDidMount = () => {
        this.checkAddress()
        this.getCountries()
    }

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
    itemSelected = (val, key) => {
        switch (key) {
            case "country":
                console.log("Vale Selected Country:  ", val)
                if (val?.country_id == "AE") {
                    this.setState({
                        countrySelected: val,
                    })

                } else {

                    this.setState({
                        countrySelected: val,
                    })
                }
                this.getProvinces(val)
                break;
            case "province":
                console.log("Vale Selected Province:  ", val)
                this.setState({
                    provinceSelected: val,
                    // shipping_tax_key: this.state.shipping_tax_key + 1,
                })
                break;
        }
    }
    getProvinces = (val) => {

        api.get("aljaber/getallregionbycid?country_id=" + val?.country_id).then((result) => {
            console.log("Get Provinces Api Result: ", result?.data)
            setImmediate(() => {
                this.setState({ provinces: result?.data })
            })
        }).catch(err => {
            console.log("Get Provinces Api Error: ", err)
        })
    }

    checkAddress = () => {
        var { userData } = this.props
        // console.log("Addresses:  ", userData?.user?.addresses)
        // console.log("Addresses:  ", userData?.cartitems)
        if (userData?.user?.addresses?.length == 0) {
            setImmediate(() => {
                this.setState({
                    addressEmpty: true,
                })
            })
        } else {
            setImmediate(() => {
                this.setState({
                    addressEmpty: false,
                    addresses: userData?.user?.addresses,
                })
            })
        }
    }

    selectAddress = (item, index, country) => {
        var { subtotal } = this.props?.route?.params
        // console.log("Selected Address: ", item)
        if ((item?.country_id == "AE" || country == "United Arab Emirates") && subtotal >= 150) {
            this.setState({
                isShippingFree: true
            })
        } else {
            this.setState({
                isShippingFree: false
            })
        }
        this.setState({
            selectedAddress: item,
            selectedAddressIndex: index,
            shippingSelected: false,
            countryParams: country
        })
    }

    addNewAddress = () => {

        var { addresses, address, addressLine1, addressLine2, firstName, lastName, city, countrySelected, provinceSelected, zipCode, phone, region } = this.state
        var { userData: { user, admintoken, token } } = this.props
        if (addressLine1 !== "") {
            address.push(addressLine1)
        }
        if (addressLine2 !== "") {
            address.push(addressLine2)
        }
        setImmediate(() => {
            this.setState({
                address
            })
        })
        console.log("countrySelected", countrySelected)
        console.log("provinceSelected", provinceSelected)

        if (firstName == "") {
            return alert("Enter Your First Name!")
        }
        if (lastName == "") {
            return alert("Enter Your First Name!")
        }
        if (city == "") {
            return alert("Enter your city!")
        }
        if (city == "") {
            return alert("Enter your city!")
        }
        if (address.length == 0) {
            return alert("Enter your Address!")
        }
        if (countrySelected == "") {
            return alert("Select your country!")
        }
        if (provinceSelected == "" && region == "") {
            return alert("Select your State/Province!")
        }

        if (this.state.saveToAddressBook == true) {

            let obj = {
                "defaultShipping": true,
                "defaultBilling": true,
                "firstname": firstName,
                "lastname": lastName,
                "region": {
                    "regionCode": countrySelected?.country_id,
                    "region": region == "" ? provinceSelected?.title : region,
                    "regionId": 0
                },
                "postcode": zipCode,
                "street": address,
                "city": city,
                "telephone": phone,
                "countryId": countrySelected?.country_id

            }
            let temp_arr = []
            temp_arr.push(obj)

            var all_addresses = [...user?.addresses, ...temp_arr]
            let final_obj = {
                "customer": {
                    "addresses": all_addresses
                }
            }

            console.log("Addres to add in address Book", all_addresses)

            api.put("customers/" + user?.id,
                final_obj,
                {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                }
            ).then((res) => {
                console.log("Res customer profile update API (Save to address Book):", res?.data)
                let obj = {
                    "city": city,
                    "country_id": countrySelected?.country_id,
                    "status": "added",
                    "firstname": firstName,
                    "lastname": lastName,
                    "region": {
                        "region": region == "" ? provinceSelected?.title : region,
                    },
                    "street": address,
                    "telephone": phone
                }
                addresses.push(obj)
                setImmediate(() => {
                    this.setState({
                        addresses
                    })
                })
            }).catch((err) => {
                console.log("Err customer profile update API (Save to address Book)", err?.response)
            })




        } else {
            let obj = {
                "city": city,
                "country_id": countrySelected?.country_id,
                "status": "added",
                "firstname": firstName,
                "lastname": lastName,
                "region": {
                    "region": region == "" ? provinceSelected?.title : region,
                },
                "street": address,
                "telephone": phone
            }
            addresses.push(obj)
            setImmediate(() => {
                this.setState({
                    addresses,
                    addressAdded: true
                })
            })
        }


    }
    onChangeText = (val, key) => {
        // console.log("val,   Key", val, key)
        switch (key) {
            case "first_name":
                setImmediate(() => {
                    this.setState({
                        firstName: val
                    })
                })
                break;
            case "last_name":
                setImmediate(() => {
                    this.setState({
                        lastName: val
                    })
                })
                break;
            case "city":
                setImmediate(() => {
                    this.setState({
                        city: val
                    })
                })
                break;
            case "street_address_line1":
                setImmediate(() => {
                    this.setState({
                        addressLine1: val
                    })
                })
                break;
            case "street_address_line2":
                setImmediate(() => {
                    this.setState({
                        addressLine2: val
                    })
                })
                break;
            case "zip_code":
                setImmediate(() => {
                    this.setState({
                        zipCode: val
                    })
                })
                break;
            case "phone":
                setImmediate(() => {
                    this.setState({
                        phone: val
                    })
                })
                break;
            case "region":
                setImmediate(() => {
                    this.setState({
                        region: val
                    })
                })
                break;
        }
    }

    openNewAddressModal = () => {
        this.setState({
            newAddressModal: !this.state.newAddressModal
        })
    }

    onEditAddress = (item, country) => {
        this.setState({
            newAddressModal: !this.state.newAddressModal,
            firstName: item?.item?.firstname,
            lastName: item?.item?.lastname,
            addressLine1: item?.item?.street[0],
            addressLine2: item?.item?.street[1] == undefined ? "" : item?.item?.street[1],
            city: item?.item?.city,
            region: item?.item?.region?.region,
            countrySelected: country,
            phone: item?.item?.telephone,
        })
    }


    onNext = () => {


        let { userData: { user, token } } = this.props
        var { selectedAddress, selectedAddress: { city, country_id, region, region_code, region_id, postcode, telephone, street }, isShippingFree } = this.state

        this.setState({ loadNext: true })

        if (this.state.shippingSelected == false) {
            this.setState({ loadNext: false })
            return alert("Please Select Shipping!")
        }


        console.log("selectedAddress", selectedAddress)
        let obj = {
            "addressInformation": {
                "shipping_address": {
                    "region": region?.region,
                    "region_id": region_id,
                    "region_code": region?.region_code,
                    "country_id": country_id,
                    "street": street,
                    "postcode": postcode,
                    "city": city,
                    "email": user?.email,
                    "firstname": user?.firstname,
                    "lastname": user?.lastname,
                    "telephone": telephone
                },
                "billing_address": {
                    "region": region?.region,
                    "region_id": region_id,
                    "region_code": region?.region_code,
                    "country_id": country_id,
                    "street": street,
                    "postcode": postcode,
                    "city": city,
                    "email": user?.email,
                    "firstname": user?.firstname,
                    "lastname": user?.lastname,
                    "telephone": telephone
                },
                "shipping_carrier_code": isShippingFree == false ? "flatrate" : "freeshipping",
                "shipping_method_code": isShippingFree == false ? "flatrate" : "freeshipping"
            }
        }
        // console.log("Customer Token", token)

        api.post("carts/mine/shipping-information", obj,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {

                console.log("res shipping information API", this.state.countryParams)
                this.setState({ loadNext: false })

                this.props.navigation.navigate("Review_Payment", {
                    order_summary: res?.data,
                    billing_shipping_address: obj,
                    country: this.state.countryParams,
                })

                // this.checkAddress()
            }).catch((err) => {
                this.setState({ loadNext: false })
                console.log("shipping information API ERR", err)
            })

    }


    render() {

        var { cartItems } = this.props.route?.params
        var { orderSummaryOpen, firstName, lastName, addressLine1, addressLine2, city, region, countrySelected, phone, zipCode, newAddressModal, provinces, countries } = this.state

        const renderItem = (item) => {
            // console.log("Item", item?.index)
            var country = this.state.countries.filter((data) => data?.country_id == item?.item?.country_id)[0]
            if (item?.index == 0 && this.state.selectFirstTimeAddress == true && country != undefined) {
                this.setState({ selectFirstTimeAddress: false, })
                this.selectAddress(item?.item, item?.index, country?.country)
            }
            return (
                <TouchableOpacity
                    onPress={() => this.selectAddress(item?.item, item?.index, country?.country)}
                    style={[styles.itemCont, {
                        borderColor: this.state.selectedAddressIndex == item?.index ? "red" : null,
                        borderWidth: this.state.selectedAddressIndex == item?.index ? 1 : 0,
                    }]}>
                    {this.state.selectedAddressIndex == item?.index && <View style={styles.redBox}>
                        <AntDesign name="check" size={24} color="white" />
                    </View>}
                    <Text style={styles.itemText}>{item?.item?.firstname} {item?.item?.lastname}</Text>
                    <Text style={styles.itemText}>{item?.item?.street[0]}</Text>
                    <Text style={styles.itemText}>{item?.item?.city}, {item?.item?.region?.region}</Text>
                    <Text style={styles.itemText}>{country?.country}</Text>
                    <Text style={[styles.itemText, { color: "#08c" }]}>{item?.item?.telephone}</Text>
                    {item?.item?.status == undefined ?
                        <></>
                        :
                        <TouchableOpacity onPress={() => this.onEditAddress(item, country)} style={{ padding: 5, }}>
                            <Text style={[styles.itemText, { color: "#08c", marginTop: 10 }]}>Edit</Text>
                        </TouchableOpacity>
                    }
                </TouchableOpacity>
            )
        }

        return (

            <View style={styles.mainContainer}>
                {/* Header */}
                <View style={styles.header_comp}>
                    {/* Title */}
                    <Text style={styles.header_comp_title}>Shipping Address</Text>
                </View>
                <ScrollView 
                showsVerticalScrollIndicator={true}
                style={{marginBottom:100}} >


                    {this.state.addressEmpty == true ?
                        <>

                        </>

                        :

                        <View style={{ justifyContent: "flex-start", alignItems: "flex-start", width: width - 20, marginTop: 30, }}>

                            {/* Addresses To Select */}
                            <FlatList
                                data={this.state.addresses}
                                contentContainerStyle={styles.flatlistCont}
                                // horizontal={true}
                                scrollEnabled={false}
                                numColumns={2}
                                renderItem={renderItem}
                            />

                            {/* Add New Address Button */}
                            {this.state.addressAdded == false &&
                                <TouchableOpacity
                                    onPress={() => this.openNewAddressModal()}
                                    style={styles.add_new_address_btn}>
                                    <AntDesign name="plus" size={18} color="#848484" />
                                    <Text style={styles.add_new_address_btn_text}>New Address</Text>
                                </TouchableOpacity>}

                            {/* Shipping Method Title */}
                            <Text style={styles.shipping_method_title}>SHIPPING METHODS* (PLEASE SELECT)</Text>

                            {/* Shipping Methods */}
                            <View style={styles.shipping_method_cont}>
                                {this.state.isShippingFree ?
                                    <>

                                        {this.state.shippingSelected ?
                                            <>
                                                <TouchableOpacity
                                                    style={{ paddingVertical: 10 }}
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


                        </View>
                    }
                </ScrollView>

                {/* Order Summary List */}

                <View style={[styles.order_summary_cont, {
                    height: orderSummaryOpen ?
                        height / 1.8
                        :
                        Platform.OS == "ios" ?
                            120
                            :
                            100,
                    justifyContent: orderSummaryOpen ? "flex-start" : "center",

                }]}>
                    <Text style={[styles.order_summary_title, {
                        marginTop: orderSummaryOpen ? 20 : 0,
                    }]}>Order Summary</Text>
                    <TouchableOpacity
                        onPress={() => this.setState({ orderSummaryOpen: !orderSummaryOpen })}
                        style={styles.order_summary_Btn}>

                        <Text style={styles.items_in_cart_text}>{cartItems?.length} Items in Cart</Text>
                        {orderSummaryOpen ?
                            <MaterialIcons name="arrow-drop-up" size={30} color="black" />
                            :
                            <MaterialIcons name="arrow-drop-down" size={30} color="black" />
                        }
                    </TouchableOpacity>
                    {orderSummaryOpen &&
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
                    orderSummaryOpen && <TouchableOpacity
                        onPress={() => this.setState({ orderSummaryOpen: !orderSummaryOpen })}
                        style={{
                            width: width,
                            height: height,
                            backgroundColor: 'rgba(52, 52, 52, 0.1)',
                            // opacity:0.2,
                            position: "absolute",

                        }}>

                    </TouchableOpacity>
                }

                {/* Add New Address Modal */}
                <Add_NewAddress
                    props={this.props}
                    firstName={firstName}
                    lastName={lastName}
                    street1={addressLine1}
                    street2={addressLine2}
                    city={city}
                    region={region}
                    country={countrySelected}
                    telephone={phone}
                    zipCode={zipCode}
                    openModal={newAddressModal}
                    closeModal={() => this.openNewAddressModal()}
                    provinces={provinces}
                    countries={countries}
                    selectItem={(val, key) => this.itemSelected(val, key)}
                    addNewAddress={() => this.addNewAddress()}
                    onChangeText={(val, key) => this.onChangeText(val, key)}
                    check={this.state.saveToAddressBook}
                    addressToEdit={this.state.addressToEdit}
                    onPressCheck={() => this.setState({ saveToAddressBook: !this.state.saveToAddressBook })}
                />

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
        backgroundColor: "white"
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
        zIndex:200,
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
        marginTop: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(Billing_Shipping);