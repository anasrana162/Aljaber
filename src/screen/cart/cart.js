import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from 'react-native-vector-icons/AntDesign';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

import api, { custom_api_url } from '../../api/api';
import axios from 'axios';
import TabNavigator from '../../components_reusable/TabNavigator';
import ProductList from '../products/components/productList';
import Loading from '../../components_reusable/loading';
const imageUrl = "https://aljaberoptical.com/media/catalog/product/"

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cartData: null,
            cartItems: [], //these are modified Items to show in cart screen
            original: [], // these are not modified but are used to send in update cart API
            updateCartItems: [],
            loader: false,
            loader2: false,
            loaderDot: false,
            randomProducts: [],

        };
    }

    componentDidMount = () => {
        this.getRecommendedProducts()
        this.getCartData()
        this.getCartItemDetails()
    }
    getCartData = async () => {

        var { userData: { token, admintoken, allproducts } } = this.props

        setImmediate(() => {
            this.setState({ loader: true })
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
            })

    }

    getCartItemDetails = () => {
        var { userData: { token, admintoken } } = this.props


        api.get("carts/mine/items",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                // console.log("REsponse Get cart ITems APi", res?.data)
                setImmediate(() => {
                    this.setState({ original: res?.data })
                })
                this.addDataToCartItems(res?.data)
                // original.push(items[i])

            }).catch((err) => {
                console.log("Get cart ITems APi Error", err)
                setImmediate(() => {
                    this.setState({ loader: false })
                })
            })

    }

    // this function is used because the options in some of the items comes with id's not with
    // actual data inorder to fetch that data we have send them through another api's
    addDataToCartItems = async (items) => {
        var { cartItems } = this.state

        for (let i = 0; i < items.length; i++) {
            // console.log(" ------------- ")
            // console.log("")
            // console.log("items[i].name", items[i],)

            var image = await api.get(custom_api_url + "func=get_product_image&sku=" + items[i]?.sku)
            // console.log("image Obj",image?.data)
            items[i].image = image.data?.image
            items[i].subtotal = items[i].price * items[i].qty
            if (items[i]?.product_option == undefined) {


                cartItems.push(items[i])


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
                this.setState({ cartItems })
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
                        console.log("Add to cart item api error:  ", err.response)
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

    minusOne = (qty, index) => {
        var { cartData, cartItems, original, updateCartItems } = this.state

        if (qty > 1) {

            cartItems[index].qty = qty - 1  // for modified List 
            original[index].qty = qty - 1  // For update cart API
            //cartItems[index].subtotal = cartItems[index].price * cartItems[index].qty

            // we are saving the ID's and index of the object in updateCartItems so when we update cart we can match the id 
            // and index and pick whole object form cartItems to send to update cart API
            var check = updateCartItems.filter((data) => data?.item_id == cartItems[index].item_id)[0]

            // a check if id already exist then no need to send it again which can cause duplicates
            if (check?.item_id !== cartItems[index].item_id) {
                // console.log("ID PUSHED")
                updateCartItems.push({ item_id: cartItems[index].item_id, index: index })
            }

            setImmediate(() => {
                this.setState({ cartItems, updateCartItems, original })
            })
        }

    }

    plusOne = (qty, index) => {
        var { cartData, cartItems, original, updateCartItems } = this.state

        // increasing quantity
        cartItems[index].qty = qty + 1  // for modified List 
        original[index].qty = qty + 1  // For update cart API

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
            this.setState({ cartItems, updateCartItems, original })
        })
    }

    updateCart = async () => {

        var { updateCartItems, cartItems } = this.state
        var { userData } = this.props
        // console.log("working updateCart FUnc")
        if (updateCartItems.length == 0) {
            return console.log("working updateCart FUnc")
        }
        for (let i = 0; i < updateCartItems.length; i++) {
            console.log("updateCartItems OBJ", updateCartItems[i])
            if (cartItems[updateCartItems[i]?.index]?.item_id == updateCartItems[i]?.item_id) {
                var obj = { "cartItem": cartItems[updateCartItems[i]?.index] }
                // delete obj?.cartItem?.item_id;
                delete obj?.cartItem?.image;
                delete obj?.cartItem?.subtotal
                if (cartItems[updateCartItems[i]?.index]?.product_option !== undefined) {

                    for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options.length; u++) {
                        console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u])
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_title
                        delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.custom_options[u].option_value_name
                    }

                    if (cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options == undefined) {
                    } else {
                        for (let u = 0; u < cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options.length; u++) {
                            console.log("cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options", cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u])
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_title
                            delete cartItems[updateCartItems[i]?.index]?.product_option?.extension_attributes?.configurable_item_options[u].option_value_name
                        }

                    }
                }
                console.log("Final OBJ", cartItems[updateCartItems[i]?.index].product_option?.extension_attributes)

                await api.post("carts/mine/items", obj, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`,
                    },
                }).then((response) => {

                    console.log("Update Cart Item API response : ", response?.data)
                    if (i == updateCartItems.length - 1){
                        this.getCartData()
                        this.getCartItemDetails()
                    }
                }).catch((err) => {
                        console.log("Update Cart item api error:  ", err)
                    })
            }
        }

    }

    render() {
        var { cartData, loader, randomProducts, loaderDot, cartItems } = this.state

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
                        onPress={() => this.props.navigation.navigate("Categories")}
                        style={styles.continue_shooping_btn}>
                        <Text style={[styles.text_style, { color: "white", fontSize: 16 }]}>Continue Shopping</Text>
                    </TouchableOpacity>

                </View>

            )
        }

        const ListHeaderComponent = () => {
            return (
                <View style={styles.header_comp}>
                    <Text style={styles.header_comp_title}>Shopping Cart</Text>
                </View>
            )
        }


        const renderItem = (item) => {
            // console.log("Items", item?.item)
            // {"index": 9, "item": {"item_id": 5507, "name": "Bio True 1-Day for Astigmatism", "price": 200, "product_option": {"extension_attributes": [Object]}, "product_type": "simple", "qty": 1, "quote_id": "2848", "sku": "BT30-Astigmatism"}, "separators": {"highlight": [Function highlight], "unhighlight": [Function unhighlight], "updateProps": [Function updateProps]}}
            return (
                <TouchableOpacity style={styles.flatList_Cont}>

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
                            <Text style={[styles.text_style, { fontSize: 16, fontWeight: "600" }]}>Price</Text>
                            <Text style={[styles.text_style, { fontSize: 15, fontWeight: "400", marginTop: 10 }]}>AED {item?.item?.price}</Text>
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
                                <Text style={styles.product_name}>{item?.item?.qty}</Text>
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
                            <Text style={[styles.text_style, { fontSize: 16, fontWeight: "600" }]}>Subtotal</Text>
                            <Text style={[styles.text_style, { fontSize: 15, marginTop: 10 }]}>AED {item?.item?.subtotal}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
            )
        }

        const ListFooterComponent = () => {
            return (
                <>
                    <View style={{ width: width, }}>

                        <TouchableOpacity
                            onPress={() => this.updateCart()}
                            style={styles.updateCartBtn}>
                            <Text style={[styles.text_style, { fontSize: 14 }]}>Update Cart</Text>
                        </TouchableOpacity>

                        {cartItems.length == 0 && <View style={{ width: width - 30, alignSelf: "center", height: 1.5, backgroundColor: "#777", marginTop: 60 }} />}

                        <Text style={[styles.text_style, {
                            color: "black",
                            fontSize: 20,
                            alignSelf: "flex-start",
                            marginTop: 20,
                            marginBottom: -20,
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

                    </View>
                </>
            )
        }

        return (
            <View style={styles.mainContainer}>

                <FlatList
                    data={cartItems}
                    ListEmptyComponent={ListEmptyComponent}
                    ListHeaderComponent={ListHeaderComponent}
                    ListFooterComponent={ListFooterComponent}
                    renderItem={renderItem}
                />

                {loader && <Loading />}

                {/** Tab Navigator */}
                <TabNavigator
                    screenName={"Cart"}
                    navProps={this.props.navigation}
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
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 10
    },

    header_comp_title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#020621"
    },

    flatList_Cont: {
        width: width - 20,
        // height: 200,
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
        width: "95%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    updateCartBtn: {
        width: 120,
        height: 45,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 10,
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