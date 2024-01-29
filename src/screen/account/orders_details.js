import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView, FlatList } from 'react-native'
import React, { Component } from 'react'


const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import { CGADULTS } from '../../redux/constants';
import ItemsOrdered from './components/itemsOrdered';
import Invoices from './components/invoices';
import axios from 'axios';
import { custom_api_url } from '../../api/api';

class Order_Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // authModal: false,
            def_ship_add: "",
            def_bill_add: "",
            def_ship_add_found: false,
            def_bill_add_found: false,
            countries: [],
            orders: null,
            selector: "items_ordered",
            product_options: []
        };
    }

    componentDidMount = () => {
        this.getItem()
    }

    getItem = () => {
        var { order_detail } = this.props.route.params
        // console.log('order_detail :>> ', order_detail?.items);
    }

    showMore = async (options, index) => {
        var { extension_attributes } = options
        var { product_options } = this.state
        // console.log("Option Show More:", options);
        // console.log("Option Show More configurable_item_options:", extension_attributes?.configurable_item_options);
        // console.log("Option Show More custom_options:", extension_attributes?.custom_options);
        for (let co = 0; co < extension_attributes?.custom_options.length; co++) {

            // console.log("items[i].product_option?.extension_attributes?.custom_options", items[i].product_option?.extension_attributes?.custom_options[co], "  ", co)
            var option_value_name = await this.fetchIdDataproductLabel(extension_attributes?.custom_options[co]?.option_value)
            var option_title = await this.fetchIdDataAttributeLabel(extension_attributes?.custom_options[co]?.option_id)
            // console.log("option_title: ", option_title, "     ", "option_value_name: ", option_value_name)
            extension_attributes.custom_options[co].option_title = option_title;
            extension_attributes.custom_options[co].option_value_name = option_value_name;

        }
        if (extension_attributes?.configurable_item_options == undefined) {
            console.log("No Configurable Item Options")
        } else {
            // console.log("items[i].product_option?.extension_attributes?.configurable_item_options", items[i].product_option?.extension_attributes?.configurable_item_options)
            for (let co = 0; co < extension_attributes?.configurable_item_options.length; co++) {
                // console.log("items[i].product_option?.extension_attributes?.configurable_item_options", items[i].product_option?.extension_attributes?.configurable_item_options[co], "  ", co)
                var option_title = "COLOR" //await this.fetchIdDataAttributeLabel(items[i].product_option?.extension_attributes?.configurable_item_options[co]?.option_id)
                var option_value_name = await this.fetchIdDataOptionLabel(extension_attributes?.configurable_item_options[co]?.option_value)
                extension_attributes.configurable_item_options[co].option_title = option_title;
                extension_attributes.configurable_item_options[co].option_value_name = option_value_name;
                // console.log("option_title: ", option_title, "     ", "option_value_name: ", option_value_name)
            }
        }
        extension_attributes.index_id = index
        product_options.push(extension_attributes)
        this.setState({ product_options })
        console.log("extension_atrributes after modification in Show More:", this.state.product_options);
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


    render() {
        var { order_detail } = this.props.route.params
        return (
            <View style={styles.mainContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.header_txt}>Order Details</Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    {/* Main Body */}

                    <View style={styles.inner_main}>
                        {/* Order No. Title */}
                        <Text style={styles.order_no}>Order #{order_detail?.increment_id}
                        </Text>
                        <View style={styles.order_status_cont}>
                            <Text style={[styles.order_no, { fontWeight: "300", fontSize: 14 }]}>{order_detail?.status == "payment_review" ? "Processing" : order_detail?.status}</Text>
                        </View>
                        <Text style={[styles.order_no, { marginTop: 10, fontSize: 16 }]}>{new Date(order_detail?.created_at).toDateString()}
                        </Text>
                    </View>

                    {/* Page Sheet */}
                    <View style={styles.page_sheet}>

                        {/* Selector Main Containers */}
                        <View style={styles.page_sheet_selector}>

                            {/* Switches */}

                            {/* Items Ordered */}
                            <TouchableOpacity
                                onPress={() => this.setState({ selector: "items_ordered" })}
                                style={[styles.page_sheet_selector_button, {
                                    borderTopLeftRadius: 5,
                                    borderRightWidth: 0.25,
                                    backgroundColor: this.state.selector == "items_ordered" ? "white" : "#c1c1c1"
                                }]}>
                                <Text style={styles.page_sheet_selector_button_txt}>Items Ordered</Text>
                            </TouchableOpacity>

                            {/* Invoices */}
                            <TouchableOpacity
                                onPress={() => this.setState({ selector: "invoices" })}
                                style={[styles.page_sheet_selector_button, {
                                    borderTopRightRadius: 5,
                                    borderLeftWidth: 0.25,
                                    backgroundColor: this.state.selector == "invoices" ? "white" : "#c1c1c1"
                                }]}>
                                <Text style={styles.page_sheet_selector_button_txt}>Invoices</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.page_sheet_view}>

                            {
                                this.state.selector == "items_ordered" &&
                                <ItemsOrdered
                                    order_detail_items={order_detail?.items}
                                    showMore={(options,index) => this.showMore(options,index)}
                                    product_options={this.state.product_options}
                                />
                            }
                            {
                                this.state.selector == "invoices" &&
                                <Invoices />
                            }

                        </View>

                    </View>
                </ScrollView>




            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Order_Details);

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "#f0f0f0"
    },
    header: {
        width: width,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#020621",
    },
    header_txt: {
        fontSize: 18,
        fontWeight: '600',
        color: "white",
    },
    order_no: {
        fontSize: 18,
        fontWeight: '400',
        letterSpacing: 0.5,
        color: "black",
    },
    order_status_cont: {
        padding: 5,
        borderWidth: 0.5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10
    },
    inner_main: {
        width: width - 20,
        alignItems: "flex-start",
        alignSelf: "center",
        marginTop: 20,
    },
    page_sheet: {
        width: width - 20,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 30,
    },
    page_sheet_selector: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        position: "absolute",
        zIndex: 100,
        top: 1.5

    },
    page_sheet_selector_button: {
        width: 120,
        height: 40,
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#c1c1c1",
        backgroundColor: "white"
    },
    page_sheet_selector_button_txt: {
        fontSize: 14,
        fontWeight: "500",
        color: "black",
    },
    page_sheet_view: {
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "white",
        // height: 200,
        borderWidth: 0.5,
        borderColor: "#c1c1c1",
        marginTop: 40
    },

})