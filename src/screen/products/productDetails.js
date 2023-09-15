import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
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

import Fontisto from 'react-native-vector-icons/Fontisto'

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import HomeHeader from '../home/components/homeHeader';
import ImageCarousel from './components/imageCarousel';
import Options from './components/options';

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
            option_package_size: null,
            option_power: null,
            selectedItemLeftPower: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            selectedItemLeftPackage: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            selectedItemRightPower: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            selectedItemRightPackage: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            eyedir: '',
            dropdown: false,
            optionSelected: [],
        };
    }

    componentDidMount = () => {
        this.getDescription()
        this.checkOptions()
    }

    checkOptions = () => {
        var { product_details: { options } } = this.props.route.params
        console.log("OPtions For Product", options)

        for (let i = 0; i < options.length; i++) {

            if (options[i]?.title == "PACKAGE SIZE") {
                this.setState({ option_package_size: options[i] })
            }
            if (options[i]?.title == "POWER") {
                this.setState({ option_power: options[i] })
            }

        }
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

    selectItem = (item, index, title) => {
        console.log(this.state.eyedir)
        switch (this.state.eyedir) {
            case "leftPA":
                setImmediate(() => {
                    this.setState({ selectedItemLeftPackage: item, dropdown: false, })
                })
                break;

            case "leftPO":
                setImmediate(() => {
                    this.setState({ selectedItemLeftPower: item, dropdown: false, })
                })
                break;

            case "rightPA":
                setImmediate(() => {
                    this.setState({ selectedItemRightPackage: item, dropdown: false, })
                })
                break;
            case "rightPO":
                setImmediate(() => {
                    this.setState({ selectedItemRightPower: item, dropdown: false, })
                })
                break;

        }
    }

    openDropDown = (val, eyedir) => {
        console.log(eyedir)
        setImmediate(() => {
            this.setState({ dropdown: !this.state.dropdown, optionSelected: val, eyedir: eyedir })
        })
    }
    dismissModal = () => {
        setImmediate(() => {
            this.setState({ dropdown: false, })
        })
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

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ width: width - 20, }}>
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
                        marginTop: 10,
                        fontSize: 12,
                        fontWeight: "400"
                    }]}>
                        AVAILABILTY:
                        <Text style={[styles.product_name, {
                            fontSize: 12,
                            color: stock_item?.is_in_stock == true ? "#020621" : "red"
                        }]}>
                            {stock_item?.is_in_stock == true ? " IN STOCK" : " OUT OF STOCK"}
                        </Text>
                    </Text>

                    {/* Options */}
                    <Options
                        option_package_size={this.state.option_package_size}
                        option_power={this.state.option_power}
                        dropdown={this.state.dropdown}
                        selectedItemLeftPower={this.state.selectedItemLeftPower}
                        selectedItemLeftPackage={this.state.selectedItemLeftPackage}
                        selectedItemRightPower={this.state.selectedItemRightPower}
                        selectedItemRightPackage={this.state.selectedItemRightPackage}
                        openDropDown={(val, eyedir) => this.openDropDown(val, eyedir)}
                    />



                </ScrollView>
                {this.state.optionSelected.length !== 0 && <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.dropdown}
                    onDismiss={() => this.dismissModal()}
                >
                    <TouchableOpacity
                        onPress={() => this.dismissModal()}
                        style={{
                            width: width,
                            height: height,
                            backgroundColor: "rgba(52,52,52,0.8)",
                            justifyContent: "center",
                            alignItems: "center"

                        }}>

                        <View style={[styles?.dropDown_style, {
                            zIndex: 300,
                            height: this.state.optionSelected?.values?.length >= 5 ? 150 : null,
                        }]}>
                            <ScrollView style={{ width: "100%" }} nestedScrollEnabled>
                                {

                                    this.state.optionSelected?.values?.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={String(index)}
                                                onPress={() => this.selectItem(item, index, item?.title)}
                                                style={styles?.dropDown_item_style}>
                                                {/* {this.state.eyedir == 'leftPA' ?
                                                    (this.state.selectedItemLeftPackage?.title !== item?.title && <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />)
                                                    :
                                                    (this.state.selectedItemLeftPackage?.title !== item?.title && <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />)
                                                }
                                                {this.state.eyedir == 'leftPO' ?
                                                    (this.state.selectedItemLeftPower?.title !== item?.title && <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />)
                                                    :
                                                    (this.state.selectedItemRightPower?.title !== item?.title && <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />)
                                                }
                                                {this.state.eyedir == 'rightPA' ?
                                                    (this.state.selectedItemLeft?.title == item?.title && <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />)
                                                    :
                                                    (this.state.selectedItemRight?.title == item?.title && <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />)
                                                } */}
                                                {/* {this.state.selectedItem?.title == item?.title && <Fontisto name="check" size={16} color="black" style={{ marginLeft: 10 }} />} */}


{/* new ones */}

                                                {/* {this.state.eyedir == "leftPA" &&
                                                    this.state.selectedItemLeftPackage?.title !== item?.title ?
                                                    <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />
                                                    :
                                                    <Fontisto name="check" size={16} color="black" style={{ marginLeft: 10 }} />
                                                }


                                                {this.state.eyedir == "leftPO" &&
                                                    this.state.selectedItemLeftPower?.title !== item?.title ?
                                                    <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />
                                                    :
                                                    <Fontisto name="check" size={16} color="black" style={{ marginLeft: 10 }} />
                                                }

                                                {this.state.eyedir == "rightPA" &&
                                                    this.state.selectedItemRightPackage?.title !== item?.title ?
                                                    <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />
                                                    :
                                                    <Fontisto name="check" size={16} color="black" style={{ marginLeft: 10 }} />
                                                }


                                                {this.state.eyedir == "rightPO" &&
                                                    this.state.selectedItemRightPower?.title !== item?.title ?
                                                    <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />
                                                    :
                                                    <Fontisto name="check" size={16} color="black" style={{ marginLeft: 10 }} />
                                                } */}

                                                < Text style={styles.dropDown_item_text}>{item?.title}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>}
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
        backgroundColor: "white",
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
    },
    option_cont: {
        width: width - 20,
        alignItems: "flex-start",
        marginTop: 20

    },
    dropdown_cont: {
        width: "100%",
        height: 45,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#020621",
        marginTop: 10
    },
    selectedItem_text: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: "500",
        color: "#020621",
    },

    dropDown_style: {
        width: "100%",
        // height: 200,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#020621",
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    dropDown_item_style: {
        width: "95%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 5,

    },
    dropDown_item_text: {
        fontSize: 14,
        fontWeight: "500",
        color: "#020621",
        marginHorizontal: 10
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