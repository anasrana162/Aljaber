import { Text, StyleSheet, Image, TextInput, View, Dimensions, NativeModules, FlatList, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

import Entypo from "react-native-vector-icons/Entypo"

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
        };
    }

    componentDidMount = () => {
        this.fetchAllProducts()
    }

    fetchAllProducts = () => {
        var { userData: { allproducts } } = this.props
        this.setState({
            products: allproducts
        })
    }

    onSearch = (txt) => {
        var { products, filteredProducts } = this.state;
console.log("TXT REACHED",txt)
        const filterData = products.filter((data) => {
            console.log("DAta", data)
            const matches_name = data?.name
                .toLowerCase()
                .includes(txt.toLowerCase());
            const matches_brand = data?.brand
                .toLowerCase()
                .includes(txt.toLowerCase());
            const matches_price = data?.price
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

    render() {
        var { products, filteredProducts } = this.state

        const ListEmptyComponent = () => {
            return (
                <View></View>
            )
        }

        const ListHeaderComponent = () => {
            return (
                <View style={styles.headerComp}>
                    <TouchableOpacity onPress={() => this.props.navigation.pop()} >
                        <Entypo name="chevron-with-circle-left" size={30} color="white" style={{ paddingVertical: 10, }} />
                    </TouchableOpacity>
                    <TextInput

                        placeholder='Search...'
                        placeholderTextColor={"#777"}
                        style={styles.textinp}
                        onChangeText={(txt) => this.onSearch(txt)}
                    />
                </View>
            )
        }

        const renderItem = (products) => {
            return (
                <Pressable
                    // onPress={() => selectedItem(products?.item, products?.index)}
                    style={styles.product_Cont}
                    activeOpacity={0.8}

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
                                // onPress={() => addToCart(products?.item, products?.index)}
                                style={styles?.addToCart_Cont}>
                                <MaterialCommunityIcons name="shopping-outline" size={18} color="white" style={{ marginRight: 5 }} />
                                <Text style={styles.addToCart}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            )
        }


        return (
            <View style={styles.mainContainer}>
                <ListHeaderComponent />
                <FlatList
                    data={filteredProducts}
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
    textinp: {
        width: 270,
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: "#020621",
        backgroundColor: "white",
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