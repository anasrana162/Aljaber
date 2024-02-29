import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
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
import api, { custom_api_url } from '../../api/api';
import axios from 'axios';
import Loading from '../../components_reusable/loading';
import products from './products';
import Drawer from '../../components_reusable/drawer';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class ProductDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {

            // Options Ended
            varient_brand: "",
            product_varients: null,
            product_varient_selected: null,
            varient_selected: false,
            imageKey: 0,

            cartLoader: false,
            eyedir: '',
            dropdown: false,
            optionSelected: null,

            //new states
            product_options: [],
            media_gallery_entries: [],
            selectedCPO: [{ "value_index": 0, "value_name": "Select" }],// configurable product options
            checked: false,
            product_details: '',
            description: '',
            quantity: 1,
            bigImage: "",
            openBigImageModal: false,
            description: '',
            main_info_temp: null,
            configurable_product_options: null,
            configurable_product_options_loader: false,
            option_selected: [],
            custom_options: [],
            configurable_item_options: [],
            selected_configurable_item_options: [],
            custom_options_left: [],
            custom_options_right: [],
            selectedItemLeft: [],
            selectedItemRight: [],
            cartCIO_Defaults: [],
            leftEyeQuantity: 1,
            rightEyeQuantity: 1,
            more_info_loader: false,
            refreshing: false,
            drawer: false,
        };
    }

    componentDidMount = () => {
        this.getProductDetails()

    }

    getProductDetails = async () => {
        var { product_details, product_details: { sku }, screenName } = this.props.route.params
        var { userData: { admintoken, allproducts } } = this.props
        console.log("product_details", sku.replace("/", "_"))


        var tempPRoducts = []

        setImmediate(() => {
            this.setState({
                loader: true,
            })
        })

        await api.get('/products/' + sku.replace("/", "_"), {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        }).then(async (prod) => {

            // then we check the array of custom_attributes in for loop to fetch the attribute Brand to show in the products
            // on the screen as it is not in the main body of the object
            var bigcheck = false
            for (let i = 0; i < prod?.data.custom_attributes.length; i++) {

                // in the loop we check for on abject having attribute_code "brands" then pickup it value having ID

                if (prod?.data.custom_attributes[i].attribute_code == 'brands') {
                    bigcheck = true
                    await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,).then(async (data) => {
                        prod.data.brand = data?.data
                        setImmediate(() => {
                            this.setState({
                                product_details: prod?.data
                            })
                        })
                        // Condition for fetching products with type_id:"simple"

                        // if (prod?.data?.visibility == 4 && prod?.data?.price > 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "simple") {
                        //     setImmediate(() => {
                        //         this.setState({
                        //             product_details: prod?.data
                        //         })
                        //     })
                        // }

                        // // Condition for fetching products with type_id:"Configurable"

                        // if (prod?.data?.price == 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "configurable") {

                        //     setImmediate(() => {
                        //         this.setState({
                        //             product_details: prod?.data,
                        //         })
                        //     })

                        //     // Checking value of configurable_product_links (product Varients)
                        //     for (let tp = 0; tp < prod?.data?.extension_attributes?.configurable_product_links?.length; tp++) {

                        //         // Comparing these ID's with the ID's of all products fetched redux which was from All products api from homescreen 
                        //         var selected_products = ""
                        //         if (allproducts.filter((value) => value?.id == prod?.data?.extension_attributes?.configurable_product_links[tp])[0] == undefined) {
                        //             alert("Error Fetching Data check network connection")
                        //             this.props.navigation.pop()
                        //         } else {
                        //             selected_products = allproducts.filter((value) => value?.id == prod?.data?.extension_attributes?.configurable_product_links[tp])[0]
                        //         }
                        //         // Condition
                        //         if (prod?.data?.extension_attributes?.configurable_product_links[tp] == selected_products?.id) {

                        //             // if id's match then the value "sku" is picked up from the matching product object and then we run an api
                        //             // to fetch details for the varient because they are not in the products object from all products api
                        //             var check = false

                        //             // Api for fetching product details

                        //             await api.get('/products/' + selected_products?.sku, {
                        //                 headers: {
                        //                     Authorization: `Bearer ${admintoken}`,
                        //                 },
                        //             }).then(async (cfPD) => {

                        //                 // once details are fetched we add brand value because its in custom_attributes object in product detail nested obj
                        //                 // and we have to run loop to first fetch the key then its id then run another api to fetch the brand name which is
                        //                 // long process already done above to save time while fetching for its main version of product

                        //                 cfPD.data.brand = data?.data // brand value
                        //                 cfPD.data.parent_product_id = prod?.data?.id
                        //                 cfPD.data.options = prod?.data?.options
                        //                 cfPD.data.type_id = prod?.data?.type_id
                        //                 // then we push all these product varients into a temporary array so the loop is complete reaching all of the id's in
                        //                 // the configurable_product_links then we push into main array otherwsie it will mix all the different products varients
                        //                 // together

                        //                 tempPRoducts.push(cfPD?.data)

                        //                 // here's the condition once the configurable_product_links array reach its end
                        //                 if (tp == prod?.data?.extension_attributes?.configurable_product_links?.length - 1) {

                        //                     //we also change the value of price of the main product because products with type_id have "0" price
                        //                     // so we take a price from its varient overwrite (Note price of all vareints are same)
                        //                     prod.data.price = cfPD.data?.price

                        //                     // then we create an of product_varients and push into main product's object to show and display the varients in
                        //                     // product details screen
                        //                     prod.data.product_varients = tempPRoducts

                        //                     // then we push this product into main products array with all of these things so it can be displayed
                        //                     // in the Products Detail screen

                        //                     setImmediate(() => {
                        //                         this.setState({
                        //                             product_details: prod?.data
                        //                         })
                        //                     })

                        //                     // Emptying the temporary array that we pushed products varients so the varients of other products
                        //                     // dont get added in the other products
                        //                     tempPRoducts = []

                        //                     // setting value of check to true from false to break the loop once it reaches its end
                        //                     check = true
                        //                 }

                        //             }).catch((err) => {
                        //                 console.log("Configurable Product Details Api Error", err)
                        //             })

                        //             console.log("CHeck", check)
                        //             // this condition break the loop from further adding more products
                        //             if (check == true) {

                        //                 break;
                        //             }
                        //         } else {

                        //         }
                        //     }

                        // }
                    }).catch((err) => {
                        console.log("DAta for Brands Api errr", err)
                    })
                    break;
                }
                if (bigcheck == true) {
                    break;
                }
            }
            setImmediate(() => {
                this.setState({
                    loader: false,
                    refreshing: false,
                })
            })
            this.createVarients()
            this.getDescription('prop')
            this.checkOptions('prop')
            this.getMain_Info('prop')
            // this.checkVarients('prop')
            this.productImages("prop")
            // this.check_Configurable_Product_Options()


        }).catch((err) => {
            console.log("Product Detail Api error on:  ", sku, err)
            alert("Error Fetching Data Try again")
            this.props.navigation.pop()
            // this.getProductDetails()
            return setImmediate(() => {
                this.setState({
                    loader: false,
                    refreshing: false
                })

            })

        })


    }


    createVarients = async () => {
        var { product_details } = this.state
        var { userData: { admintoken, allproducts } } = this.props
        var tempPRoducts = []
        // Checking value of configurable_product_links (product Varients)
        var check = false
        setImmediate(() => {
            this.setState({
                configurable_product_options_loader: true,
            })
        })
        console.log("Checking Varients", product_details?.extension_attributes?.configurable_product_links)
        if (product_details?.extension_attributes?.configurable_product_links == undefined) {
            return setImmediate(() => {
                this.setState({
                    configurable_product_options_loader: false,
                })
            })
        }
        for (let tp = 0; tp < product_details?.extension_attributes?.configurable_product_links?.length; tp++) {

            // Comparing these ID's with the ID's of all products fetched redux which was from All products api from homescreen 
            const selected_products = allproducts.filter((value) => value?.id == product_details?.extension_attributes?.configurable_product_links[tp])[0]

            // Condition
            if (product_details?.extension_attributes?.configurable_product_links[tp] == selected_products?.id) {

                // if id's match then the value "sku" is picked up from the matching product object and then we run an api
                // to fetch details for the varient because they are not in the products object from all products api

                // Api for fetching product details

                await api.get('/products/' + selected_products?.sku, {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                }).then(async (cfPD) => {

                    // once details are fetched we add brand value because its in custom_attributes object in product detail nested obj
                    // and we have to run loop to first fetch the key then its id then run another api to fetch the brand name which is
                    // long process already done above to save time while fetching for its main version of product

                    // cfPD.data.brand = data?.data // brand value
                    cfPD.data.parent_product_id = product_details?.id
                    cfPD.data.options = product_details?.options
                    cfPD.data.type_id = product_details?.type_id
                    // then we push all these product varients into a temporary array so the loop is complete reaching all of the id's in
                    // the configurable_product_links then we push into main array otherwsie it will mix all the different products varients
                    // together
                    // console.log("cfPD?.data", cfPD?.data)

                    tempPRoducts.push(cfPD?.data)

                    // here's the condition once the configurable_product_links array reach its end
                    if (tp == product_details?.extension_attributes?.configurable_product_links?.length - 1) {

                        //we also change the value of price of the main product because products with type_id have "0" price
                        // so we take a price from its varient overwrite (Note price of all vareints are same)
                        product_details.price = cfPD.data?.price

                        // then we create an of product_varients and push into main product's object to show and display the varients in
                        // product details screen
                        product_details.product_varients = tempPRoducts

                        // then we push this product into main products array with all of these things so it can be displayed
                        // in the Products Detail screen
                        setImmediate(() => {
                            this.setState({
                                product_details,
                                configurable_product_options_loader: false,
                            })
                        })
                        this.check_Configurable_Product_Options()

                        // Emptying the temporary array that we pushed products varients so the varients of other products
                        // dont get added in the other products
                        tempPRoducts = []

                        // setting value of check to true from false to break the loop once it reaches its end
                        check = true
                    }

                }).catch((err) => {
                    console.log("Configurable Product Details Api Error", err)
                })

                console.log("CHeck", check)
                // this condition break the loop from further adding more products

            } else {

            }
            if (check == true) {

                break;
            }
        }
    }


    check_Configurable_Product_Options = async () => {
        var { product_details: { extension_attributes } } = this.state
        if (extension_attributes?.configurable_product_options == undefined || extension_attributes?.configurable_product_options.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false,
                })
            })
            return console.log("No options for color custom options")
        } else {
            var { configurable_product_options } = extension_attributes
            // console.log("configurable_product_options", configurable_product_options)

            for (let cpo = 0; cpo < configurable_product_options.length; cpo++) {
                // console.log("configurable_product_options[cpo]?.values", configurable_product_options[cpo]?.values)
                for (let cpov = 0; cpov < configurable_product_options[cpo]?.values.length; cpov++) {
                    var value_name = await axios.get(custom_api_url + "func=option_label&id=" + configurable_product_options[cpo]?.values[cpov]?.value_index)
                    configurable_product_options[cpo].values[cpov].value_name = value_name?.data
                    if (configurable_product_options[cpo]?.label == "Color") {
                        var color_code = await axios.get(custom_api_url + "func=option_color&id=" + configurable_product_options[cpo]?.values[cpov]?.value_index)
                        configurable_product_options[cpo].values[cpov].color_code = color_code?.data

                    }
                    // console.log("value_name", value_name?.data)
                }
            }
            // console.log("configurable_product_options", configurable_product_options)

            setImmediate(() => {
                this.setState({
                    configurable_product_options: configurable_product_options,

                })

            })




        }
    }

    checkOptions = (key) => {
        var { screenName, product_details } = this.props.route.params
        var { product_details: { options } } = this.state
        // console.log("OPtions For Product", options)

        if (screenName !== undefined || screenName == "Cart") {
            this.checkCartScreenOption(product_details, options)
        }

        setImmediate(() => {
            this.setState({
                product_options: options,
            })
        })


    }
    checkCartScreenOption = (product_details_recieved, options) => {
        var { custom_options, cartCIO_Defaults } = this.state

        // console.log("product_details Cart ", product_details_recieved, `${"\n"}`, "       ", options)
        setImmediate(() => {
            this.setState({ quantity: product_details_recieved?.qty })
        })
        if (product_details_recieved?.product_option != undefined) {

            // console.log("product_details Cart extension_attributes", product_details_recieved?.product_option?.extension_attributes)
            var custom_options_cio = product_details_recieved?.product_option?.extension_attributes?.custom_options

            for (let i = 0; i < options?.length; i++) {

                // console.log("")
                // console.log("-----------------------")
                // console.log("options  ", options[i])
                // console.log("-----------------------")
                // console.log("")
                for (let k = 0; k < custom_options_cio.length; k++) {
                    if (options[i]?.title == custom_options_cio[k]?.option_title) {
                        // console.log("")
                        // console.log("-----------------------")
                        // console.log("Option Picked:     ", options[i]?.title)
                        // console.log("custom_options_cio[i]", custom_options_cio[i])
                        // console.log("-----------------------")
                        // console.log("")

                        let obj = {
                            "option_id": custom_options_cio[i]?.option_id,
                            "option_value": custom_options_cio[i]?.option_value,
                        }
                        // console.log("custom_options_cio[i] obj push", obj)
                        custom_options.push(obj)

                        let obj1 = {
                            "option_title": custom_options_cio[i]?.option_title,
                            "option_value_name": custom_options_cio[i]?.option_value_name
                        }
                        // console.log("custom_options_cio[i] obj1 push", obj1)
                        cartCIO_Defaults.push(obj1)

                    }
                }
            }
        }
    }

    productImages = (key) => {
        var { product_details: { media_gallery_entries } } = this.state
        switch (key) {
            case "prop":
                setImmediate(() => {
                    this.setState({
                        media_gallery_entries: media_gallery_entries,
                    })
                })
                break;

            case "varient":
                setImmediate(() => {
                    this.setState({
                        media_gallery_entries: [...this.state.product_varient_selected?.media_gallery_entries, ...media_gallery_entries],
                        imageKey: this.state.imageKey + 1
                    })
                })

        }
    }

    getDescription = (key) => {
        var { product_details: { custom_attributes, } } = this.state
        // console.log("product_details Images Length", media_gallery_entries.length)
        // console.log("product_details description", this.state.product_varient_selected)

        var x = '';

        switch (key) {
            case "prop":
                x = custom_attributes
                break;

            case "varient":
                // x = custom_attributes
                x = this.state.product_varient_selected?.custom_attributes
        }
        // console.log("XX",this.state.product_varient_selected)

        for (let i = 0; i < x.length; i++) {
            if (x[i]?.attribute_code == "description") {
                setImmediate(() => {
                    this.setState({ description: x[i]?.value })
                })
                // console.log("description", x[i]?.value)
                break;
            }
        }
    }

    getMain_Info = async (key) => {
        var { product_details: { custom_attributes } } = this.state
        const { userData: { admintoken }, } = this.props

        setImmediate(() => {
            this.setState({
                more_info_loader: true
            })
        })
        var { main_info_temp } = this.state
        var x = '';

        switch (key) {
            case "prop":
                x = custom_attributes
                break;

            case "varient":
                x = this.state.product_varient_selected?.custom_attributes
        }
        let temp = []
        for (let i = 0; i < x.length; i++) {

            // console.log("Attribute Codes",x[i]?.attribute_code)

            if (x[i]?.attribute_code == "brands") {

                temp.push(x[i])

                //  console.log("brands", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "color") {

                temp.push(x[i])

                // console.log("color", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "size") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "model_no") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "frame_color") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "frame_shape") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "frame_type") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "frame_material") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "bridge_size") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "lens_size") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "lense_color") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "temple_color") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "temple_material") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "polarized") {

                temp.push(x[i])

                // console.log("size", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "contact_lenses") {

                temp.push(x[i])

                // console.log("brands", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "contact_lens_diameter") {

                temp.push(x[i])

                // console.log("contact_lens_diameter", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "contact_lens_base_curve") {

                temp.push(x[i])

                // console.log("contact_lens_base_curve", custom_attributes[i])
                // break;
            }

            if (x[i]?.attribute_code == "water_container_content") {

                temp.push(x[i])

                // console.log("water_container_content", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "contact_lens_usage") {

                temp.push(x[i])

                // console.log("contact_lens_usage", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "box_content_pcs") {

                temp.push(x[i])

                // console.log("box_content_pcs", custom_attributes[i])
                // break;
            }
            if (x[i]?.attribute_code == "chain_size") {

                temp.push(x[i])

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
                            if (temp[j]?.attribute_code == "size") {

                                obj = {
                                    "id": 3,
                                    "size": res?.data[k]?.label
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
                            if (temp[j]?.attribute_code == "model_no") {

                                obj = {
                                    "id": 10,
                                    "model_no": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "frame_color") {

                                obj = {
                                    "id": 11,
                                    "frame_color": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "frame_shape") {

                                obj = {
                                    "id": 12,
                                    "frame_shape": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "frame_type") {

                                obj = {
                                    "id": 13,
                                    "frame_type": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "frame_material") {

                                obj = {
                                    "id": 14,
                                    "frame_material": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "bridge_size") {

                                obj = {
                                    "id": 15,
                                    "bridge_size": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "lens_size") {

                                obj = {
                                    "id": 16,
                                    "lens_size": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "lense_color") {

                                obj = {
                                    "id": 17,
                                    "lense_color": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "temple_color") {

                                obj = {
                                    "id": 18,
                                    "temple_color": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "temple_material") {

                                obj = {
                                    "id": 19,
                                    "temple_material": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "polarized") {

                                obj = {
                                    "id": 20,
                                    "polarized": res?.data[k]?.label
                                }

                                items.push(obj)
                                break;
                            }
                            if (temp[j]?.attribute_code == "chain_size") {

                                obj = {
                                    "id": 21,
                                    "chain_size": res?.data[k]?.label
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
            this.setState({ main_info_temp: items, more_info_loader: false })
        })
    }

    plusOne = () => {
        var { product_details: { extension_attributes: { stock_item } }, quantity } = this.state
        // var qty = stock_item?.qty
        // console.log("qty", qty, " ", quantity)
        // if (quantity <= qty) {
            quantity = quantity + 1
            setImmediate(() => {
                this.setState({
                    quantity
                })
            })
        // } else {
        //     console.log("Quantity Exceeded Maximum limit")
        // }

    }

    minusOne = () => {
        var { quantity } = this.state
        // console.log("qty", " ", quantity)
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
                // console.log("RIgth Quantity", val, "   ", key)
                setImmediate(() => {
                    this.setState({
                        rightEyeQuantity: val,
                    })
                })
                break;

        }
    }

    checkMarked = (val) => {
        // console.log("VALED", val)
        setImmediate(() => {
            this.setState({
                checked: val
            })
        })
    }

    selectItem = (item, index, title, option_id) => {
        var { finalItemLeftPower, finalItemRightPower, configurable_item_options, selected_configurable_item_options, custom_options_left, custom_options_right, selectedCPO, selectedItemLeft, selectedItemRight } = this.state
        // console.log(this.state.eyedir)


        switch (this.state.eyedir) {
            case "left":
                // console.log("Item in selectItem Left", item, `${"\n"}`, "Title:", title)
                let check_cl_array_index = ''
                let check_already_selected_options_Left = ''
                let temp1 = selectedItemLeft.filter((val, index) => {
                    if (val?.title == title) {
                        check_already_selected_options_Left = { "value": val, "index": index }
                    }
                })[0]

                if (check_already_selected_options_Left?.value?.title == title) {
                    selectedItemLeft.splice(check_already_selected_options_Left?.index, 1)
                    selectedItemLeft.push({ val: item, title: title })

                    let option_obj = {
                        "option_id": option_id,
                        "option_value": item?.option_type_id
                    }

                    var check_cr = custom_options_left.filter((val, index) => {
                        if (val?.option_id == option_obj?.option_id) {
                            check_cl_array_index = index
                        }
                    })
                    // console.log("custom_options_left before splice", custom_options_left)

                    custom_options_left.splice(check_cl_array_index, 1)
                    // console.log("custom_options_left after splice", custom_options_left)
                    custom_options_left.push(option_obj)
                    // console.log("custom_options_left after push", custom_options_left)
                    check_cl_array_index = ''
                    check_already_selected_options_Left = ''
                    setImmediate(() => {
                        this.setState({
                            selectedItemLeft,
                            custom_options_left,
                            dropdown: false,
                        })
                    })
                } else {
                    selectedItemLeft.push({ val: item, title: title })
                    let option_obj = {
                        "option_id": option_id,
                        "option_value": item?.option_type_id
                    }
                    custom_options_left.push(option_obj)
                    setImmediate(() => {
                        this.setState({
                            selectedItemLeft,
                            custom_options_left,
                            dropdown: false,
                        })
                    })
                }


                break;


            case "right":
                // console.log("Item in selectItem Right", item)
                let check_already_selected_options_Right = ''
                let check_cr_array_index = ''
                let temp2 = selectedItemRight.filter((val, index) => {
                    if (val?.title == title) {
                        check_already_selected_options_Right = { "value": val, "index": index }
                    }
                })[0]

                if (check_already_selected_options_Right?.value?.title == title) {
                    selectedItemRight.splice(check_already_selected_options_Right?.index, 1)
                    selectedItemRight.push({ val: item, title: title })
                    let option_obj = {
                        "option_id": option_id,
                        "option_value": item?.option_type_id
                    }

                    var check_cr = custom_options_right.filter((val, index) => {
                        if (val?.option_id == option_obj?.option_id) {
                            check_cr_array_index = index
                        }
                    })
                    // console.log("custom_options_right before splice", custom_options_right)
                    custom_options_right.splice(check_cr_array_index, 1)
                    // console.log("custom_options_right after splice", custom_options_right)
                    custom_options_right.push(option_obj)
                    check_cr_array_index = ''
                    check_already_selected_options_Right = ''
                    setImmediate(() => {
                        this.setState({
                            selectedItemRight,
                            custom_options_right,
                            dropdown: false,
                        })
                    })
                } else {
                    selectedItemRight.push({ val: item, title: title })
                    let option_obj = {
                        "option_id": option_id,
                        "option_value": item?.option_type_id
                    }
                    custom_options_right.push(option_obj)
                    setImmediate(() => {
                        this.setState({
                            selectedItemRight,
                            custom_options_right,
                            dropdown: false,
                        })
                    })
                }
                break;


            case "CPO":

                // console.log("Item in selectItem CPO", item)
                // Check for already existing title and replace it so there are
                // no duplicate values of same title
                let check_already_selected_options = ''
                let check_cio_array_index = ''
                let temp = selectedCPO.filter((val, index) => {
                    if (val?.title == title) {
                        check_already_selected_options = { "value": val, "index": index }
                    }
                })[0]

                // option_id in this case is attribute_id of configurable item options

                let option_obj = {
                    "option_id": option_id,
                    "option_value": item?.value_index
                }
                // console.log('option_obj in CPO', option_obj)

                if (check_already_selected_options?.value?.title == title) {

                    selectedCPO.splice(check_already_selected_options?.index, 1)
                    selectedCPO.push({ val: item, title: title })

                    var check_cio = configurable_item_options.filter((data, index) => {
                        if (data?.option_id == option_obj?.option_id) {
                            check_cio_array_index = index
                        }
                    })
                    // console.log("check_cio_array_index", check_cio_array_index)
                    configurable_item_options.splice(check_cio_array_index, 1)
                    configurable_item_options.push(option_obj)

                    check_already_selected_options = ''
                    setImmediate(() => {
                        this.setState({
                            configurable_item_options,
                            selectedCPO,
                            dropdown: false,
                        })
                    })

                } else {

                    selectedCPO.push({ val: item, title: title })
                    configurable_item_options.push(option_obj)
                    setImmediate(() => {
                        this.setState({
                            configurable_item_options,
                            selectedCPO,
                            dropdown: false,
                        })
                    })
                }

                break;



        }
    }

    openDropDown = (val, title, eyedir, option_id) => {
        // console.log(title, ":  ", val, ", ", eyedir)
        setImmediate(() => {
            this.setState({ dropdown: !this.state.dropdown, optionSelected: { "val": val, "title": title, option_id: option_id }, eyedir: eyedir })
        })
    }

    dismissModal = (key) => {
        switch (key) {
            case "eye":
                setImmediate(() => {
                    this.setState({ dropdown: false, })
                })
                break;
            case "image":
                setImmediate(() => {
                    this.setState({ openBigImageModal: false, })
                })
                break;
        }
    }

    onImagePress = (selected) => {
        // console.log("Selected Outside", selected)
        setImmediate(() => {
            this.setState({ bigImage: selected, openBigImageModal: true })
        })
    }

    selectedVarient = async (data, index, attribute_id, title) => {

        var { configurable_item_options, selected_configurable_item_options, product_varient_selected, product_details: { product_varients } } = this.state

        // console.log("VArient Selected", data, `${"\n"}`, "    attribute_id: ", attribute_id, `${"\n"}`, "    title:", title)

        // select Varient Functionality

        var attribute_code = await axios.get(custom_api_url + "func=attribute_code&id=" + attribute_id)
        console.log("attribute_code:", attribute_code?.data)

        if (product_varients == undefined || product_varients.length == 0) {
            alert("Cannot select varient please check network connection")
            return console.log("this has no varients")
        } else {

            for (let pd = 0; pd < product_varients.length; pd++) {
                var { custom_attributes } = product_varients[pd]
                console.log("product_varients", custom_attributes)

                var filter = custom_attributes.filter((val, index) =>
                    val?.attribute_code == attribute_code?.data && val?.value == data?.value_index)[0]
                // console.log("FIlter Result", filter)

                if (filter?.attribute_code == attribute_code?.data && filter?.value == data?.value_index) {
                    // console.log("found it", product_varients[pd]?.media_gallery_entries)
                    product_varient_selected = product_varients[pd]

                    break;
                }

            }

        }

        let check_already_selected_options = ''
        let check_cio_array_index = ''

        let option_obj = {
            "option_id": attribute_id,
            "option_value": data?.value_index
        }
        // console.log("option obj for cio", option_obj)


        var temp = selected_configurable_item_options.filter((val, index) => {
            if (val?.title == title) {
                check_already_selected_options = { "value": val, "index": index }
            }
        })

        if (check_already_selected_options?.value?.title == title) {

            selected_configurable_item_options.splice(check_already_selected_options?.index, 1)
            selected_configurable_item_options.push({ val: data, title: title })

            var check_cio = configurable_item_options.filter((data, index) => {
                if (data?.option_value == option_obj?.option_value) {
                    check_cio_array_index = index
                }
            })

            configurable_item_options.splice(check_cio_array_index, 1)
            configurable_item_options.push(option_obj)
            setImmediate(() => {
                this.setState({
                    configurable_item_options,
                    selected_configurable_item_options,
                    product_varient_selected,
                    varient_selected: true
                })
            })

        } else {
            configurable_item_options.push(option_obj)
            selected_configurable_item_options.push({ val: data, title: title })
            setImmediate(() => {
                this.setState({
                    configurable_item_options,
                    selected_configurable_item_options,
                    varient_selected: true,
                    product_varient_selected

                })
            })
        }

        setTimeout(() => {
            // this.getDescription("varient")
            this.getMain_Info("varient")
            // // this.checkOptions("varient")
            this.productImages("varient")
        }, 1000)
    }

    isUserLoggedIn = (product, index) => {
        var { userData: { user, } } = this.props
        if (Object.keys(user).length == 0) {
            this.addToCartGuest(product, index)
        } else {
            this.addToCart(product, index)
        }
    }

    addToCartGuest = (product, index) => {

        var { userData: { admintoken, guestcartkey, guestcartid } } = this.props

        setImmediate(() => {
            this.setState({ loader: true })
        })

        if (admintoken !== null || guestcartkey !== null) {

            // if product selected doesn't have options
            if (this.state.product_details?.options?.length == 0) {

                let obj = {
                    "cartItem": {
                        "sku": product?.sku,
                        "qty": this.state.quantity,
                        "name": product?.name,
                        "price": product?.price,
                        "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                        "quote_id": guestcartid?.id
                    }
                }
                // console.log("this product does not have options", obj)

                this.addToCartGuestApi(obj)

            } else {

                // if product selected have options

                let obj = {}
                // console.log("this.state.checked", typeof this.state.checked)
                if (this.state.checked == true) {
                    let breaker = false
                    // console.log("Reached Here", this.state.custom_options_left.length, " ", this.state.custom_options_right.length)

                    if (this.state.custom_options_left.length !== 0 && this.state.custom_options_right.length !== 0) {
                        let check = false;

                        for (let l = 0; l < this.state.selectedItemLeft.length; l++) {
                            var findRight = this.state.selectedItemRight.filter((data) => data?.val?.option_type_id == this.state.selectedItemLeft[l]?.val?.option_type_id)[0]
                            // console.log("findRight", findRight)
                            if (findRight == undefined) {
                                check = false
                                break;
                            } else {
                                check = true
                            }
                        }

                        if (check == true
                        ) {
                            obj = {
                                "cartItem": {
                                    "sku": product?.sku,
                                    "qty": this.state.leftEyeQuantity + this.state.rightEyeQuantity,
                                    "name": product?.name,
                                    "price": product?.price,
                                    "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                                    "quote_id": guestcartid?.id,
                                    "product_option": {
                                        "extension_attributes": {
                                            "custom_options": this.state.custom_options_left,
                                            "configurable_item_options": this.state.configurable_item_options
                                        }
                                    }
                                }
                            }
                            console.log("obj for left and right have same values", obj?.cartItem)
                            this.addToCartGuestApi(obj)
                            // break;
                        }
                        else {

                            obj = {
                                "cartItem": {
                                    "sku": product?.sku,
                                    "qty": this.state.leftEyeQuantity,
                                    "name": product?.name,
                                    "price": product?.price,
                                    "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                                    "quote_id": guestcartid?.id,
                                    "product_option": {
                                        "extension_attributes": {
                                            "custom_options": this.state.custom_options_left,
                                            "configurable_item_options": this.state.configurable_item_options
                                        }
                                    }
                                }
                            }
                            // console.log("obj for left", obj?.cartItem)
                            // console.log("obj for left", obj?.cartItem?.product_option?.extension_attributes)

                            this.addToCartGuestApi(obj)

                            obj = {
                                "cartItem": {
                                    "sku": product?.sku,
                                    "qty": this.state.rightEyeQuantity,
                                    "name": product?.name,
                                    "price": product?.price,
                                    "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                                    "quote_id": guestcartid?.id,
                                    "product_option": {
                                        "extension_attributes": {
                                            "custom_options": this.state.custom_options_right,
                                            "configurable_item_options": this.state.configurable_item_options
                                        }
                                    }
                                }
                            }
                            // console.log("obj for right", obj?.cartItem)
                            // console.log("obj for right", obj?.cartItem?.product_option?.extension_attributes)

                            this.addToCartGuestApi(obj)
                        }
                    } else {
                        alert("Please Select Values for Left and Right Eye")
                    }

                } else {
                    if (this.state.custom_options.length !== 0) {

                        obj = {
                            "cartItem": {
                                "sku": product?.sku,
                                "qty": this.state.quantity,
                                "name": product?.name,
                                "price": product?.price,
                                "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                                "quote_id":guestcartid?.id,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": this.state.custom_options,
                                        "configurable_item_options": this.state.configurable_item_options
                                    }
                                }
                            }
                        }

                        // console.log("when checked false  obj", obj?.cartItem?.product_option?.extension_attributes)
                        this.addToCartGuestApi(obj)
                    } else {
                        setImmediate(() => {
                            this.setState({
                                loader: false,
                            })
                        })
                        alert("Select Options for Product")
                    }

                }


            }

        } else {
            console.log("addToCartGuest productDetails cart key or token is invalid or null");
        }



    }
    addToCartGuestApi = async (obj) => {
        var { userData } = this.props

        api.post("guest-carts/" + userData?.guestcartkey + "/items", obj, {
            headers: {
                Authorization: `Bearer ${userData?.admintoken}`,
            },
        }).then((response) => {
            console.log(" addToCartGuestApi productDetails Item API response : ", response?.data)
            alert("Product Added to Cart!")
            setImmediate(() => {
                this.setState({
                    cartLoader: false,
                    loader: false
                })
            })
        }).catch((err) => {
            alert(err?.response?.data?.message)
            console.log("addToCartGuestApi productDetails api error:  ", err.response)
            setImmediate(() => {
                this.setState({
                    cartLoader: false,
                    loader: false
                })
            })
        })

    }
    addToCart = (product, index) => {

        var { userData: { token, user: { cartID } } } = this.props

        setImmediate(() => {
            this.setState({ loader: true })
        })

        if (this.state.product_details?.options?.length == 0) {

            let obj = {
                "cartItem": {
                    "sku": product?.sku,
                    "qty": this.state.quantity,
                    "name": product?.name,
                    "price": product?.price,
                    "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                    "quote_id": cartID
                }
            }
            // console.log("this product does not have options", obj)

            this.addToCartApi(obj)

        } else {
            let obj = {}
            // console.log("this.state.checked", typeof this.state.checked)
            if (this.state.checked == true) {
                let breaker = false
                // console.log("Reached Here", this.state.custom_options_left.length, " ", this.state.custom_options_right.length)

                if (this.state.custom_options_left.length !== 0 && this.state.custom_options_right.length !== 0) {
                    let check = false;

                    for (let l = 0; l < this.state.selectedItemLeft.length; l++) {
                        var findRight = this.state.selectedItemRight.filter((data) => data?.val?.option_type_id == this.state.selectedItemLeft[l]?.val?.option_type_id)[0]
                        // console.log("findRight", findRight)
                        if (findRight == undefined) {
                            check = false
                            break;
                        } else {
                            check = true
                        }
                    }

                    if (check == true
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": product?.sku,
                                "qty": this.state.leftEyeQuantity + this.state.rightEyeQuantity,
                                "name": product?.name,
                                "price": product?.price,
                                "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                                "quote_id": cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": this.state.custom_options_left,
                                        "configurable_item_options": this.state.configurable_item_options
                                    }
                                }
                            }
                        }
                        console.log("obj for left and right have same values", obj?.cartItem)
                        this.addToCartApi(obj)
                        // break;
                    }
                    else {

                        obj = {
                            "cartItem": {
                                "sku": product?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": product?.name,
                                "price": product?.price,
                                "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                                "quote_id": cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": this.state.custom_options_left,
                                        "configurable_item_options": this.state.configurable_item_options
                                    }
                                }
                            }
                        }
                        // console.log("obj for left", obj?.cartItem)
                        // console.log("obj for left", obj?.cartItem?.product_option?.extension_attributes)

                        this.addToCartApi(obj)

                        obj = {
                            "cartItem": {
                                "sku": product?.sku,
                                "qty": this.state.rightEyeQuantity,
                                "name": product?.name,
                                "price": product?.price,
                                "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                                "quote_id": cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": this.state.custom_options_right,
                                        "configurable_item_options": this.state.configurable_item_options
                                    }
                                }
                            }
                        }
                        // console.log("obj for right", obj?.cartItem)
                        // console.log("obj for right", obj?.cartItem?.product_option?.extension_attributes)

                        this.addToCartApi(obj)
                    }
                } else {
                    alert("Please Select Values for Left and Right Eye")
                }

            } else {
                if (this.state.custom_options.length !== 0) {

                    obj = {
                        "cartItem": {
                            "sku": product?.sku,
                            "qty": this.state.quantity,
                            "name": product?.name,
                            "price": product?.price,
                            "product_type": product?.type_id == undefined ? product?.type : product?.type_id,
                            "quote_id": cartID,
                            "product_option": {
                                "extension_attributes": {
                                    "custom_options": this.state.custom_options,
                                    "configurable_item_options": this.state.configurable_item_options
                                }
                            }
                        }
                    }

                    // console.log("when checked false  obj", obj?.cartItem?.product_option?.extension_attributes)
                    this.addToCartApi(obj)
                } else {
                    setImmediate(() => {
                        this.setState({
                            loader: false,
                        })
                    })
                    alert("Select Options for Product")
                }

            }


        }


    }

    addToCartApi = async (obj) => {
        var { userData } = this.props
        await api.post("carts/mine/items", obj, {
            headers: {
                Authorization: `Bearer ${userData?.token}`,
            },
        }).then((response) => {
            alert("Product Added to Cart")
            setImmediate(() => {
                this.setState({
                    cartLoader: false,
                    loader: false
                })
            })

        }).catch((err) => {
            // if (err?.response?.data?.message == "You need to choose options for your item.")
            alert(err?.response?.data?.message)
            console.log("Add to cart item api error:  ", err.response)
            setImmediate(() => {
                this.setState({
                    cartLoader: false,
                    loader: false
                })
            })

        })
    }

    setWholeItemSelected = async (item, option_id) => {

        var { custom_options, option_selected } = this.state
        let obj = {
            "option_id": option_id,
            "option_value": item?.option_type_id,
        }
        var check_already_selected_options = ""
        var temp = custom_options.filter((val, index) => {
            if (val?.option_id == option_id) {
                check_already_selected_options = { "value": val, "index": index }
            }
        })

        // if option_id already exist for example for Power it will replace it with new if users selects new value
        if (option_id == check_already_selected_options?.value?.option_id) {
            custom_options.splice(check_already_selected_options?.index, 1)
            custom_options.push(obj)
            setImmediate(() => {
                this.setState({
                    custom_options,
                })
            });
        } else {
            custom_options.push(obj)
            setImmediate(() => {
                this.setState({
                    custom_options,
                })
            });
        }

    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }

    render() {

        var {
            product_details,
            product_index,

        } = this.props?.route?.params

        var {
            product_varient_selected,
            media_gallery_entries,
            // product_details: { },
        } = this.state

        var { userData: { user, admintoken, token } } = this.props

        // console.log("USER OBJECT:", user)

        const tagsStyles = {
            body: {
                color: "black",
                alignItems: "center",
                width: "95%",
                fontFamily: "Careem-Bold",
                marginTop: 10,
                textAlign: "justify",
                alignSelf: "center"
            },
            a: {
                color: "green",
            },
        };
        return (

            <View style={styles.mainContainer}>
                {this.state.loader && <Loading />}
                {/* Header */}
                <HomeHeader navProps={this.props.navigation} openDrawer={() => this.openDrawer()} />

                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={

                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.setState({ refreshing: true })
                                this.getProductDetails()
                            }}
                        />

                    }
                    style={{ width: width - 20, }}>

                    <ImageCarousel
                        usage="openModal"
                        key={String(this.state.imageKey)}
                        data={media_gallery_entries}
                        onImagePress={(selected) => this.onImagePress(selected)}
                        varient_selected={this.state.varient_selected}
                        fisrtImage={this.state.product_varient_selected == null ?
                            {
                                id: 1,
                                url: product_details?.media_gallery_entries == undefined ? product_details?.image : product_details?.media_gallery_entries[0]?.file,
                                index: 0,
                            }
                            :
                            {
                                id: this.state.product_varient_selected?.media_gallery_entries.length == 0 ? 1 : this.state.product_varient_selected?.media_gallery_entries[0].id,
                                url: this.state.product_varient_selected?.media_gallery_entries.length == 0 ? product_details?.image : this.state.product_varient_selected?.media_gallery_entries[0]?.file,
                                index: 0,
                            }}
                    />




                    {/* Product Name */}
                    < Text style={[styles.product_name, {
                        marginTop: 10,
                    }]}>{product_details?.name}</Text>

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
                        <Text style={[styles.product_name, { fontSize: 20 }]}>AED {product_varient_selected !== null ? product_varient_selected?.price : product_details?.price}</Text>

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
                                onPress={() => this.isUserLoggedIn(product_details, product_index)}
                                style={styles.add_to_cart}
                            >
                                {
                                    this.state.cartLoader == true ?
                                        <ActivityIndicator size={"small"} color={'#ffffff'} />
                                        :
                                        <Text style={styles.add_to_cart_text}>AddToCart</Text>
                                }

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
                            color: this.state.product_details?.extension_attributes?.stock_item?.is_in_stock == true ? "#020621" : "red"
                        }]}>
                            {this.state.product_details?.extension_attributes?.stock_item?.is_in_stock == true ? " IN STOCK" : " OUT OF STOCK"}
                        </Text>
                    </Text>

                    {/* Options */}
                    <Options
                        configurable_product_options={this.state.configurable_product_options}
                        configurable_product_options_loader={this.state.configurable_product_options_loader}
                        checkMarked={(val) => this.checkMarked(val)}
                        product_options={this.state.product_options}
                        leftEyeQuantity={this.state.leftEyeQuantity}
                        rigthEyeQuantity={this.state.rightEyeQuantity}
                        dropdown={this.state.dropdown}
                        selectedCPO={this.state.selectedCPO}
                        selectedItemRight={this.state.selectedItemRight}
                        selectedItemLeft={this.state.selectedItemLeft}
                        onChangeText={(val, key) => this.onQuantityChange(val, key)}
                        openDropDown={(val, title, eyedir, option_id) => this.openDropDown(val, title, eyedir, option_id)}
                        cartCIO_Defaults={this.state.cartCIO_Defaults}
                        setWholeItemSelected={(item, option_id) => this.setWholeItemSelected(item, option_id)}
                        selectedVarient={(data, index, attribute_id, title) => this.selectedVarient(data, index, attribute_id, title)}
                    />

                    {/* Store Features */}
                    {/* <StoreFeatures /> */}

                    {/* DetailsNav */}
                    {this.state.more_info_loader ?
                        <ActivityIndicator size={"small"} color="black" style={{ marginVertical: 10, }} />
                        :
                        <DetailsTabNav
                            navProps={this.props.navigation}
                            details_tab={this.state.description}
                            productName={product_details?.name}
                            nickName={user?.firstname}
                            productId={product_details?.id}
                            main_infor={this.state.main_info_temp}
                        />}

                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.openBigImageModal}
                    onDismiss={() => this.dismissModal("image")}
                >
                    <TouchableOpacity
                        onPress={() => this.dismissModal("image")}
                        style={{
                            width: width,
                            height: Dimensions.get("screen").height,
                            backgroundColor: "rgba(52,52,52,0.8)",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>

                    </TouchableOpacity>
                    <ImageCarousel
                        usage="open"
                        data={media_gallery_entries}
                        onImagePress={(selected) => this.onImagePress(selected)}
                        fisrtImage={this.state.bigImage}
                        style={{ position: "absolute", zIndex: 400, marginTop: height / 4.2, marginLeft: 5 }}
                    />
                </Modal>

                {this.state.optionSelected !== null &&
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.dropdown}
                        onDismiss={() => this.dismissModal("eye")}
                    >
                        <TouchableOpacity
                            onPress={() => this.dismissModal("eye")}
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
                                height: this.state.optionSelected?.val?.values?.length >= 5 ? 150 : null,
                            }]}>
                                <ScrollView style={{ width: "100%" }} nestedScrollEnabled>
                                    {

                                        this.state.optionSelected?.val?.values?.map((item, index) => {
                                            // console.log("optionSelected", this.state.optionSelected)
                                            return (
                                                <TouchableOpacity
                                                    key={String(index)}
                                                    onPress={() => this.selectItem(
                                                        item,
                                                        index,
                                                        this.state.optionSelected?.title,
                                                        this.state.optionSelected?.option_id == undefined ?
                                                            this.state.optionSelected?.val?.attribute_id
                                                            :
                                                            this.state.optionSelected?.option_id
                                                    )}
                                                    style={styles?.dropDown_item_style}>

                                                    < Text style={styles.dropDown_item_text}>{item?.value_name == undefined ? item?.title : item?.value_name}</Text>
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
        color: "#020621",

    },
    row_cont: {
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        marginTop: 20
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