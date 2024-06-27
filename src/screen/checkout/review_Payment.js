import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  NativeModules,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import React, { Component } from "react";

{
  /* {---------------Redux Imports------------} */
}
import { connect } from "react-redux";
import * as userActions from "../../redux/actions/user";
import { bindActionCreators } from "redux";

import { encode as base64encode } from "base-64";

const {
  StatusBarManager: { HEIGHT },
} = NativeModules;
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height - HEIGHT;
const imageUrl = "https://aljaberoptical.com/media/catalog/product/";

import api, { basis_auth, custom_api_url } from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Loading from "../../components_reusable/loading";
import HeaderComp from "../../components_reusable/headerComp";
import PaymentWebView from "../payment/PaymentWebView";

class Review_Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaymentMethodSelected: false,
      paymentMethodSelected: "",
      isBillShipSame: true,
      order_summary: "",
      order_summary_original: "",
      original_billing_address: "",
      bill_ship_address: "",
      original_ship_bill_address: "",
      country_billing_shipping: "",
      openBillingAddresses: false,
      isBillingAddressSelected: false,
      countries: [],
      selectedBillingAddress:
        this.props?.route?.params?.bill_ship_address == undefined
          ? ""
          : this.props?.route.params.bill_ship_address?.addressInformation
            ?.billing_address,
      confirmBillingAddress: "",
      couponCode: "",
      couponLoader: false,
      couponApplied: false,
      updateBillingAddress: false,
      key: 0,
      loader: false,
      source: {
        html: ``,
      },
      flagforwebview: false,
      buttomButton: false,
    };
  }

  componentDidMount = () => {
    this.getCountries();
    this.checkSummary();
    this.isCouponApplied();
  };

  isCouponApplied = () => {
    var {
      route: {
        params: { order_summary, bill_ship_address, country },
      },
      userData,
    } = this.props;
    if (this.props.route.params !== undefined) {
      if (
        order_summary?.totals?.coupon_code == undefined ||
        order_summary?.totals?.coupon_code == "" ||
        order_summary?.totals?.coupon_code == null
      ) {
        console.log("Coupon is undefined");
        this.setState({ couponApplied: false });
      } else {
        // when coupon is already applied
        this.setState({ couponApplied: true });
      }
    } else {
      this.setState({ couponApplied: false });
    }
  };

  isCouponApplied1 = () => {
    var { order_summary } = this.state;

    if (
      order_summary?.totals?.coupon_code == undefined ||
      order_summary?.totals?.coupon_code == "" ||
      order_summary?.totals?.coupon_code == null
    ) {
      console.log("Coupon is undefined");
      this.setState({ couponApplied: false });
    } else {
      // when coupon is already applied
      this.setState({ couponApplied: true });
    }
  };

  getCountries = () => {
    api
      .get("aljaber/getallcountry")
      .then((result) => {
        // console.log("Get Country Api Result: ", result?.data)
        setImmediate(() => {
          this.setState({ countries: result?.data });
        });
      })
      .catch((err) => {
        console.log("Get Country Api Error: ", err);
      });
  };

  checkSummary = () => {
    let {
      route: {
        params: { order_summary, billing_shipping_address, country },
      },
      userData,
    } = this.props;
    this.setState({
      order_summary: order_summary,
      order_summary_original: order_summary,
      selectedBillingAddress:
        billing_shipping_address.addressInformation?.billing_address,
      bill_ship_address: billing_shipping_address,
      original_ship_bill_address: billing_shipping_address,
      country_billing_shipping: country,
    });
    console.log("bill_ship_address checkSummary:", order_summary);
  };
  selectBillingAddress = (address) => {
    console.log("");
    console.log("address in func", address);
    console.log("");
    setImmediate(() => {
      this.setState({
        selectedBillingAddress: address,
        openBillingAddresses: false,
        isBillingAddressSelected: true,
      });
    });
  };

  applyCoupon = () => {
    var {
      userData: {
        admintoken,
        token,
        user: { cartID },
      },
    } = this.props;

    this.setState({ couponLoader: true });

    console.log("this.state.couponCode", this.state.couponCode);
    console.log("this.state.cartData?.id", cartID);
    console.log("admintoken", admintoken);

    api
      .put(
        "carts/" + cartID + "/coupons/" + this.state.couponCode,
        {},
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
          },
        }
      )
      .then((res) => {
        // console.log("Apply coupon API Result", res?.data)
        alert("Coupon Applied Successfully");
        this.createNewSummary();
        this.setState({ couponLoader: false });
      })
      .catch((err) => {
        console.log("Apply coupon API Error", err.response?.data);
        this.setState({ couponLoader: false });
        alert(err.response?.data?.message);
      });
  };
  cancelCoupon = () => {
    // this.setState({
    //     couponCode: "Null",
    // })
    // this.applyCoupon()
    var {
      userData: {
        admintoken,
        token,
        user: { cartID },
      },
    } = this.props;

    this.setState({ couponLoader: true });

    console.log("this.state.couponCode", this.state.couponCode);
    console.log("this.state.cartData?.id", cartID);
    console.log("admintoken", admintoken);

    // this api should give result in cath error because we are giving "Null" instead of
    // couponCode so api gives error but also removes the previously applied coupon

    api
      .put(
        "carts/" + cartID + "/coupons/" + "Null",
        {},
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
          },
        }
      )
      .then((res) => {
        // console.log("Apply coupon API Result", res?.data)
        alert("Coupon Removed Successfully");
        this.createNewSummary();
        this.setState({ couponLoader: false, couponCode: "" });
      })
      .catch((err) => {
        console.log("Remove coupon API Error", err.response?.data);
        this.setState({ couponLoader: false, couponCode: "" });
        this.createNewSummary();
        alert("Coupon Removed Successfully");
      });
  };

  createNewSummary = () => {
    var {
      userData: {
        admintoken,
        token,
        user: { cartID },
      },
    } = this.props;
    this.setState({ loader: true });
    api
      .post("carts/mine/shipping-information", this.state.bill_ship_address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res shipping information API", res?.data);

        this.setState({
          order_summary: res?.data,
          order_summary_original: res?.data,
          bill_ship_address: this.state.bill_ship_address,
          original_ship_bill_address: this.state.bill_ship_address,
          // country_billing_shipping: country,
          couponApplied: true,
          key: this.state.key + 1,
          loader: false,
        });
        this.isCouponApplied1();
        // this.checkSummary()
      })
      .catch((err) => {
        this.setState({ loader: false });
        console.log("shipping information API ERR", err.response);
      });
  };

  onUpdate = () => {
    var { selectedBillingAddress } = this.state;
    var tempAddress = this.state.bill_ship_address;
    var {
      userData: {
        user: { email, firstname, lastname },
        token,
      },
    } = this.props;
    this.setState({ loader: true });

    // console.log("");
    // console.log("selectedBillingAddress", selectedBillingAddress);
    // console.log("");

    let obj = {
      region: selectedBillingAddress?.region?.region,
      region_id: selectedBillingAddress?.region.region_id,
      region_code: selectedBillingAddress?.region?.region_code,
      country_id: selectedBillingAddress?.country_id,
      street: selectedBillingAddress?.street,
      postcode: selectedBillingAddress?.postcode,
      city: selectedBillingAddress?.city,
      email: email,
      firstname: firstname,
      lastname: lastname,
      telephone: selectedBillingAddress?.telephone,
    };

    tempAddress.addressInformation.billing_address = obj;

    // console.log("");
    // console.log("tempAddress", tempAddress);
    // console.log("");

    api
      .post("carts/mine/shipping-information", tempAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(
          "res shipping information API onUpdate review_payment",
          res?.data
        );

        this.setState({
          order_summary: res?.data,
          // order_summary_original: res?.data,
          bill_ship_address: this.state.bill_ship_address,
          selectedBillingAddress: selectedBillingAddress,
          isBillingAddressSelected: false,
          // original_ship_bill_address: this.state.bill_ship_address,
          // country_billing_shipping: country,
          // updateBillingAddress: false,
          key: this.state.key + 1,
          loader: false,
        });

        // this.checkSummary()
      })
      .catch((err) => {
        this.setState({ loader: false });
        console.log("shipping information API ERR", err.response);
      });
  };

  onDeselect = () => {
    var {
      route: {
        params: { billing_shipping_address },
      },
    } = this.props;
    // console.log("bill_ship_address shipping Address BEFORE UPDATE", billing_shipping_address?.addressInformation?.shipping_address)
    var { bill_ship_address } = this.state;
    bill_ship_address.addressInformation.billing_address =
      billing_shipping_address?.addressInformation?.shipping_address;
    // setTimeout(() => {
    this.setState({
      bill_ship_address,
      selectedBillingAddress:
        billing_shipping_address?.addressInformation?.shipping_address,
      key: this.state.key + 1,
    });
    // }, 500)
    // console.log("bill_ship_address shipping Address BEFORE UPDATE", this.state.selectedBillingAddress)
  };

  createngenius_paymentOrder = (orderId) => {
    const base64Credentials = base64encode(
      `${basis_auth.Username}:${basis_auth.Password}`
    );

    let params = {
      orderId: orderId,
      amount: this.state?.order_summary?.totals?.grand_total,
      email: this.props?.userData?.user?.email,
    };
    api
      .post(custom_api_url + "func=ngenius_payment", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
      })
      .then((response) => {
        this.setState({
          source: { html: response?.data },
          loader: false,
          flagforwebview: true,
        });
        this.interval = setInterval(() => {
          this.orderStatus(orderId);
        }, 3000);
      })
      .catch((error) => {
        console.log(error, error.response);
      });
  };

  orderStatus = (orderId) => {
    const base64Credentials = base64encode(
      `${basis_auth.Username}:${basis_auth.Password}`
    );

    let params = {
      orderId: orderId,
    };
    api
      .post(custom_api_url + "func=ngenius_payment_status_check", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
      })
      .then((response) => {
        console.log(response.data, "=====status check new");

        if (
          (response?.data?.payment_status == "PAID" &&
            response?.data?.payment_response) ||
          (response?.data?.payment_status == "UNPAID" &&
            response?.data?.payment_response)
        ) {
          setTimeout(() => {
            // console.log("Actions Redex", actions)
            // actions.userToken("")
            // actions.adminToken("")
            // actions.user("")
            // actions.myOrders("")
            this.props?.actions.cartItems(null);
            // AsyncStorage.setItem("@aljaber_userLoginData", "");
          }, 1000);

          this.setState({ loader: false, buttomButton: true });
        }
      })
      .catch((error) => {
        this.setState({ loader: false, buttomButton: true });

        console.log(error, error.response);
      });
  };

  placeOrder = () => {
    var {
      userData: { token },
      actions,
    } = this.props;
    console.log("Payment Method", this.state.paymentMethodSelected);
    if (!this.state.paymentMethodSelected) {
      return alert("Select your Payment Method");
    }
    console.log("token", token);
    this.setState({ loader: true });
    let obj = {
      paymentMethod: {
        method: this.state.paymentMethodSelected,
      },
    };
    api
      .post("carts/mine/payment-information", obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res Create Order API", res?.data);
        this.createngenius_paymentOrder(res?.data);
        // alert("Order Created!")
        // setTimeout(() => {
        //     // console.log("Actions Redex", actions)
        //     // actions.userToken("")
        //     // actions.adminToken("")
        //     // actions.user("")
        //     // actions.myOrders("")
        //     actions.cartItems(null)
        //     AsyncStorage.setItem("@aljaber_userLoginData", "")
        // }, 1000)

        // this.props.navigation.navigate("HomeScreen")
        // this.setState({ loader: false })
      })
      .catch((err) => {
        this.setState({ loader: false });
        console.log("Create Order API ERR", err.response.data.message);
        alert(err?.response?.data?.message);
      });
  };

  componentWillUnmount = () => {
    this.setState({ loader: false });
    clearInterval(this.interval);
  };

  render() {
    var { userData } = this.props;
    var { order_summary, bill_ship_address, selectedBillingAddress } =
      this.state;
    console.log(
      "Order Summary from Params:d",
      this.props?.userData?.user?.email
    );

    return (
      <View key={this.state.key} style={styles.mainContainer}>
        <View style={styles.header_comp}>
          {/* Title */}
          <Text style={styles.header_comp_title}>Review & Payment</Text>
        </View>
        <HeaderComp
          titleEN={"Review & Payment"}
          navProps={this.props.navigation}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inner_main}>
            {/* Payment Method Title */}
            <Text style={styles.payment_method}>PAYMENT METHOD</Text>

            {order_summary !== "" &&
              order_summary?.payment_methods.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.payment_method_item_cont,
                      {
                        height:
                          this.state.paymentMethodSelected == item?.code
                            ? null
                            : 40,
                      },
                    ]}
                  >
                    <View style={styles.flex_container}>
                      {this.state.paymentMethodSelected == item?.code ? (
                        // when payment is checked
                        <>
                          <TouchableOpacity
                            style={{ paddingVertical: 10 }}
                            onPress={() =>
                              this.setState({
                                isPaymentMethodSelected:
                                  !this.state.isPaymentMethodSelected,
                                paymentMethodSelected: "",
                                isBillingAddressSelected: false,
                              })
                            }
                          >
                            <AntDesign
                              name="checkcircle"
                              size={18}
                              color="black"
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        // when payment is not checked
                        <>
                          <TouchableOpacity
                            style={{ paddingVertical: 10 }}
                            onPress={() =>
                              this.setState({
                                isPaymentMethodSelected:
                                  !this.state.isPaymentMethodSelected,
                                paymentMethodSelected: item?.code,
                                // selectedBillingAddress: this.props?.route.params.billing_shipping_address == undefined ? "" : this.props?.route.params.billing_shipping_address?.addressInformation?.billing_address,
                                isBillShipSame: true,
                                isBillingAddressSelected: false,
                              })
                            }
                          >
                            <Entypo name="circle" size={18} color="black" />
                          </TouchableOpacity>
                        </>
                      )}
                      <Text
                        style={[
                          styles.payment_method_item_title,
                          { marginHorizontal: 10 },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                    {/* When payment method is Selected */}
                    {this.state.paymentMethodSelected == item?.code && (
                      <View style={styles.inner_item_container}>
                        <View style={styles.flex_container}>
                          {this.state.isBillShipSame ? (
                            <>
                              <TouchableOpacity
                                style={{ paddingVertical: 10 }}
                                onPress={() => {
                                  // console.log(this.state.original_ship_bill_address.addressInformation?.billing_address);
                                  this.onDeselect();
                                  this.setState({
                                    isBillShipSame: !this.state.isBillShipSame,
                                  });
                                }}
                              >
                                {/* <Text>Checksquare</Text> */}
                                <AntDesign
                                  name="checksquare"
                                  size={18}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </>
                          ) : (
                            <>
                              <TouchableOpacity
                                onPress={() => {
                                  this.onDeselect();
                                  this.setState({
                                    isBillShipSame: !this.state.isBillShipSame,
                                  });
                                }}
                                style={{ paddingVertical: 10 }}
                              >
                                <Feather
                                  name="square"
                                  size={18}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </>
                          )}
                          <Text
                            style={[
                              styles.payment_method_item_title,
                              { marginHorizontal: 10, fontSize: 12 },
                            ]}
                          >
                            My billing and shipping address are the same
                          </Text>
                        </View>

                        {this.state.isBillShipSame ? (
                          <View
                            style={{ alignSelf: "flex-start", marginLeft: 30 }}
                          >
                            {/* When payment method is selected and Billing And Shipping address are same */}

                            {/* First and Last Name */}
                            <Text style={styles.billingAddressText}>
                              {selectedBillingAddress?.firstname}{" "}
                              {selectedBillingAddress?.lastname}
                            </Text>
                            {/* Location */}
                            <Text style={styles.billingAddressText}>
                              {selectedBillingAddress?.street[0] == undefined
                                ? ""
                                : selectedBillingAddress?.street[0]}
                            </Text>
                            {/* City and Postal Code */}
                            <Text style={styles.billingAddressText}>
                              {selectedBillingAddress?.city},{" "}
                              {selectedBillingAddress?.postcode}
                            </Text>
                            {/* Country */}
                            <Text style={styles.billingAddressText}>
                              {this.state.country_billing_shipping}
                            </Text>
                            {/* Telephone */}
                            <Text
                              style={[
                                styles.billingAddressText,
                                { marginBottom: 10 },
                              ]}
                            >
                              {selectedBillingAddress?.telephone}
                            </Text>
                          </View>
                        ) : (
                          <>
                            {/* userData?.user?.addresses */}
                            {/* When payment method is selected and Billing And Shipping address are not same */}

                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  openBillingAddresses:
                                    !this.state.openBillingAddresses,
                                })
                              }
                              style={styles.billingAddressOptionCont}
                            >
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.billingAddressText,
                                  {
                                    marginTop: 0,
                                    color: "black",
                                    marginLeft: 10,
                                  },
                                ]}
                              >
                                {this.state.selectedBillingAddress?.firstname}{" "}
                                {this.state.selectedBillingAddress?.lastname},{" "}
                                {this.state.selectedBillingAddress?.street[0]},{" "}
                                {this.state.selectedBillingAddress?.city},{" "}
                                {this.state.selectedBillingAddress?.postcode}
                              </Text>
                            </TouchableOpacity>
                            {this.state.openBillingAddresses == true && (
                              <View style={styles.billingAddressListMainCont}>
                                {userData?.user?.addresses.map(
                                  (item, index) => {
                                    console.log("item in map", item);
                                    var country = this.state.countries.filter(
                                      (data) =>
                                        data?.country_id == item?.country_id
                                    )[0];
                                    return (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.selectBillingAddress(item)
                                        }
                                        style={
                                          styles.billingAddressListItemCont
                                        }
                                      >
                                        <Text
                                          numberOfLines={3}
                                          style={styles.billingAddressText}
                                        >
                                          {item?.firstname} {item?.lastname},{" "}
                                          {item.street[0]}, {item?.city},{" "}
                                          {item?.postcode}, {country?.country},{" "}
                                          {item?.telephone}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  }
                                )}
                              </View>
                            )}
                            {this.state.isBillingAddressSelected && (
                              <View
                                style={{ flexDirection: "row", columnGap: 10 }}
                              >
                                <TouchableOpacity
                                  onPress={() => this.onDeselect()}
                                  style={[
                                    styles.updateBtn,
                                    {
                                      backgroundColor: "white",
                                      borderWidth: 1,
                                    },
                                  ]}
                                >
                                  {this.state?.updateBillingAddress ? (
                                    <ActivityIndicator
                                      size={"small"}
                                      color="#ffffff"
                                    />
                                  ) : (
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: "black",
                                      }}
                                    >
                                      Cancel
                                    </Text>
                                  )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => this.onUpdate()}
                                  style={styles.updateBtn}
                                >
                                  {this.state?.updateBillingAddress ? (
                                    <ActivityIndicator
                                      size={"small"}
                                      color="#ffffff"
                                    />
                                  ) : (
                                    <Text
                                      style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: "white",
                                      }}
                                    >
                                      Update
                                    </Text>
                                  )}
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}

            <View style={{ width: width - 40, borderWidth: 0.5 }}></View>

            {/* Ship To */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={styles.ship_to}>SHIP TO</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={{ padding: 20 }}
              >
                <MaterialCommunityIcons name="pencil" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ alignSelf: "flex-start" }}>
              {/* When payment method is selected and Billing And Shipping address are same */}

              {/* First and Last Name */}
              <Text style={styles.billingAddressText}>
                {
                  bill_ship_address?.addressInformation?.shipping_address
                    ?.firstname
                }{" "}
                {
                  bill_ship_address?.addressInformation?.shipping_address
                    ?.lastname
                }
              </Text>
              {/* Location */}
              <Text style={styles.billingAddressText}>
                {bill_ship_address?.addressInformation?.shipping_address
                  ?.street[0] == undefined
                  ? ""
                  : bill_ship_address?.addressInformation?.shipping_address
                    ?.street[0]}
              </Text>
              {/* City and Postal Code */}
              <Text style={styles.billingAddressText}>
                {bill_ship_address?.addressInformation?.shipping_address?.city},{" "}
                {
                  bill_ship_address?.addressInformation?.shipping_address
                    ?.postcode
                }
              </Text>
              {/* Country */}
              <Text style={styles.billingAddressText}>
                {this.state.country_billing_shipping}
              </Text>
              {/* Telephone */}
              <Text style={[styles.billingAddressText, { marginBottom: 10 }]}>
                {
                  bill_ship_address?.addressInformation?.shipping_address
                    ?.telephone
                }
              </Text>
            </View>
            <View style={{ width: width - 40, borderWidth: 0.5 }}></View>

            {/* Shippin Method */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={styles.ship_to}>SHIPPING METHOD</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={{ padding: 20 }}
              >
                <MaterialCommunityIcons name="pencil" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ alignSelf: "flex-start" }}>
              {/* When payment method is selected and Billing And Shipping address are same */}

              {/* First and Last Name */}
              <Text style={[styles.billingAddressText, { marginBottom: 10 }]}>
                {bill_ship_address?.addressInformation?.shipping_carrier_code ==
                  "flatrate"
                  ? "FlatRate - FlatRate"
                  : "Free Shipping"}
              </Text>
            </View>
            <View style={{ width: width - 40, borderWidth: 0.5 }}></View>

            {/* Coupon Code */}
            <View
              style={{
                width: width - 40,
                height: 40,
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                alignSelf: "center",
              }}
            >
              {this.state.couponApplied == true ? (
                <>
                  <TextInput
                    value={order_summary?.totals?.coupon_code}
                    style={styles.couponTxtInp}
                    placeholder="Enter discount code"
                    placeholderTextColor={"rgba(189, 189, 189)"}
                    onChangeText={(txt) => { }}
                  />
                  <TouchableOpacity
                    disabled={this.state.couponLoader}
                    onPress={() => this.cancelCoupon()}
                    style={styles.applyCoupon}
                  >
                    {this.state.couponLoader == false ? (
                      <Text
                        style={[
                          styles.text_style,
                          { fontSize: 14, color: "white", fontWeight: "600" },
                        ]}
                      >
                        Cancel Coupon
                      </Text>
                    ) : (
                      <ActivityIndicator size={"small"} color={"white"} />
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TextInput
                    value={this.state.couponCode}
                    style={styles.couponTxtInp}
                    placeholder="Enter discount code"
                    placeholderTextColor={"rgba(189, 189, 189)"}
                    onChangeText={(txt) => this.setState({ couponCode: txt })}
                  />
                  <TouchableOpacity
                    disabled={this.state.couponLoader}
                    onPress={() => this.applyCoupon()}
                    style={styles.applyCoupon}
                  >
                    {this.state.couponLoader == false ? (
                      <Text
                        style={[
                          styles.text_style,
                          { fontSize: 14, color: "white", fontWeight: "600" },
                        ]}
                      >
                        Apply Discount
                      </Text>
                    ) : (
                      <ActivityIndicator size={"small"} color={"white"} />
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/*  Order Summary */}
            <Text style={styles.ship_to}>ORDER SUMMARY</Text>

            <View style={{ width: width - 40, borderWidth: 0.5 }}></View>

            {/* Subtotal */}

            {order_summary?.totals?.subtotal == undefined ? (
              <></>
            ) : (
              <View style={styles.order_summary_texts_row}>
                <Text style={styles.order_summary_texts_title}>Subtotal</Text>
                <Text style={styles.order_summary_texts_value}>
                  AED {order_summary?.totals?.subtotal}
                </Text>
              </View>
            )}

            {/* Coupons */}
            {order_summary?.totals?.coupon_code == undefined ||
              order_summary?.totals?.coupon_code == "" ||
              order_summary?.totals?.coupon_code == null ? (
              <></>
            ) : (
              <>
                <View style={styles.order_summary_texts_row}>
                  <Text style={styles.order_summary_texts_title}>
                    Discount({order_summary?.totals?.coupon_code})
                  </Text>
                  <Text style={styles.order_summary_texts_value}>
                    AED {order_summary?.totals?.discount_amount}
                  </Text>
                </View>
                <Text
                  style={[styles.order_summary_texts_title, { marginTop: 5 }]}
                >
                  {order_summary?.totals?.coupon_code}
                </Text>
              </>
            )}

            {/* Shipping */}
            <View style={styles.order_summary_texts_row}>
              <Text style={styles.order_summary_texts_title}>Shipping</Text>
              <Text style={styles.order_summary_texts_value}>
                AED {order_summary?.totals?.shipping_amount}
              </Text>
            </View>
            <Text style={[styles.order_summary_texts_title, { marginTop: 5 }]}>
              {bill_ship_address?.addressInformation?.shipping_carrier_code ==
                "flatrate"
                ? "FlatRate - FlatRate"
                : "Free Shipping"}
            </Text>
            <View
              style={{
                width: width - 40,
                borderWidth: 0.5,
                marginVertical: 10,
              }}
            ></View>

            {/* Total Quantity */}
            <View
              style={[styles.order_summary_texts_row, { marginBottom: 0 }]}
            >
              <Text style={styles.order_summary_texts_title}>Total Quantity</Text>
              <Text style={styles.order_summary_texts_value}>
                {order_summary?.totals?.items_qty}
              </Text>
            </View>
            {/* Order Total */}
            <View
              style={[styles.order_summary_texts_row, { marginBottom: 40 }]}
            >
              <Text style={styles.order_summary_texts_title}>Order Total</Text>
              <Text style={styles.order_summary_texts_value}>
                AED {order_summary?.totals?.grand_total}
              </Text>
            </View>

            {/* Place Order Button */}

            <TouchableOpacity
              onPress={() => this.placeOrder()}
              style={styles.placeOrderBtn}
            >
              <Text style={styles.placeOrderBtnText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {this.state.loader && <Loading screenName={""} />}
        <PaymentWebView
          flagforwebview={this.state?.flagforwebview}
          source={this.state?.source}
          buttomButton={this.state?.buttomButton}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
{
  /* {---------------redux State ------------} */
}
const mapStateToProps = (state) => ({
  userData: state.userData,
});

{
  /* {---------------redux Actions ------------} */
}

const ActionCreators = Object.assign({}, userActions);
const mapDispatchToProps = (dispatch) => ({
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
    backgroundColor: "white",
  },
  inner_main: {
    width: width - 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  inner_item_container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeOrderBtn: {
    width: 140,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 20,
    backgroundColor: "#08c",
    borderRadius: 5,
  },
  placeOrderBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  couponTxtInp: {
    width: "60%",
    height: "100%",
    paddingLeft: 10,
    color: "black",
    borderWidth: 0.5,
  },
  order_summary_texts_title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#777",
    letterSpacing: 1,
  },
  order_summary_texts_value: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    letterSpacing: 1,
  },
  order_summary_texts_row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  applyCoupon: {
    width: "40%",
    height: "100%",
    backgroundColor: "#020621",
    justifyContent: "center",
    alignItems: "center",
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
  },

  header_comp_title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  billingAddressOptionCont: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  billingAddressListMainCont: {
    width: "100%",
    // borderWidth: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginBottom: 10,
  },
  billingAddressListItemCont: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 3,
  },
  billingAddressText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#848484",
    marginTop: 3,
  },
  updateBtn: {
    width: 80,
    height: 40,
    backgroundColor: "#08c",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  updateBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  payment_method: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 50,
    marginBottom: 15,
  },
  ship_to: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 15,
    marginRight: 10,
  },
  payment_method_item_cont: {
    width: width - 40,
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
    letterSpacing: 0.5,
  },
});
