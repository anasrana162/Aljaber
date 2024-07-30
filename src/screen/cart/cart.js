import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { Component } from 'react'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

import api, { custom_api_url, basis_auth } from '../../api/api';
import { encode as base64encode } from 'base-64'
import axios from 'axios';
import LottieView from 'lottie-react-native';
import TabNavigator from '../../components_reusable/TabNavigator';
import ProductList from '../products/components/productList';
import Loading from '../../components_reusable/loading';
import Shipping_Tax from './components/shipping_Tax';
import HeaderComp from '../../components_reusable/headerComp';
const imageUrl = "https://aljaberoptical.com/media/catalog/product/"

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cartData: null,
            cartItems: [], //these are modified Items to show in cart screen
            original: [], // these are not modified but are used to send in update cart API
            updateCartItems: [],
            subtotal: 0,
            flatrate: 0,
            shipping: '',
            calculating: false,
            loader: false,
            loader2: false,
            loaderDot: false,
            randomProducts: [],
            openShipping_TaxModal: false,
            countries: [],
            countrySelected: "",
            provinces: [],
            provinceSelected: "",
            shipping_tax_key: 0,
            couponCode: "",
            loaderEdit: false,
            itemToEditSelected: "",
            hideSummary: false,

        };
    }

    componentDidMount = () => {
        // this.props.navigation.addListener('focus', async () => this.refresh());
        this.getRecommendedProducts()
        this.isUserLoggedIn("start")
        this.getCountries()
        // console.log("USER DATA", this.props.userData.user)
    }

    isUserLoggedIn = (key, delete_cart_item_product) => {
        var { userData: { user, } } = this.props
        if (Object.keys(user).length == 0) {
            switch (key) {
                case "start":
                    this.getGuestCartItems()
                    break;

                case "deleteCartItem":
                    this.deleteGuestCartItem(delete_cart_item_product)
                    break
                case "updateCartItem":
                    this.updateGuestCart()
                    break

                case "proceed":
                    this.updateGuestCartThenProceed()
                    break;
            }
        } else {
            // if user is logged in 
            switch (key) {
                case "start":
                    this.getCartData()
                    this.getCartItemDetails()
                    break;

                case "deleteCartItem":
                    this.deleteCartItem(delete_cart_item_product)
                    break;

                case "updateCartItem":
                    this.updateCart()
                    break;
                case "updateCartItem":
                    this.updateCart()
                    break;

                case "proceed":
                    this.updateCartThenProceed()

                    break;
            }

        }
    }

    refresh = () => {
        this.getRecommendedProducts()
        this.isUserLoggedIn("start")
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

    getGuestCartItems = async () => {

        var { userData: { token, admintoken, guestcartkey, guestcartid } } = this.props

        setImmediate(() => {
            this.setState({
                loader: true,
                hideSummary: true,
                calculating: true,
                cartItems: [],
                cartData: null,
                subtotal: 0,
                flatrate: 0,
                shipping: "",
            })
        })
        console.log("guestcartkey", guestcartkey);

        api.get("guest-carts/" + guestcartkey + '/items')
            .then(async (res) => {
                // console.log("REsponse Get Guest cart Data APi", res?.data)
                setImmediate(() => {
                    this.setState({
                        cartData: guestcartid,
                        // cartItems: res?.data
                    })
                })

                this.addDataToCartItems(res?.data)

            }).catch((err) => {
                console.log("Get guest cart Data APi Error", err.response.data?.message)
                // alert("Please try Logging in your account first")
                setImmediate(() => {
                    this.setState({ loader: false, hideSummary: true })
                })
            })

    }
    getCartData = async () => {

        var { userData: { token, admintoken, allproducts } } = this.props

        setImmediate(() => {
            this.setState({
                loader: true,
                hideSummary: true,
                calculating: true,
                cartItems: [],
                cartData: null,
                subtotal: 0,
                flatrate: 0,
                shipping: "",
            })
        })

        api.get("carts/mine",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(async (res) => {
                // console.log("REsponse Get cart Data APi", res?.data)
                setImmediate(() => {
                    this.setState({
                        cartData: res?.data,
                        // cartItems:res?.data?.items
                    })
                })


            }).catch((err) => {
                console.log("Get cart Data APi Error", err)
                // alert("Please try Logging in your account first")
                setImmediate(() => {
                    this.setState({ loader: false, hideSummary: true })
                })
            })

    }

    getCartItemDetails = () => {
        var { userData: { token, admintoken }, actions } = this.props


        api.get("carts/mine/items",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                console.log("REsponse Get cart ITems APi", res?.data)
                setImmediate(() => {
                    this.setState({ original: res?.data })
                })
                this.addDataToCartItems(res?.data)
                // original.push(items[i])

            }).catch((err) => {
                console.log("Get cart ITems APi Error", err)
                setImmediate(() => {
                    this.setState({ loader: false, hideSummary: true })
                })
            })

    }

    // this function is used because the options in some of the items comes with id's not with
    // actual data inorder to fetch that data we have send them through another api's
    addDataToCartItems = async (items) => {
        var { cartItems, subtotal } = this.state
        var { actions } = this.props
        // setImmediate(() => {
        //     this.setState({ cartItems: items ,loader:false})
        // })
        if (items.length == 0) {
            return setImmediate(() => {
                this.setState({ loader: false, hideSummary: true })
            })
        }
        for (let i = 0; i < items.length; i++) {
            // console.log(" ------------- ")
            // console.log("")
            // console.log("items[i].name", items[i],)

            var image = await api.get(custom_api_url + "func=get_product_image&sku=" + items[i]?.sku)
            // console.log("image Obj",image?.data)
            items[i].image = image.data?.image
            items[i].subtotal = items[i].price * items[i].qty
            subtotal = subtotal + items[i].subtotal
            if (items[i]?.product_option == undefined) {

                cartItems.push(items[i])
                setImmediate(() => {
                    this.setState({ loader: false })
                })

            } else {

                for (let co = 0; co < items[i].product_option?.extension_attributes?.custom_options.length; co++) {

                    // console.log("items[i].product_option?.extension_attributes?.custom_options", items[i].product_option?.extension_attributes?.custom_options[co], "  ", co)
                    var option_value_name = await this.fetchIdDataproductLabel(items[i].product_option?.extension_attributes?.custom_options[co]?.option_value)
                    var option_title = await this.fetchIdDataAttributeLabel(items[i].product_option?.extension_attributes?.custom_options[co]?.option_id)
                    // console.log("option_title: ", option_title, "     ", "option_value_name: ", option_value_name)
                    items[i].product_option.extension_attributes.custom_options[co].option_title = option_title;
                    items[i].product_option.extension_attributes.custom_options[co].option_value_name = option_value_name;

                }

                if (
                    items[i].product_option?.extension_attributes?.configurable_item_options == undefined

                ) {
                    // console.log("No Configurable Item Options")
                } else {
                    // console.log("items[i].product_option?.extension_attributes?.configurable_item_options", items[i].product_option?.extension_attributes?.configurable_item_options)
                    for (let co = 0; co < items[i].product_option?.extension_attributes?.configurable_item_options.length; co++) {
                        // console.log("items[i].product_option?.extension_attributes?.configurable_item_options", items[i].product_option?.extension_attributes?.configurable_item_options[co], "  ", co)
                        var option_title = "COLOR" //await this.fetchIdDataAttributeLabel(items[i].product_option?.extension_attributes?.configurable_item_options[co]?.option_id)
                        var option_value_name = await this.fetchIdDataOptionLabel(items[i].product_option?.extension_attributes?.configurable_item_options[co]?.option_value)
                        items[i].product_option.extension_attributes.configurable_item_options[co].option_title = option_title;
                        items[i].product_option.extension_attributes.configurable_item_options[co].option_value_name = option_value_name;
                        // console.log("option_title: ", option_title, "     ", "option_value_name: ", option_value_name)

                    }
                }

                cartItems.push(items[i])

                setImmediate(() => {
                    this.setState({ loader: false })
                })

            }
            setImmediate(() => {
                this.setState({ cartItems, subtotal })
            })

            if (i == items.length - 1) {
                actions.cartItems(cartItems)
                setImmediate(() => {
                    this.setState({
                        calculating: false,
                        hideSummary: false,
                    })
                })
                this.calculateShipping()
            }

        }


    }


    deleteGuestCartItem = (product) => {
        var { userData: { admintoken, guestcartkey } } = this.props
        // console.log("Delete Item PRoduct", token)
        api.delete("guest-carts/" + guestcartkey + "/items/" + product?.item_id, {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        })
            .then((res) => {
                console.log("Delete Guest cart item Api Res ", res?.data)
                this.refresh()
                alert("Item Removed")
            }).catch((err) => {
                console.log("Delete Guest cart item Api ERR", err)
            })
    }
    deleteCartItem = (product) => {
        var { userData: { token, admintoken, allproducts } } = this.props
        // console.log("Delete Item PRoduct", token)
        api.delete("carts/" + product?.quote_id + "/items/" + product?.item_id, {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        })
            .then((res) => {
                // console.log("Delete cart item Api Res ", res?.data)
                this.refresh()
                alert("Item Removed")
            }).catch((err) => {
                console.log("Delete cart item Api ERR", err)
            })
    }

    updateCartThenProceed = async () => {

        var { updateCartItems, cartItems } = this.state
        var { userData } = this.props
        console.log("working updateCart FUnc", updateCartItems)
        var cartItemsToSend = JSON.parse(JSON.stringify(cartItems))
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
        if (updateCartItems?.length == 0) {
            console.log("cart is empty")
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return this.props.navigation.navigate('Billing_Shipping', { subtotal: this.state.subtotal, cartItems: cartItemsToSend, })
        }
        for (let i = 0; i < updateCartItems?.length; i++) {
            // console.log("updateCartItems OBJ", updateCartItems[i])
            if (cartItems[updateCartItems[i]?.index]?.item_id == updateCartItems[i]?.item_id) {
                var obj = { "cartItem": cartItems[updateCartItems[i]?.index] }
                // delete obj?.cartItem?.item_id;
                delete obj?.cartItem?.image;
                delete obj?.cartItem?.subtotal
                if (cartItems[updateCartItems[i]?.index]?.product_option !== undefined) {

                    for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options.length; u++) {
                        // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u])
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_title
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_value_name
                    }

                    if (cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options == undefined) {
                    } else {
                        for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options.length; u++) {
                            // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u])
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_title
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_value_name
                        }

                    }
                }
                // console.log("Final OBJ", cartItems[updateCartItems[i]?.index].product_option?.extension_attributes)

                await api.post("carts/mine/items", obj, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`,
                    },
                }).then((response) => {

                    // console.log("Update Cart Item API response : ", response?.data)
                    if (i == updateCartItems.length - 1) {
                        setImmediate(() => {
                            this.setState({ cartItems: cartItemsToSend })
                        })
                        console.log(" this.state.cartItems", cartItemsToSend, `${"\n"}`, this.state.subtotal);
                        this.props.navigation.navigate('Billing_Shipping', { subtotal: this.state.subtotal, cartItems: cartItemsToSend, })
                        // cartItemsToSend= null
                        setImmediate(() => {
                            this.setState({
                                loader: false
                            })
                        })
                        this.getCartData()
                        this.getCartItemDetails()
                    }
                }).catch((err) => {
                    console.log("Update Cart item api error:  ", err)
                })
            }
        }

    }
    updateGuestCartThenProceed = async () => {

        var { updateCartItems, cartItems } = this.state
        var { userData } = this.props
        // console.log("working updateCart FUnc")
        var cartItemsToSend = JSON.parse(JSON.stringify(cartItems))

        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
        if (updateCartItems?.length == 0) {
            console.log("cart is empty")
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return this.props.navigation.navigate('Billing_Shipping_Guest', { subtotal: this.state.subtotal, cartItems: cartItemsToSend })
        }
        for (let i = 0; i < updateCartItems.length; i++) {
            // console.log("updateCartItems OBJ", updateCartItems[i])
            if (cartItems[updateCartItems[i]?.index]?.item_id == updateCartItems[i]?.item_id) {
                var obj = { "cartItem": cartItems[updateCartItems[i]?.index] }
                // delete obj?.cartItem?.item_id;
                delete obj?.cartItem?.image;
                delete obj?.cartItem?.subtotal
                if (cartItems[updateCartItems[i]?.index]?.product_option !== undefined) {

                    for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options.length; u++) {
                        // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u])
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_title
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_value_name
                    }

                    if (cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options == undefined) {
                    } else {
                        for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options.length; u++) {
                            // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u])
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_title
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_value_name
                        }

                    }
                }
                // console.log("Final OBJ", cartItems[updateCartItems[i]?.index].product_option?.extension_attributes)


                api.post("guest-carts/" + userData?.guestcartkey + "/items", obj, {
                    headers: {
                        Authorization: `Bearer ${userData?.admintoken}`,
                    },
                }).then((response) => {
                    // console.log(" Guest Update Cart Item API response : ", response?.data)
                    if (i == updateCartItems.length - 1) {
                        setImmediate(() => {
                            this.setState({ cartItems: cartItemsToSend })
                        })
                        console.log(" this.state.cartItems", cartItemsToSend, `${"\n"}`, this.state.subtotal);
                        this.props.navigation.navigate('Billing_Shipping_Guest', { subtotal: this.state.subtotal, cartItems: cartItemsToSend, })
                        // cartItemsToSend= null
                        setImmediate(() => {
                            this.setState({
                                loader: false
                            })
                        })
                        this.getGuestCartItems()
                        // this.getCartItemDetails()
                    }
                }).catch((err) => {
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                    console.log("Guest Update Cart item api error:  ", err)
                })

            }
        }

    }



    updateCart = async () => {

        var { updateCartItems, cartItems } = this.state
        var { userData } = this.props
        // console.log("working updateCart FUnc")
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
        if (updateCartItems?.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return console.log("working updateCart FUnc")
        }
        for (let i = 0; i < updateCartItems?.length; i++) {
            // console.log("updateCartItems OBJ", updateCartItems[i])
            if (cartItems[updateCartItems[i]?.index]?.item_id == updateCartItems[i]?.item_id) {
                var obj = { "cartItem": cartItems[updateCartItems[i]?.index] }
                // delete obj?.cartItem?.item_id;
                delete obj?.cartItem?.image;
                delete obj?.cartItem?.subtotal
                if (cartItems[updateCartItems[i]?.index]?.product_option !== undefined) {

                    for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options.length; u++) {
                        // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u])
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_title
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_value_name
                    }

                    if (cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options == undefined) {
                    } else {
                        for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options.length; u++) {
                            // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u])
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_title
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_value_name
                        }

                    }
                }
                // console.log("Final OBJ", cartItems[updateCartItems[i]?.index].product_option?.extension_attributes)

                await api.post("carts/mine/items", obj, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`,
                    },
                }).then((response) => {

                    // console.log("Update Cart Item API response : ", response?.data)
                    if (i == updateCartItems.length - 1) {
                        setImmediate(() => {
                            this.setState({
                                cartItems: [],
                                cartData: null,
                                subtotal: 0,
                                flatrate: 0,
                                shipping: "",
                                loader: false
                            })
                        })
                        this.getCartData()
                        this.getCartItemDetails()
                    }
                }).catch((err) => {
                    console.log("Update Cart item api error:  ", err)
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                })
            }
        }

    }


    updateGuestCart = async () => {

        var { updateCartItems, cartItems } = this.state
        var { userData } = this.props
        // console.log("working updateCart FUnc")
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
        if (updateCartItems.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return console.log("working updateCart FUnc")
        }
        for (let i = 0; i < updateCartItems.length; i++) {
            // console.log("updateCartItems OBJ", updateCartItems[i])
            if (cartItems[updateCartItems[i]?.index]?.item_id == updateCartItems[i]?.item_id) {
                var obj = { "cartItem": cartItems[updateCartItems[i]?.index] }
                // delete obj?.cartItem?.item_id;
                delete obj?.cartItem?.image;
                delete obj?.cartItem?.subtotal
                if (cartItems[updateCartItems[i]?.index]?.product_option !== undefined) {

                    for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options.length; u++) {
                        // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u])
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_title
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_value_name
                    }

                    if (cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options == undefined) {
                    } else {
                        for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options.length; u++) {
                            // console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u])
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_title
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_value_name
                        }

                    }
                }
                // console.log("Final OBJ", cartItems[updateCartItems[i]?.index].product_option?.extension_attributes)


                api.post("guest-carts/" + userData?.guestcartkey + "/items", obj, {
                    headers: {
                        Authorization: `Bearer ${userData?.admintoken}`,
                    },
                }).then((response) => {
                    // console.log(" Guest Update Cart Item API response : ", response?.data)
                    if (i == updateCartItems.length - 1) {
                        setImmediate(() => {
                            this.setState({
                                cartItems: [],
                                cartData: null,
                                subtotal: 0,
                                flatrate: 0,
                                shipping: "",
                                loader: false,
                            })
                        })
                        this.getGuestCartItems()
                        // this.getCartItemDetails()
                    }
                }).catch((err) => {
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                    console.log("Guest Update Cart item api error:  ", err)
                })

            }
        }

    }

    calculateShipping = () => {
        var { subtotal } = this.state

        //    / console.log("calculateShipping subtotal", subtotal)

        if (subtotal > 150) {
            this.setState({
                flatrate: 20,
                shipping: ""
            })
        } else {
            this.setState({
                shipping: "free",
            })
        }

    }

    fetchIdDataproductLabel = async (id) => {
        var result = await axios.get(custom_api_url + 'func=product_option_label&id=' + id)
        return result.data
    }
    fetchIdDataOptionLabel = async (id) => {
        var result = await axios.get(custom_api_url + 'func=option_label&id=' + id)
        return result.data
    }
    fetchIdDataAttributeLabel = async (id) => {
        var result = await axios.get(custom_api_url + 'func=attribute_label&id=' + id)
        return result.data
    }

    getRecommendedProducts = () => {
        var { userData: { randomproducts } } = this.props
        setImmediate(() => {
            this.setState({
                loaderDot: true
            })
        })
        // console.log("userData Recommended Products", randomproducts)
        setImmediate(() => {
            this.setState({
                randomProducts: randomproducts,
                loaderDot: false
            })
        })
    }

    // addToCart = (product, index) => {

    //     var { userData } = this.props
    //     // console.log("userData", userData?.token)

    //     if (userData?.token !== null || userData?.user?.cartID !== undefined) {

    //         if (product?.type_id == "virtual" || product?.type_id == "simple") {

    //             if (product?.options.length == 0) {

    //                 var obj = {
    //                     "cartItem": {
    //                         "sku": product?.sku,
    //                         "qty": 1,
    //                         "name": product?.name,
    //                         "price": product?.price,
    //                         "product_type": "simple",
    //                         "quote_id": userData?.user?.cartID
    //                     }
    //                 }
    //                 // console.log("this product does not have options", obj)

    //                 api.post("carts/mine/items", obj, {
    //                     headers: {
    //                         Authorization: `Bearer ${userData?.token}`,
    //                     },
    //                 }).then((response) => {
    //                     // console.log("Add to cart Item API response : ", response?.data)
    //                 }).catch((err) => {
    //                     console.log("Add to cart item api error:  ", err.response)
    //                 })

    //             } else {
    //                 console.log("this product has options")
    //                 this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
    //                 return alert("Please select a Product Options!")
    //             }

    //         } else {
    //             this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
    //             return alert("Please select a Product varient color!")
    //         }

    //     }

    //     else {
    //         alert("Please Login to your account first!")
    //         this.props.navigation.navigate("Account", { modal: "open" })
    //     }

    // }

    minusOne = (qty, index) => {
        var { cartData, cartItems, original, updateCartItems, subtotal } = this.state

        if (qty > 1) {

            cartItems[index].qty = qty - 1  // for modified List 
            // original[index].qty = qty - 1  // For update cart API
            cartItems[index].subtotal = cartItems[index].price * cartItems[index].qty
            subtotal = subtotal - cartItems[index].price
            // we are saving the ID's and index of the object in updateCartItems so when we update cart we can match the id 
            // and index and pick whole object form cartItems to send to update cart API
            var check = updateCartItems.filter((data) => data?.item_id == cartItems[index].item_id)[0]

            // a check if id already exist then no need to send it again which can cause duplicates
            if (check?.item_id !== cartItems[index].item_id) {
                // console.log("ID PUSHED")
                updateCartItems.push({ item_id: cartItems[index].item_id, index: index })
            }
            // this.calculateShipping()
            setImmediate(() => {
                this.setState({ cartItems, updateCartItems, original, subtotal })
            })
        }

    }

    plusOne = (qty, index) => {
        var { cartData, cartItems, original, updateCartItems, subtotal } = this.state

        // increasing quantity
        cartItems[index].qty = qty + 1  // for modified List 
        // original[index].qty = qty + 1  // For update cart API
        cartItems[index].subtotal = cartItems[index].price * cartItems[index].qty
        subtotal = subtotal + cartItems[index].price
        // we are saving the ID's and index of the object in updateCartItems so when we update cart we can match the id 
        // and index and pick whole object form cartItems to send to update cart API
        var check = updateCartItems.filter((data) => data?.item_id == cartItems[index].item_id)[0]

        // a check if id already exist then no need to send it again which can cause duplicates
        if (check?.item_id !== cartItems[index].item_id) {
            // console.log("ID PUSHED")
            updateCartItems.push({ item_id: cartItems[index].item_id, index: index })
        }
        //cartItems[index].subtotal = cartItems[index].price * cartItems[index].qty

        setImmediate(() => {
            this.setState({ cartItems, updateCartItems, original, subtotal })
        })
    }



    openShipping_TaxModal = () => {
        this.setState({
            openShipping_TaxModal: !this.state.openShipping_TaxModal
        })
    }

    itemSelectedFromShipping_Tax = (val, key) => {
        switch (key) {
            case "country":
                // console.log("Vale Selected Country:  ", val)
                if (val?.country_id == "AE") {
                    this.setState({
                        countrySelected: val,
                        shipping: "free",
                        flatrate: 0,
                        // shipping_tax_key: this.state.shipping_tax_key + 1,
                    })

                } else {

                    this.setState({
                        countrySelected: val,
                        shipping: "",
                        flatrate: 20,
                        // shipping_tax_key: this.state.shipping_tax_key + 1,
                    })
                }
                this.getProvinces(val)
                break;
            case "province":
                // console.log("Vale Selected Province:  ", val)
                this.setState({
                    provinceSelected: val,
                    // shipping_tax_key: this.state.shipping_tax_key + 1,
                })
                break;
        }
    }

    getProvinces = (val) => {

        api.get("aljaber/getallregionbycid?country_id=" + val?.country_id).then((result) => {
            // console.log("Get Provinces Api Result: ", result?.data)
            setImmediate(() => {
                this.setState({ provinces: result?.data })
            })
        }).catch(err => {
            console.log("Get Provinces Api Error: ", err)
        })
    }

    applyCoupon = () => {
        var { userData: { admintoken, token } } = this.props

        // console.log("this.state.couponCode", this.state.couponCode)
        // console.log("this.state.cartData?.id", this.state.cartData?.id)
        // console.log("admintoken", admintoken)

        api.put('carts/' + this.state.cartData?.id + '/coupons/' + this.state.couponCode, {}, {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        }).then((res) => {
            // console.log("Apply coupon API Result", res?.data)
        }).catch((err) => {
            console.log("Apply coupon API Error", err.response?.data)
            alert(err.response?.data?.message)
        })

    }
    onEditItem = async (item) => {
        console.log("Item", item?.item)
        this.setState({ loaderEdit: true, itemToEditSelected: item?.item?.item_id })
        var result = await api.get(custom_api_url + "func=get_cart_item_image&item_id=" + item?.item?.item_id)
        console.log("result API", result?.data)
        item.item.sku = result?.data?.parent_sku
        item.item.id = result?.data?.id
        this.setState({ loaderEdit: false })
        this.props.navigation.navigate("ProductDetails", { product_details: item.item, product_index: item?.index, screenName: "Cart" })
    }


    addToWishList = async (product) => {
        var { userData: { user, admintoken } } = this.props
        // console.log("Product ID:   ", product);
        // console.log("user ID:   ", user?.id);
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
        if (Object.keys(user).length == 0) {
            return alert("Please login to your account!")
        }
        const base64Credentials = base64encode(`${basis_auth.Username}:${basis_auth.Password}`);
        // console.log("base64Credentials:   ", base64Credentials);

        var result = await api.get(custom_api_url + "func=get_cart_item_image&item_id=" + product?.item_id)
        // console.log("result:", result.data);

        api.post(custom_api_url + "func=add_wishlist", {
            "productId": result?.data?.parent_id,
            "customerId": user?.id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${base64Credentials}`,
            },
        }).then((response) => {
            console.log("Product added to wishlist Cart Screen Result:   ", response?.data);
            api.delete("carts/" + product?.quote_id + "/items/" + product?.item_id, {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            })
                .then((res) => {
                    console.log("Delete cart item Api Res ", res?.data)
                    // this.refresh()
                    // alert("Item Removed")
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                    this.refresh()
                    alert("Product Successfully Added")
                }).catch((err) => {
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                    console.log("Delete cart item Api ERR", err)
                })
        }).catch((err) => {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            console.log("Product added to wishlist Cart Screen Error:   ", err?.response);
        })








    }


    //this component was placed here because it was re-rendering when state was updated 
    ListFooterComponent = () => {
        var { cartData, loader, randomProducts, loaderDot, cartItems, calculating, subtotal, flatrate, shipping } = this.state

        return (

            <View style={styles.footerComp}>

                <ScrollView>



                    {/* Summary Container */}

                    <Text style={[styles.text_style, {
                        color: "black",
                        fontSize: 20,
                        fontWeight: "700",
                        alignSelf: "flex-start",
                        marginTop: 20,
                        marginBottom: 10,
                        marginLeft: 20,
                    }]}>Summary</Text>
                    {cartItems.length == 0 &&
                        <View style={{ width: width - 30, alignSelf: "center", height: 1.5, backgroundColor: "#777", marginTop: 60 }} />}
                    {calculating ?
                        <View style={{
                            width: "80%",
                            alignSelf: "center",
                            height: 150,
                        }} >
                            <Text style={[styles.text_style, { alignSelf: "center", marginTop: 10, }]}>Calculating</Text>
                            < LottieView source={require('../../animations/dots_load.json')}
                                autoPlay={true}
                                resizeMode='cover'
                                loop

                            />
                        </View>
                        :
                        <>
                            {/* <Shipping_Tax
                                key={this.state.shipping_tax_key}
                                openShipping_TaxModal={this.openShipping_TaxModal}
                                isModalOpen={this.state.openShipping_TaxModal}
                                countries={this.state.countries}
                                provinces={this.state.provinces}
                                props={this.props}
                                shipping={shipping}
                                flatrate={flatrate}
                                selectItem={(val, key) => this.itemSelectedFromShipping_Tax(val, key)}
                            /> */}



                            {/* Subtotal */}
                            <View style={[styles.flatList_innerCont, { justifyContent: "space-between", alignSelf: "center", marginTop: 20 }]}>
                                <Text style={[styles.text_style, { fontSize: 16, fontWeight: "600", color: "#777" }]}>Subtotal</Text>
                                <Text style={[styles.text_style, { fontSize: 15, fontWeight: "400", color: "#777" }]}>AED {subtotal} </Text>
                            </View>

                            {/* Flatrate */}
                            {/* {shipping == "" && <View style={[styles.flatList_innerCont, { justifyContent: "space-between", alignSelf: "center" }]}>
                                <Text style={[styles.text_style, { fontSize: 16, fontWeight: "600", color: "#777" }]}>Shipping (Flat Rate - Flat Rate)</Text>
                                <Text style={[styles.text_style, { fontSize: 15, fontWeight: "400", color: "#777" }]}>AED {flatrate} </Text>
                            </View>} */}

                            <View style={{ width: width - 20, alignSelf: "center", height: 1.5, backgroundColor: "#bbb", marginTop: 10 }} />

                            {/* Order Total */}
                            <View style={[styles.flatList_innerCont, { justifyContent: "space-between", alignSelf: "center", marginTop: 20 }]}>
                                <Text style={[styles.text_style, { fontSize: 16, fontWeight: "600", color: "black" }]}>Order Total</Text>
                                <Text style={[styles.text_style, { fontSize: 18, fontWeight: "700", color: "black" }]}>AED {flatrate + subtotal} </Text>
                            </View>

                            {/* Coupon Code */}

                            {/* <View style={{
                                width: width - 40,
                                height: 40,
                                backgroundColor: "white",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 20,
                                alignSelf: "center"
                            }}>
                                <TextInput
                                    value={this.state.couponCode}
                                    style={styles.couponTxtInp}
                                    placeholder='Enter discount code'
                                    placeholderTextColor={"rgba(189, 189, 189)"}
                                    onChangeText={(txt) => this.setState({ couponCode: txt })}
                                />
                                <TouchableOpacity
                                    onPress={() => this.applyCoupon()}
                                    style={styles.applyCoupon}>
                                    <Text style={[styles.text_style, { fontSize: 14, color: "white", fontWeight: "600" }]}>Apply Discount</Text>
                                </TouchableOpacity>
                            </View> */}

                            <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-around" }}>
                                {/* Update Cart */}
                                <TouchableOpacity
                                    onPress={() => this.isUserLoggedIn("updateCartItem")}
                                    style={styles.updateCartBtn}>
                                    {loader == true ? <ActivityIndicator size={"small"} color="#020621" /> : <Text style={[styles.text_style, { fontSize: 16, color: "white" }]}>Update Cart</Text>}
                                </TouchableOpacity>
                                {/* Proceed Button */}
                                <TouchableOpacity
                                    onPress={() => this.isUserLoggedIn("proceed")}
                                    style={styles.checkout_btn}>
                                    <Text style={[styles.text_style, { fontSize: 16, color: "white", fontWeight: "600" }]}>Proceed</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    }



                    {/* <Text style={[styles.text_style, {
                        color: "black",
                        fontSize: 20,
                        alignSelf: "flex-start",
                        marginTop: 20,
                        marginBottom: -20,
                        marginLeft: 20,
                    }]}>Recommended for you</Text> */}
                    {/* Recommended Products */}
                    {/* <ProductList
                        screenName="Cart"
                        data={randomProducts}
                        loaderDot={loaderDot}
                        navProps={this.props.navigation}
                        addToCart={(product, index) => this.addToCart(product, index)}
                    /> */}
                </ScrollView>

            </View >

        )
    }

    render() {
        var { cartData, loader, randomProducts, hideSummary, loaderDot, cartItems, calculating, subtotal, flatrate, shipping } = this.state

        const ListEmptyComponent = () => {
            return (

                <View style={styles.nullCartData_cont} >
                    <MaterialCommunityIcons name="cart-remove" size={100} color="#233468" />
                    <Text style={[styles.text_style, { marginTop: 15 }]}>Your cart is empty</Text>
                    <Text style={[styles.text_style, {
                        color: "#777",
                        fontSize: 18,
                        width: 240,
                        textAlign: "center",
                        marginTop: 10,
                    }]}>Looks like you have't added anything to your cart</Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("HomeScreen")}
                        style={styles.continue_shooping_btn}>
                        <Text style={[styles.text_style, { color: "white", fontSize: 16 }]}>Continue Shopping</Text>
                    </TouchableOpacity>

                </View>

            )
        }

        const ListHeaderComponent = () => {
            return (
                <HeaderComp titleEN={"Shopping Cart"} navProps={this.props.navigation} />
            )
        }


        const renderItem = (item) => {
            // console.log("Items", item?.item)
            // {"index": 9, "item": {"item_id": 5507, "name": "Bio True 1-Day for Astigmatism", "price": 200, "product_option": {"extension_attributes": [Object]}, "product_type": "simple", "qty": 1, "quote_id": "2848", "sku": "BT30-Astigmatism"}, "separators": {"highlight": [Function highlight], "unhighlight": [Function unhighlight], "updateProps": [Function updateProps]}}
            return (
                <View style={styles.flatList_Cont}>

                    {/* Image & Text */}
                    <View style={styles.flatList_innerCont}>
                        <Image
                            source={{ uri: imageUrl + item?.item?.image }}
                            resizeMode='contain'
                            style={{ width: 120, height: 100, }}
                        />
                        <View style={styles.text_cont}>
                            <Text style={[styles.text_style, { fontSize: 14 }]}>{item?.item?.name}</Text>

                            {item?.item?.product_option !== undefined &&

                                <>

                                    {item?.item?.product_option?.extension_attributes?.configurable_item_options !== undefined &&
                                        item?.item?.product_option?.extension_attributes?.configurable_item_options.map((data, index) => {
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
                                    {item?.item?.product_option?.extension_attributes?.custom_options.map((data, index) => {
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

                    {/* Quantity ,Price Subtotal*/}
                    <View style={[styles.flatList_innerCont, { marginTop: 0 }]}>

                        {/* Price Item */}
                        <View style={styles.small_box}>
                            <Text style={[styles.text_style, { fontSize: 14, fontWeight: "600" }]}>Price</Text>
                            <Text style={[styles.text_style, { fontSize: 14, fontWeight: "400", marginTop: 5 }]}>AED {item?.item?.price}</Text>
                        </View>

                        {/* Quantity */}
                        <View style={styles?.row_quantity}>

                            {/* Minus Button */}
                            <TouchableOpacity
                                onPress={() => this.minusOne(item?.item?.qty, item?.index)}
                                style={styles.quantityBox}>
                                <AntDesign name="minus" size={18} color="#020621" />
                            </TouchableOpacity>

                            {/* Quantity Number */}
                            <View
                                style={styles.quantityBox}>
                                <Text style={[styles.text_style, { fontSize: 14 }]}>{item?.item?.qty}</Text>
                            </View>

                            {/* Plus Button */}
                            <TouchableOpacity
                                onPress={() => this.plusOne(item?.item?.qty, item?.index)}
                                style={styles.quantityBox}>
                                <AntDesign name="plus" size={18} color="#020621" />
                            </TouchableOpacity>
                        </View>

                        {/* Subtotal */}
                        <View style={styles.small_box}>
                            <Text style={[styles.text_style, { fontSize: 14, fontWeight: "600" }]}>Subtotal</Text>
                            <Text style={[styles.text_style, { fontSize: 14, marginTop: 5 }]}>AED {item?.item?.subtotal}</Text>
                        </View>
                    </View>

                    {/* Wishlist, remove, Edit */}
                    <View style={[styles.flatList_innerCont, { marginTop: 0, justifyContent: "space-between" }]}>
                        <TouchableOpacity
                            onPress={() => {
                                // console.log("item ID",item?.item);
                                this.addToWishList(item?.item)

                            }
                            }
                        >
                            <Text style={[styles.text_style, { fontSize: 14, padding: 10, }]}>Move to Wishlist</Text>
                        </TouchableOpacity>

                        <View style={[styles.flatList_innerCont, { justifyContent: "space-between", width: 60, }]}>
                            <TouchableOpacity
                                disabled={this.state.loaderEdit}
                                onPress={() => this.onEditItem(item)}>
                                {this.state.loaderEdit && this.state.itemToEditSelected == item?.item?.item_id ?
                                    <ActivityIndicator size={"small"} color="#020621" />
                                    : <FontAwesome5 name='pencil-alt' size={18} color='#020621' style={{ padding: 5 }} />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.isUserLoggedIn("deleteCartItem", item?.item)}>
                                <Entypo name='cross' size={24} color='#020621' style={{ padding: 5 }} />
                            </TouchableOpacity>
                        </View>


                    </View>
                </View>
            )
        }

        // const 

        return (
            <View style={styles.mainContainer} >

                <ListHeaderComponent />

                <FlatList
                    data={cartItems}
                    ListEmptyComponent={ListEmptyComponent}
                    // ListHeaderComponent={ListHeaderComponent}
                    // ListFooterComponent={ListFooterComponent}
                    renderItem={renderItem}
                />

                {loader && <Loading />}

                {!hideSummary && <this.ListFooterComponent />}
                {/** Tab Navigator */}
                {/* <TabNavigator
                    screenName={"Cart"}
                    navProps={this.props.navigation}
                /> */}
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
    footerComp: {
        width: width,
        height: height / 3.4,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    couponTxtInp: {
        width: "60%",
        height: "100%",
        paddingLeft: 10,
        color: "black",
        borderWidth: 0.5,
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
        paddingBottom: 10
    },

    header_comp_title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#ffffff"
    },

    checkout_btn: {
        width: 120,
        height: 40,
        backgroundColor: "#020621",
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },

    flatList_Cont: {
        width: width - 20,
        height: 220,
        // borderTopWidth: 1,
        borderBottomWidth: 0.5,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        paddingTop: 10,
        paddingBottom: 10
    },

    flatList_innerCont: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    updateCartBtn: {
        width: 120,
        height: 40,
        backgroundColor: "#020621",
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },

    small_box: {
        justifyContent: "center",
        alignItems: "center"
    },
    row_quantity: {
        //width: 100,
        height: 35,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#020621",
        borderRadius: 5,
    },
    quantityBox: {
        width: 35,
        height: "100%",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#020621",
    },
    option_cont: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    text_cont: {
        width: 180,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start"
    },

    nullCartData_cont: {
        width: width,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60,
    },
    text_style: {
        fontSize: 20,
        fontWeight: "600",
        color: "#222529"
    },
    continue_shooping_btn: {
        width: 170,
        height: 50,
        backgroundColor: "#222529",
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,

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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);