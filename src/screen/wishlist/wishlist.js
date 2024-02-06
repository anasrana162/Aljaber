import { Text, StyleSheet, View, Dimensions, NativeModules, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import HomeHeader from '../home/components/homeHeader';
import Drawer from '../../components_reusable/drawer';
import api, { custom_api_url, basis_auth } from '../../api/api';
import { encode as base64encode } from 'base-64';
import { FlatList } from 'react-native-gesture-handler';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT
const imageUrl = "https://aljaberoptical.com/media/catalog/product/"
const base64Credentials = base64encode(`${basis_auth.Username}:${basis_auth.Password}`);
class Wishlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wishlist: [],
            drawer: false,
            loader: false,
        }
    }

    componentDidMount = () => {
        this.getWishList()
    }

    // checkForData = () => {
    //     var { userData: { wishlist } } = this.props
    //     if (wishlist.length == 0) {
    //         this.getWishList()
    //     } else {
    //         console.log("Data for wishlist available!");
    //     }
    // }

    getWishList = () => {
        var { actions, userData: { user: { id } } } = this.props

        this.setState({ loader: true })

        api.post(custom_api_url + "func=get_wishlist", {
            "customerId": id,
        }, {
            headers: {
                Authorization: `Basic ${base64Credentials}`
            }
        })
            .then((res) => {
                // console.log("get Wishlist Api Result:", res?.data);
                actions.wishList(res?.data)
                this.setState({ loader: false })
            })
            .catch((err) => {
                console.log("get Wishlist Api Error:", err?.response?.data?.message);
                this.setState({ loader: false })
            })

    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }

    ListHeaderComponent = () => {
        return (
            <>
                <HomeHeader
                    navProps={this.props.navigation}
                    openDrawer={() => this.openDrawer()}
                />
                <Text style={styles.title}>My Wish List</Text>
            </>
        )
    }
    ListEmptyComponent = () => {
        return (
            <>
                {
                    this.state.loader ? <ActivityIndicator size="large" color="#020621" style={{marginTop:30}} />
                        :
                        <Text style={styles.title}>No Items</Text>}
            </>
        )
    }

    removeItem = (productId) => {
        var { userData: { user: { id } } } = this.props
        console.log("IDS", id, "       ", productId, "      ", base64Credentials);

        api.delete(`${custom_api_url}func=del_wishlist`, {
            data: {
                "productId": productId,
                "customerId": id,
            },
            headers: {
                Authorization: `Basic ${base64Credentials}`
            }
        })
            .then((res) => {
                console.log("Remove Wishlist Item Api Result:", res?.data);

                this.getWishList()

            })
            .catch((err) => {
                console.log("Remove Wishlist Item Api Error:", err);
            });
    }

    addToCart = (product, index) => {

        var { userData } = this.props
        // console.log("userData", userData?.token)

        if (userData?.token !== null || userData?.user?.cartID !== undefined) {

            if (product?.type == "virtual" || product?.type == "simple") {
                console.log("here");
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
                // console.log("this product does not have options", obj)

                api.post("carts/mine/items", obj, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`,
                    },
                }).then((response) => {
                    // console.log("Add to cart Item API response : ", response?.data)
                    this.removeItem(product?.id)
                    alert("Item Added to cart")
                }).catch((err) => {
                    console.log("Add to cart item api error:  ", err)
                })



            } else {
                this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                return alert("Please select a Product Options!")
            }

        }

        else {
            alert("Please Login to your account first!")
            this.props.navigation.navigate("Account", { modal: "open" })
        }

    }

    render() {

        var { userData: { wishlist } } = this.props

        return (
            <View style={styles.mainContainer}>

                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />

                <FlatList
                    data={wishlist}
                    numColumns={2}
                    ListHeaderComponent={this.ListHeaderComponent}
                    ListEmptyComponent={this.ListEmptyComponent}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                key={item?.id}
                                style={styles.listCont}
                            >
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("ProductDetails", { product_details: item, product_index: index })}
                                    style={styles.touchableListItem}>
                                    <Image
                                        source={{ uri: imageUrl + item?.image }}
                                        style={styles.listItemImageCont}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <View style={styles.innerItemContView}>
                                    <Text style={styles.itemNameText}>{item?.name}</Text>
                                    <Text style={styles.itemPriceText}>AED {item?.price}</Text>

                                    {/* quantity ,cart */}
                                    <View style={styles.rowView}>
                                        <View style={styles.itemStatusCont}>
                                            <Text style={styles.itemPriceText}>{item?.status}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => this.addToCart(item, index)}
                                            style={styles.itemAddToCartCont}>
                                            <MaterialCommunityIcons name="shopping-outline" size={22} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Remove Button */}
                                    <TouchableOpacity
                                        onPress={() => this.removeItem(item?.id)}
                                        style={styles.removeBtnCont}>
                                        <Text style={styles.removeBtnText}>Remove</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        )
                    }
                    }
                />

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

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
    title: {
        color: "#020621",
        fontWeight: "500",
        fontSize: 20,
        marginTop: 20,
        marginLeft: 20,
        alignSelf: 'flex-start',
    },
    listCont: {
        width: width / 2 - 20,
        // height: 280,
        alignItems: "center",
        // borderWidth: 1,
        margin: 7.5,
        backgroundColor: "white",
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,

        // elevation: 5,
    },

    touchableListItem: {
        width: "100%",
        height: 120,
        borderBottomWidth: 0.5,
        borderColor: "#ccc"
    },
    listItemImageCont: {
        width: "100%",
        height: "100%",
    },
    itemNameText: {
        color: "black",
        fontWeight: "400",
        textAlign: "center",
        marginTop: 10
    },
    itemPriceText: {
        color: "black",
        fontWeight: "600",
        textAlign: "center",
        marginTop: 5
    },
    innerItemContView: {
        width: "90%",
    },
    rowView: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        borderWidth: 0.5,
        borderColor: "#ccc",
        alignSelf: "center"
    },
    itemStatusCont: {
        width: "40%",
        borderRightWidth: 1,
        backgroundColor: "white",
        height: 30,
    },
    itemAddToCartCont: {
        width: "60%",
        borderLeftWidth: 1,
        backgroundColor: "black",
        height: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    removeBtnCont: {
        padding: 10,
        marginTop: 10,
        alignSelf: "center"
    },
    removeBtnText: {
        color: "#08c",
        fontWeight: "400",
        fontSize: 14,
        textDecorationLine: "underline"
    },

})