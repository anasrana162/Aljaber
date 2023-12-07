import { Text, StyleSheet, Image,  View, Dimensions, NativeModules, FlatList, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import { TextInput } from 'react-native-gesture-handler';
{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

import Entypo from "react-native-vector-icons/Entypo"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"


const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT
const imageUrl = "https://aljaberoptical.com/media/catalog/product/"

class Search extends Component {
    constructor(props) {

        super(props);

        this.state = {
            products: [],
            filteredProducts: [],
            textInput: '',
        };
    }

    componentDidMount = () => {
        this.fetchAllProducts()
    }

    fetchAllProducts = () => {
        var { userData: { searchproducts } } = this.props
        // console.log("allproducts",allproducts)
        this.setState({
            products: searchproducts
        })
    }

    onSearch = (txt) => {
        var { products, filteredProducts } = this.state;
        console.log("TXT REACHED", txt)
        console.log("Products", products)
        const filterData = products.filter((data) => {
            console.log("DAta", data.brand)
            const matches_name = data?.name.toString()
                .toLowerCase()
                .includes(txt.toLowerCase());
            const matches_brand = data?.brand.toString()
                .toLowerCase()
                .includes(txt.toLowerCase());
            const matches_price = data?.price.toString()
                .toLowerCase()
                .includes(txt?.toLowerCase());

            return (
                matches_name ||
                matches_brand ||
                matches_price

            );
        });

        setImmediate(() => {
            this.setState({
                filteredProducts: filterData,
            });
        });
    }

    selectedItem = (product, index) => {
        console.log("Product Selected:", product)
        this.props.navigation.navigate("ProductDetails", { product_details:  product, product_index: index })
    }

    addToCart = (product, index) => {

        var { userData } = this.props
        console.log("userData", userData?.token)

        if (userData?.token !== null || userData?.user?.cartID !== undefined) {

            if ( product?.type == "simple") {


                    var obj = {
                        "cartItem": {
                            "sku": product?.sku,
                            "qty": 1,
                            "name": product?.name,
                            "price": product?.price,
                            "product_type": product?.type,
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
                        alert("Product Added to Cart!")
                    }).catch((err) => {
                        console.log("Add to cart item api error:  ", err)
                        this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                    })

           

            } else {
                this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                return alert("Please select a Product Option!")
            }

        }

        else {
            alert("Please Login to your account first!")
            this.props.navigation.navigate("Account", { modal: "open" })
        }

    }

    ListHeaderComponent = () => {
        return (
            <View style={styles.headerComp}>
                <TouchableOpacity onPress={() => this.props.navigation.pop()} >
                    <Entypo name="chevron-with-circle-left" size={30} color="white" style={{ paddingVertical: 10, }} />
                </TouchableOpacity>
                <View style={styles.textinpCont}>
                    <TextInput
                        value={this.state.textInput}
                        placeholder='Search...'
                        placeholderTextColor={"#777"}
                        style={{
                            width: "90%",
                            height: "100%",
                            color:"black"
                        }}
                        autoFocus={true}
                        autoCorrect={false}
                        onChangeText={(txt) => {
                            this.setState({ textInput: txt })
                            // this.onSearch(txt)
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => this.onSearch(this.state.textInput)}
                    // style={styles.searchIcon}
                    >
                        <Ionicons name="search" size={30} color="#020621" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        var { filteredProducts } = this.state

        const ListEmptyComponent = () => {
            return (
                <View style={{
                    width: width,
                    height: height - 60,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                    <Text style={{ fontSize: 24, fontWeight: "700", color: "#bbb", width: 180, textAlign: "center" }}>No content type to search</Text>

                </View>
            )
        }

    

        const renderItem = (products) => {
            return (
                <TouchableOpacity
                    onPress={() => this.selectedItem(products?.item, products?.index)}
                    style={styles.product_Cont}
                    activeOpacity={0.6}

                >
                    <View style={styles.product_inner_Cont}>


                        <Image
                            resizeMode='stretch'
                            source={{ uri: imageUrl + products?.item?.image }}
                            style={{ width: "70%", height: 80, borderRadius: 10 }}
                        />


                        <Text numberOfLines={2} style={styles.product_Name}>{products?.item?.brand}</Text>
                        <Text numberOfLines={2} style={[styles.product_Name, { marginTop: 5, width: 160 }]}>{products?.item?.name}</Text>
                        <Text style={[styles.product_Name, { fontSize: 13, marginTop: 5 }]}>AED {products?.item?.price}</Text>

                        <View style={styles.addToCart_Outer_Cont}>
                            <TouchableOpacity style={styles.wishlist_button}>
                                <MaterialCommunityIcons name="cards-heart-outline" size={20} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.addToCart(products?.item, products?.index)}
                                style={styles?.addToCart_Cont}>
                                <MaterialCommunityIcons name="shopping-outline" size={18} color="white" style={{ marginRight: 5 }} />
                                <Text style={styles.addToCart}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }


        return (
            <View style={styles.mainContainer}>
                <this.ListHeaderComponent />
                <FlatList
                    data={filteredProducts}
                    numColumns={2}
                    ListEmptyComponent={ListEmptyComponent}
                    // ListHeaderComponent={ListHeaderComponent}
                    // ListFooterComponent={ListFooterComponent}
                    renderItem={renderItem}
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
    headerComp: {
        width: width,
        height: 60,
        backgroundColor: "#020621",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    product_Cont: {
        marginVertical: 10,
        marginHorizontal: 10,
        width: width / 2 - 20,
        height: 210,
        backgroundColor: "#fffff",
        // marginBottom: 50,
        alignItems: "center",
    },
    textinpCont: {
        width: 270,
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: "#020621",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    product_inner_Cont: {
        width: "100%",
        height: "100%",
        // elevation: 4,
        // backgroundColor: "white",
        // paddingBottom: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.4,
        // shadowRadius: 1.5,
        // borderTopWidth: 0.4,
        // borderColor: "#bbb",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    product_Name: {
        fontSize: 12,
        fontWeight: "600",
        color: "#020621",
        marginTop: 0,
        textAlign: "center",
    },
    addToCart: {
        fontSize: 12,
        fontWeight: "600",
        color: "#ffff",
        textAlign: "center",
    },
    addToCart_Cont: {
        width: 105,
        height: 30,
        flexDirection: "row",
        backgroundColor: "#222529",
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
    },
    addToCart_Outer_Cont: {
        flexDirection: "row",
        width: "100%",
        height: 30,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",

    },
    wishlist_button: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 0.5,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
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

export default connect(mapStateToProps, mapDispatchToProps)(Search);