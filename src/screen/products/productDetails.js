import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import RenderHtml from 'react-native-render-html';
import AntDesign from 'react-native-vector-icons/AntDesign';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

{/* {---------------Components Imports------------} */ }
import HomeHeader from '../home/components/homeHeader';
import ImageCarousel from './components/imageCarousel';
import Options from './components/options';
import StoreFeatures from './components/storeFeatures';
import DetailsTabNav from './detailsTabNav';
import api from '../../api/api';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class ProductDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            description: '',
            main_info_temp: null,
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
            leftEyeQuantity: 1,
            rigthEyeQuantity: 1,
            eyedir: '',
            dropdown: false,
            optionSelected: [],
            checked: false,
        };
    }

    componentDidMount = () => {
        this.getDescription()
        this.checkOptions()
        this.getMain_Info()
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
        var { product_details: { custom_attributes } } = this.props?.route?.params
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

    getMain_Info = async () => {
        var { product_details: { custom_attributes } } = this.props?.route?.params
        const { userData: { admintoken }, actions, userData } = this.props

        var { main_info_temp } = this.state

        let temp = []
        for (let i = 0; i < custom_attributes.length; i++) {
            if (custom_attributes[i]?.attribute_code == "brands") {

                temp.push(custom_attributes[i])

              //  console.log("brands", custom_attributes[i])
                // break;
            }
            if (custom_attributes[i]?.attribute_code == "color") {

                temp.push(custom_attributes[i])

               // console.log("color", custom_attributes[i])
                // break;
            }
            if (custom_attributes[i]?.attribute_code == "size") {

                temp.push(custom_attributes[i])

               // console.log("size", custom_attributes[i])
                // break;
            }
            if (custom_attributes[i]?.attribute_code == "contact_lenses") {

                temp.push(custom_attributes[i])

               // console.log("brands", custom_attributes[i])
                // break;
            }
            if (custom_attributes[i]?.attribute_code == "contact_lens_diameter") {

                temp.push(custom_attributes[i])

               // console.log("contact_lens_diameter", custom_attributes[i])
                // break;
            }
            if (custom_attributes[i]?.attribute_code == "contact_lens_base_curve") {

                temp.push(custom_attributes[i])

               // console.log("contact_lens_base_curve", custom_attributes[i])
                // break;
            }

            if (custom_attributes[i]?.attribute_code == "water_container_content") {

                temp.push(custom_attributes[i])

               // console.log("water_container_content", custom_attributes[i])
                // break;
            }
            if (custom_attributes[i]?.attribute_code == "contact_lens_usage") {

                temp.push(custom_attributes[i])

               // console.log("contact_lens_usage", custom_attributes[i])
                // break;
            }
            if (custom_attributes[i]?.attribute_code == "box_content_pcs") {

                temp.push(custom_attributes[i])

               // console.log("box_content_pcs", custom_attributes[i])
                // break;
            }
        }

        //console.log("temp:", temp)


        let items = []
        let obj = {}
        for (let j = 0; j < temp.length; j++) {
            // console.log("temp Array elements", temp[j])
            await api.get('/products/attributes/' + temp[j]?.attribute_code + '/options', {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            })
                .then((res) => {
                    // console.log("")
                    // console.log("----------------------------")
                    // console.log("Item DEtails Api:", res?.data)
                    // console.log("----------------------------")
                    // console.log('')

                    for (let k = 0; k < res?.data?.length; k++) {
                        if (res?.data[k]?.value == temp[j]?.value) {

                            if (temp[j]?.attribute_code == "brands") {

                                obj = {
                                    "id": 1,
                                    "brands": res?.data[k]?.label
                                }

                                items.push(obj)
                                // break;
                            }
                            if (temp[j]?.attribute_code == "color") {

                                obj = {
                                    "id": 2,
                                    "color": res?.data[k]?.label
                                }

                                items.push(obj)
                                // break;
                            }
                            if (temp[j]?.attribute_codee == "size") {

                                obj = {
                                    "id": 3,
                                    "color": res?.data[k]?.label
                                }

                                items.push(obj)

                                // break;
                            }
                            if (temp[j]?.attribute_code == "contact_lenses") {

                                obj = {
                                    "id": 4,
                                    "contact_lenses": res?.data[k]?.label
                                }

                                items.push(obj)
                            }
                            if (temp[j]?.attribute_code == "contact_lens_diameter") {

                                obj = {
                                    "id": 5,
                                    "contact_lens_diameter": res?.data[k]?.label
                                }

                                items.push(obj)
                            }
                            if (temp[j]?.attribute_code == "contact_lens_base_curve") {

                                obj = {
                                    "id": 6,
                                    "contact_lens_base_curve": res?.data[k]?.label
                                }

                                items.push(obj)
                            }

                            if (temp[j]?.attribute_code == "water_container_content") {

                                obj = {
                                    "id": 7,
                                    "water_container_content": res?.data[k]?.label
                                }

                                items.push(obj)
                            }
                            if (temp[j]?.attribute_code == "contact_lens_usage") {

                                obj = {
                                    "id": 8,
                                    "contact_lens_usage": res?.data[k]?.label
                                }

                                items.push(obj)
                            }
                            if (temp[j]?.attribute_code == "box_content_pcs") {

                                obj = {
                                    "id": 9,
                                    "box_content_pcs": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }



                        }
                    }

                })
                .catch((err) => {
                    console.log("More_info Api Error", err?.response)
                    alert("Cant fetch More Information Data, Please Try again!")
                })
        }

       // console.log("Items Array:", items)

        setImmediate(() => {
            this.setState({ main_info_temp: items })
        })
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

    onQuantityChange = (val, key) => {
        switch (key) {
            case 'left':
                setImmediate(() => {
                    this.setState({
                        leftEyeQuantity: val,
                    })
                })
                break;

            case 'right':
                setImmediate(() => {
                    this.setState({
                        rightEyeQuantity: val,
                    })
                })
                break;

        }
    }

    checkMarked = (val) => {
        setImmediate(() => {
            this.setState({
                checked: val
            })
        })
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
        const tagsStyles = {
            body: {
                color: "black",
                alignItems: "center",
                width: "90%",
                fontFamily: "Careem-Bold",
            },
            a: {
                color: "green",
            },
        };
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
                            tagsStyles={tagsStyles}
                            contentWidth={width}
                            source={{
                                html: `${this.state.description}`,
                            }}
                        />}

                    {/* Price , quantity, add to cart */}
                    <View style={styles.row_cont}>
                        {/* Price */}
                        <Text style={[styles.product_name, { fontSize: 20 }]}>AED {product_details?.price}</Text>

                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                            {/* Quantity */}
                            {this.state.checked == false &&
                                <>
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
                                </>
                            }

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
                        checkMarked={(val) => this.checkMarked(val)}
                        selectedItemLeftPower={this.state.selectedItemLeftPower}
                        selectedItemLeftPackage={this.state.selectedItemLeftPackage}
                        selectedItemRightPower={this.state.selectedItemRightPower}
                        selectedItemRightPackage={this.state.selectedItemRightPackage}
                        openDropDown={(val, eyedir) => this.openDropDown(val, eyedir)}
                        onChangeText={(val, key) => this.onQuantityChange(val, key)}
                        leftEyeQuantity={this.state.leftEyeQuantity}
                        rigthEyeQuantity={this.state.rigthEyeQuantity}
                    />

                    {/* Store Features */}
                    <StoreFeatures />

                    {/* DetailsNav */}
                    <DetailsTabNav
                        navProps={this.props.navigation}
                        details_tab={this.state.description}
                        ProductName={product_details?.name}
                        main_infor={this.state.main_info_temp}
                    />

                </ScrollView>
                {this.state.optionSelected.length !== 0 &&
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.dropdown}
                        onDismiss={() => this.dismissModal()}
                    >
                        <TouchableOpacity
                            onPress={() => this.dismissModal()}
                            style={{
                                width: width,
                                height: Dimensions.get("screen").height,
                                backgroundColor: "rgba(52,52,52,0.8)",
                                justifyContent: "center",
                                alignItems: "center"

                            }}>

                            <View style={[styles?.dropDown_style, {
                                zIndex: 300,
                                width: width - 30,
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