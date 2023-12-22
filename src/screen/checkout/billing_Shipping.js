import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'


{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';


const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

import api from '../../api/api';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Add_NewAddress from './components/add_NewAddress_Modal';

class Billing_Shipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: [],
            addressEmpty: false,
            countries: [],
            countrySelected: '',
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
        console.log("Addresses:  ", userData?.user?.addresses)
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

    selectAddress = (item, index) => {
        this.setState({
            selectedAddress: item,
            selectedAddressIndex: index
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

        var { addresses, address, addressLine1, addressLine2, firstName, lastName, city, countrySelected, provinceSelected, zipCode, phone, region } = this.state

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

        // console.log("userData", user)
        let obj = {
            "addressInformation": {
                "shipping_address": {
                    "region": region == "" ? provinceSelected?.title : region,
                    "region_id": 0,
                    "region_code": region == "" ? provinceSelected?.title : region,
                    "country_id": countrySelected?.country_id,
                    "street": address,
                    "postcode": zipCode,
                    "city": city,
                    "email": user?.email,
                    "firstname": user?.firstname,
                    "lastname": user?.lastname,
                    "telephone": phone
                },
                "billing_address": {
                    "region": region == "" ? provinceSelected?.title : region,
                    "region_id": 0,
                    "region_code": region == "" ? provinceSelected?.title : region,
                    "country_id": countrySelected?.country_id,
                    "street": address,
                    "postcode": zipCode,
                    "city": city,
                    "email": user?.email,
                    "firstname": user?.firstname,
                    "lastname": user?.lastname,
                    "telephone": phone
                },
                "shipping_carrier_code": "flatrate",
                "shipping_method_code": "flatrate"
            }
        }
        console.log("Customer Token", token)
        console.log("obj created", obj)

        api.post("carts/mine/shipping-information", obj,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {

                console.log("res", res?.data)
                // Adding added address to state to show in list

                // this.checkAddress()
            })

    }


    render() {

        const renderItem = (item) => {
            // console.log("Item", item)
            var country = this.state.countries.filter((data) => data?.country_id == item?.item?.country_id)[0]
            // console.log("COuntry", country)
            return (
                <TouchableOpacity
                    onPress={() => this.selectAddress(item?.item, item?.index)}
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

                <View style={styles.header_comp}>
                    <Text style={styles.header_comp_title}>Shipping Address</Text>
                </View>

                {this.state.addressEmpty == true ?
                    <>

                    </>

                    :

                    <View style={{ justifyContent: "flex-start", alignItems: "flex-start", width: width - 20 }}>

                        <FlatList
                            data={this.state.addresses}
                            contentContainerStyle={styles.flatlistCont}
                            // horizontal={true}
                            numColumns={2}
                            renderItem={renderItem}
                        />

                        {this.state.addressAdded == false &&
                            <TouchableOpacity
                                onPress={() => this.openNewAddressModal()}
                                style={styles.add_new_address_btn}>
                                <AntDesign name="plus" size={18} color="#848484" />
                                <Text style={styles.add_new_address_btn_text}>New Address</Text>
                            </TouchableOpacity>}

                        <Text style={styles.shipping_method_title}>SHIPPING METHODS* (PLEASE SELECT)</Text>

                    </View>

                }
                <Add_NewAddress
                    props={this.props}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    street1={this.state.addressLine1}
                    street2={this.state.addressLine2}
                    city={this.state.city}
                    region={this.state.region}
                    country={this.state.countrySelected}
                    telephone={this.state.phone}
                    zipCode={this.state.zipCode}
                    openModal={this.state.newAddressModal}
                    closeModal={() => this.openNewAddressModal()}
                    provinces={this.state.provinces}
                    countries={this.state.countries}
                    selectItem={(val, key) => this.itemSelected(val, key)}
                    addNewAddress={() => this.addNewAddress()}
                    onChangeText={(val, key) => this.onChangeText(val, key)}
                    check={this.state.saveToAddressBook}
                    addressToEdit={this.state.addressToEdit}
                    onPressCheck={() => this.setState({ saveToAddressBook: !this.state.saveToAddressBook })}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
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
        top: 0
    },

    header_comp_title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#ffffff"
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
    shipping_method_title: {
        color: "black",
        fontWeight: "600",
        fontSize: 16,
        marginTop: 20,
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