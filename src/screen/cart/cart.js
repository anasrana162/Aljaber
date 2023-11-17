import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

import api from '../../api/api';
import axios from 'axios';
import TabNavigator from '../../components_reusable/TabNavigator';
import ProductList from '../products/components/productList';


class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cartData: null,
            cartItems: null,
            loader: false,
            loader2: false,
            loaderDot: false,
            randomProducts: [],

        };
    }

    componentDidMount = () => {
        this.getRecommendedProducts()
        this.getCartData()
    }
    getCartData = async () => {

        var { userData: { token, admintoken, allproducts } } = this.props

        let products = []
        let tempPRoducts = []

        if (allproducts == null) {
            this.getCartData()
        }

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
                        cartItems:res?.data?.items
                    })
                })

            })

    }
    getCartData1 = async () => {

        var { userData: { token, admintoken, allproducts } } = this.props

        let products = []
        let tempPRoducts = []

        if (allproducts == null) {
            this.getCartData()
        }

        api.get("carts/mine",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(async (res) => {
                // console.log("REsponse Get cart Data APi", res?.data)

                var temp = res?.data?.items

                // once the Array of sku is fetched we use it in a loop to fetch every product detail in the array

                for (let p = 0; p < temp.length; p++) {
                    await api.get('/products/' + temp[p]?.sku, {
                        headers: {
                            Authorization: `Bearer ${admintoken}`,
                        },
                    }).then(async (prod) => {

                        // if (p == temp.length - 1) {
                        //     setImmediate(() => {
                        //         this.setState({
                        //             loader2: false,

                        //         })
                        //     })
                        // }

                        // then we check the array of custom_attributes in for loop to fetch the attribute Brand to show in the products
                        // on the screen as it is not in the main body of the object
                        prod.data.cart_data = temp[p]

                        for (let i = 0; i < prod?.data.custom_attributes.length; i++) {

                            // in the loop we check for on abject having attribute_code "brands" then pickup it value having ID
                            if (prod?.data.custom_attributes[i].attribute_code == 'image') {
                                prod.data.imageLink = prod?.data.custom_attributes[i].value
                            }
                            if (prod?.data.custom_attributes[i].attribute_code == 'brands') {

                                await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,).then(async (data) => {
                                    prod.data.brand = data?.data

                                    // for (let img = 0; img < prod?.data.custom_attributes.length;)

                                    // Condition for fetching products with type_id:"simple"

                                    if (prod?.data?.visibility == 4 && prod?.data?.price > 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "simple") {
                                        products.push(prod?.data)
                                        // this.createFilterData(prod?.data)
                                    }

                                    // Condition for fetching products with type_id:"Configurable"

                                    if (prod?.data?.price == 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "configurable") {

                                        // Checking value of configurable_product_links (product Varients)

                                        for (let tp = 0; tp < prod?.data?.extension_attributes?.configurable_product_links?.length; tp++) {

                                            // Comparing these ID's with the ID's of all products fetched redux which was from All products api from homescreen 

                                            const selected_products = allproducts.filter((value) => value?.id == prod?.data?.extension_attributes?.configurable_product_links[tp])[0]

                                            // Condition

                                            if (prod?.data?.extension_attributes?.configurable_product_links[tp] == selected_products?.id) {

                                                // if id's match then the value "sku" is picked up from the matching product object and then we run an api
                                                // to fetch details for the varient because they are not in the products object from all products api

                                                var check = false

                                                // Api for fetching product details

                                                await api.get('/products/' + selected_products?.sku, {
                                                    headers: {
                                                        Authorization: `Bearer ${admintoken}`,
                                                    },
                                                }).then(async (cfPD) => {

                                                    // once details are fetched we add brand value because its in custom_attributes object in product detail nested obj
                                                    // and we have to run loop to first fetch the key then its id then run another api to fetch the brand name which is
                                                    // long process already done above to save time while fetching for its main version of product

                                                    cfPD.data.brand = data?.data // brand value
                                                    cfPD.data.parent_product_id = prod?.data?.id
                                                    cfPD.data.options = prod?.data?.options



                                                    // then we push all these product varients into a temporary array so the loop is complete reaching all of the id's in
                                                    // the configurable_product_links then we push into main array otherwsie it will mix all the different products varients
                                                    // together

                                                    tempPRoducts.push(cfPD?.data)

                                                    // here's the condition once the configurable_product_links array reach its end
                                                    if (tp == prod?.data?.extension_attributes?.configurable_product_links?.length - 1) {

                                                        //we also change the value of price of the main product because products with type_id have "0" price
                                                        // so we take a price from its varient overwrite (Note price of all vareints are same)
                                                        prod.data.price = cfPD.data?.price

                                                        // then we create an of product_varients and push into main product's object to show and display the varients in
                                                        // product details screen
                                                        prod.data.product_varients = tempPRoducts

                                                        // then we push this product into main products array with all of these things so it can be displayed
                                                        // in the Products screen
                                                        products.push(prod?.data)
                                                        // this.createFilterData(prod?.data)
                                                        // Emptying the temporary array that we pushed products varients so the varients of other products
                                                        // dont get added in the other products
                                                        tempPRoducts = []

                                                        // setting value of check to true from false to break the loop once it reaches its end
                                                        check = true
                                                    }

                                                }).catch((err) => {
                                                    console.log("Configurable Product Details Api Error", err)
                                                })

                                                // this condition break the loop from further adding more products
                                                if (check == true) {
                                                    break;
                                                }
                                            } else {
                                            }
                                        }
                                    }
                                }).catch((err) => {
                                    console.log("DAta for Brands Api errr", err)
                                })
                                break;
                            }
                        }

                        // this is for loader skeleton 
                        if (products?.length >= 1) {
                            setImmediate(() => {
                                this.setState({
                                    loader: false,
                                })
                            })
                        }

                        // var highest_price = Math.max(...products)



                        // console.log("")
                        console.log("products", products)
                        // console.log("")
                        // setting the products in the state once they are all done 
                        setImmediate(() => {
                            this.setState({
                                cartData: products,
                            })
                        })

                    }).catch((err) => {
                        console.log("Product Detail Api error on:  ", temp[p]?.sku)
                        console.log("Product Detail Api error:", err)
                        return setImmediate(() => {
                            this.setState({
                                loader: false
                            })

                        })

                    })
                }



            })

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

    addToCart = (product, index) => {

        var { userData } = this.props
        console.log("userData", userData?.token)

        if (userData?.token !== null || userData?.user?.cartID !== undefined) {

            if (product?.type_id == "virtual" || product?.type_id == "simple") {

                if (product?.options.length == 0) {

                    var obj = {
                        "cartItem": {
                            "sku": product?.sku,
                            "qty": 1,
                            "name": product?.name,
                            "price": product?.price,
                            "product_type": "simple",
                            "quote_id": userData?.user?.cartID
                        }
                    }
                    console.log("this product does not have options", obj)

                    api.post("carts/mine/items", obj, {
                        headers: {
                            Authorization: `Bearer ${userData?.token}`,
                        },
                    }).then((response) => {
                        console.log("Add to cart Item API response : ", response?.data)
                    }).catch((err) => {
                        console.log("Add to cart item api error:  ", err)
                    })

                } else {
                    console.log("this product has options")
                    this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                    return alert("Please select a Product Options!")
                }

            } else {
                this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                return alert("Please select a Product varient color!")
            }

        }

        else {
            alert("Please Login to your account first!")
            this.props.navigation.navigate("Account", { modal: "open" })
        }

    }

    render() {
        var { cartData, loader, randomProducts, loaderDot } = this.state
        return (
            <View style={styles.mainContainer}>

                {cartData == null &&

                    <View style={styles.nullCartData_cont}>
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
                            onPress={() => this.props.navigation.navigate("Categories")}
                            style={styles.continue_shooping_btn}>
                            <Text style={[styles.text_style, { color: "white", fontSize: 16 }]}>Continue Shopping</Text>
                        </TouchableOpacity>



                    </View>

                }
                {cartData !== null && <ScrollView style={{ width: width }}>

                </ScrollView>}
                <View style={{ width: width - 30, alignSelf: "center", height: 1.5, backgroundColor: "#777", marginTop: 60 }} />

                <Text style={[styles.text_style, {
                    color: "black",
                    fontSize: 20,
                    alignSelf: "flex-start",
                    marginTop: 20,
                    marginBottom: -40,
                    marginLeft: 10,
                }]}>Recommended for you</Text>
                {/* Recommended Products */}
                <ProductList
                    screenName="Cart"
                    data={randomProducts}
                    loaderDot={loaderDot}
                    navProps={this.props.navigation}
                    addToCart={(product, index) => this.addToCart(product, index)}
                />
                {/** Tab Navigator */}
                <TabNavigator
                    screenName={"Cart"}
                    navProps={this.props.navigation}
                />
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