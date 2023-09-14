import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import RenderHtml from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
//24-hour
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
//local-shipping
import EvilIcons from 'react-native-vector-icons/EvilIcons'
//undo
import Ionicons from 'react-native-vector-icons/Ionicons'
//card


{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import HomeHeader from '../home/components/homeHeader';
import ImageCarousel from './components/imageCarousel';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class ProductDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            description: '',
            quantity: 1,
        };
    }

    componentDidMount = () => {
        this.getDescription()
    }

    getDescription = () => {
        var { product_details: { custom_attributes } } = this.props.route.params
        // console.log("product_details Images Length", media_gallery_entries.length)
        // console.log("product_details Images", custom_attributes)

        for (let i = 0; i < custom_attributes.length; i++) {
            if (custom_attributes[i]?.attribute_code == "description") {
                setImmediate(() => {
                    this.setState({ description: custom_attributes[i]?.value })
                })
                console.log("description", custom_attributes[i]?.value)
                break;
            }
        }
    }

    plusOne = () => {
        var { product_details: { extension_attributes: { stock_item } } } = this.props.route.params
        var { quantity } = this.state
        var qty = stock_item?.qty

        if (quantity <= qty) {
            quantity = quantity + 1
            setImmediate(() => {
                this.setState({
                    quantity
                })
            })
        } else {
            console.log("Quantity Exceeded Maximum limit")
        }

    }

    minusOne = () => {
        var { quantity } = this.state
        if (quantity == 1) {
            return alert("Minimum quantity is 1")
        } else {
            quantity = quantity - 1
            setImmediate(() => {
                this.setState({
                    quantity
                })
            })
        }
    }

    render() {
        var {
            product_details,
            product_details: { extension_attributes: { stock_item } },
        } = this.props.route.params
        return (
            <View style={styles.mainContainer}>

                {/* Header */}
                <HomeHeader />

                <ScrollView style={{ width: width - 20 }}>
                    <ImageCarousel
                        data={product_details?.media_gallery_entries}
                        fisrtImage={{
                            id: product_details?.media_gallery_entries[0]?.id,
                            url: product_details?.media_gallery_entries[0]?.file
                        }} />

                    {/* Product Name */}
                    <Text style={styles.product_name}>{product_details?.name}</Text>

                    {/* Product Description */}
                    {this.state.description !== '' &&
                        <RenderHtml
                            contentWidth={width}
                            source={{
                                html: `${this.state.description}`,
                            }}
                        />}

                    {/* Price , quantity, add to cart */}
                    <View style={styles.row_cont}>
                        {/* Price */}
                        <Text style={styles.product_name}>AED {product_details?.price}</Text>

                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                            {/* Quantity */}
                            <View style={styles?.row_quantity}>
                                {/* Plus Button */}
                                <TouchableOpacity
                                    onPress={() => this.plusOne()}
                                    style={styles.quantityBox}>
                                    <AntDesign name="plus" size={18} color="#020621" />
                                </TouchableOpacity>

                                {/* Quantity Number */}
                                <View
                                    style={styles.quantityBox}>
                                    <Text style={styles.product_name}>{this.state.quantity}</Text>
                                </View>

                                {/* Minus Button */}
                                <TouchableOpacity
                                    onPress={() => this.minusOne()}
                                    style={styles.quantityBox}>
                                    <AntDesign name="minus" size={18} color="#020621" />
                                </TouchableOpacity>
                            </View>

                            {/* Add to Cart */}
                            <TouchableOpacity
                                style={styles.add_to_cart}
                            >
                                <Text style={styles.add_to_cart_text}>AddToCart</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* Availabilty */}
                    <Text style={[styles.product_name, {
                        marginTop:10,
                        fontSize:12,
                        fontWeight: "400"
                    }]}>
                        AVAILABILTY:
                        <Text style={[styles.product_name, {
                             fontSize:12,
                            color: stock_item?.is_in_stock == true ? "#020621" : "red"
                        }]}>
                            {stock_item?.is_in_stock == true ? " IN STOCK" : " OUT OF STOCK"}
                        </Text>
                    </Text>



                </ScrollView>
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
    product_name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#020621"
    },
    row_cont: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        marginTop: 10
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
        marginLeft: 30
    },
    quantityBox: {
        width: 35,
        height: "100%",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#020621",
    },
    add_to_cart: {
        width: 100,
        height: 35,
        backgroundColor: "#020621",
        marginHorizontal: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },

    add_to_cart_text: {
        fontSize: 14,
        fontWeight: "600",
        color: 'white',
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);