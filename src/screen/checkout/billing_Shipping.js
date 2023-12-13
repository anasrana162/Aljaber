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

class Billing_Shipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addresses: [],
            addressEmpty: false,
            countries: [],
            selectedAddress: {},
            selectedAddressIndex: 0,
        };
    }

    componentDidMount = () => {
        this.checkAddress()
        this.getCountries()
    }

    getCountries = () => {

        api.get("aljaber/getallcountry").then((result) => {
            console.log("Get Country Api Result: ", result?.data)
            setImmediate(() => {
                this.setState({ countries: result?.data })
            })
        }).catch(err => {
            console.log("Get Country Api Error: ", err)
        })

    }

    checkAddress = () => {
        var { userData } = this.props
        console.log("Addresses:  ", userData?.user?.addresses)
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
                    <Text style={styles.itemText}>{item?.item?.street}</Text>
                    <Text style={styles.itemText}>{item?.item?.city}, {item?.item?.region?.region}</Text>
                    <Text style={styles.itemText}>{country?.country}</Text>
                    <Text style={[styles.itemText,{color:"#08c"}]}>{item?.item?.telephone}</Text>
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
                            horizontal={true}
                            renderItem={renderItem}
                        />

                        <TouchableOpacity style={styles.add_new_address_btn}>
                            <AntDesign name="plus" size={18} color="#848484" />
                            <Text style={styles.add_new_address_btn_text}>New Address</Text>
                        </TouchableOpacity>

                    </View>

                }
                {/* <Text>billing_Shipping</Text> */}
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
    header_comp: {
        width: width,
        justifyContent: "center",
        backgroundColor: "#020621",
        alignItems: "center",
        paddingTop: 0,
        paddingBottom: 10
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
    add_new_address_btn: {
        width: 150,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 0.5,
        marginTop: 30,
    },
    add_new_address_btn_text:{
        color: "#848484",
        fontWeight: "600",
        fontSize: 16,
        marginLeft:5,
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
        height: width / 2 - 20,
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