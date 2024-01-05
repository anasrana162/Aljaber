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

class Review_Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPaymentMethodSelected: false,
            paymentMethodSelected: "",
            isBillShipSame: true,
            order_summary: "",
            order_summary_original: "",
            billing_shipping_address: "",
            billing_shipping_address_original: "",
            country_billing_shipping:""
        };
    }

    componentDidMount = () => {
        this.checkSummary()
    }

    checkSummary = () => {
        var { route: { params: { order_summary, billing_shipping_address,country } }, userData } = this.props
console.log("COuntry",country)
        this.setState({
            order_summary: order_summary,
            order_summary_original: order_summary,
            billing_shipping_address: billing_shipping_address,
            billing_shipping_address_original: billing_shipping_address,
            country_billing_shipping:country
        })
    }

    render() {

        var { userData } = this.props
        var { order_summary, billing_shipping_address } = this.state
        console.log("Order Summary from Params:", billing_shipping_address?.addressInformation)

        return (
            <View style={styles.mainContainer}>
                <View style={styles.header_comp}>
                    {/* Title */}
                    <Text style={styles.header_comp_title}>Review & Payment</Text>
                </View>
                <ScrollView >

                    <View style={styles.inner_main}>
                        {/* Payment Method Title */}
                        <Text style={styles.payment_method}>PAYMENT METHOD</Text>

                        {
                            order_summary !== "" && order_summary?.payment_methods.map((item, index) => {
                                return (
                                    <View style={[styles.payment_method_item_cont, {
                                        height: this.state.paymentMethodSelected == item?.code ? null : 40,
                                    }]}>
                                        <View style={styles.flex_container}>
                                            {this.state.paymentMethodSelected == item?.code ?
                                                <>
                                                    <TouchableOpacity
                                                        style={{ paddingVertical: 10 }}
                                                        onPress={() => this.setState({ isPaymentMethodSelected: !this.state.isPaymentMethodSelected, paymentMethodSelected: "" })}>
                                                        <AntDesign name="checkcircle" size={18} color="black" />
                                                    </TouchableOpacity>

                                                </>
                                                :
                                                <>
                                                    <TouchableOpacity
                                                        style={{ paddingVertical: 10 }}
                                                        onPress={() => this.setState({ isPaymentMethodSelected: !this.state.isPaymentMethodSelected, paymentMethodSelected: item?.code })}>
                                                        <Entypo name="circle" size={18} color="black" />
                                                    </TouchableOpacity>
                                                </>
                                            }
                                            <Text style={[styles.payment_method_item_title, { marginHorizontal: 10, }]}>{item.title}</Text>
                                        </View>

                                        {this.state.paymentMethodSelected == item?.code &&
                                            <View style={styles.inner_item_container}>
                                                <View style={styles.flex_container}>
                                                    {this.state.isBillShipSame ?
                                                        <>
                                                            <TouchableOpacity
                                                                style={{ paddingVertical: 10 }}
                                                                onPress={() => this.setState({ isBillShipSame: !this.state.isBillShipSame })}>
                                                                <AntDesign name="checkcircle" size={18} color="black" />
                                                            </TouchableOpacity>

                                                        </>
                                                        :
                                                        <>
                                                            <TouchableOpacity
                                                                style={{ paddingVertical: 10 }}
                                                                onPress={() => this.setState({ isBillShipSame: !this.state.isBillShipSame })}>
                                                                <Entypo name="circle" size={18} color="black" />
                                                            </TouchableOpacity>
                                                        </>
                                                    }
                                                    <Text style={[styles.payment_method_item_title, { marginHorizontal: 10, fontSize: 12 }]}>My billing and shipping address are the same</Text>
                                                </View>

                                                {this.state.isBillShipSame ?
                                                    <View style={{ alignSelf: "flex-start",marginLeft:30 }}>
                                                        <Text style={styles.billingAddressText}>
                                                            {billing_shipping_address?.addressInformation?.billing_address?.firstname} {billing_shipping_address?.addressInformation?.billing_address?.lastname}
                                                        </Text>
                                                        <Text style={styles.billingAddressText}>
                                                            {billing_shipping_address?.addressInformation?.billing_address?.street[0] == undefined ?
                                                                ""
                                                                :
                                                                billing_shipping_address?.addressInformation?.billing_address?.street[0]
                                                            }
                                                        </Text>
                                                        <Text style={styles.billingAddressText}>
                                                            {billing_shipping_address?.addressInformation?.billing_address?.city},  {billing_shipping_address?.addressInformation?.billing_address?.postcode}
                                                        </Text>
                                                        <Text style={styles.billingAddressText}>
                                                            {this.state.country_billing_shipping}
                                                        </Text>
                                                    </View>
                                                    :
                                                    <>
                                                    </>
                                                }
                                            </View>
                                        }

                                    </View>
                                )
                            })}

                        <View style={{ width: width - 80, borderWidth: 0.5 }}></View>

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

export default connect(mapStateToProps, mapDispatchToProps)(Review_Payment);

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
        width: width - 40,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    inner_item_container: {
        width: "80%",
        justifyContent: "center",
        alignItems: "center"
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
    billingAddressText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#848484",
        marginTop:3,
    },
    payment_method: {
        color: "black",
        fontWeight: "600",
        fontSize: 16,
        marginTop: 50,
        marginBottom: 15,
    },
    payment_method_item_cont: {
        width: width - 80,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 0.5,
        // borderBottomWidth: 0.5
    },
    flex_container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    payment_method_item_title: {
        color: "black",
        fontWeight: "500",
        fontSize: 14,
        letterSpacing: 0.5
    },
})