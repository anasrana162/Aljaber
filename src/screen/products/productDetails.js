import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
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
import axios from 'axios';
import Loading from '../../components_reusable/loading';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class ProductDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_details: '',
            images: [],
            description: '',
            main_info_temp: null,
            quantity: 1,
            option_package_size: null,
            option_power: null,
            option_cyl: null,
            option_axes: null,
            option_addition: null,
            bigImage: "",
            openBigImageModal: false,

            //Power Options
            // Left Power
            selectedItemLeftPower: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemLeftPower: {},
            // Right Power
            selectedItemRightPower: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemRightPower: {},
            // Power Whole
            finalItemPower: {},

            // Package Size options
            // Package Left
            selectedItemLeftPackage: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemLeftPackage: {},
            // Package Right
            selectedItemRightPackage: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemRightPackage: {},
            // Package whole
            finalItemPackage: {},

            //CYL Options
            // Left CYL
            selectedItemLeftCYL: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemLeftCYL: {},
            // Right CYL
            selectedItemRightCYL: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemRightCYL: {},
            // CYL Whole
            finalItemCYL: {},

            //AXES Options
            // Left AXES
            selectedItemLeftAXES: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemLeftAXES: {},
            // Right AXES
            selectedItemRightAXES: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemRightAXES: {},
            // AXES Whole
            finalItemAXES: {},


            //ADDITION Options
            // Left ADDITION
            selectedItemLeftADDITION: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemLeftADDITION: {},
            // Right ADDITION
            selectedItemRightADDITION: {
                "title": "Select",
                "sort_order": 0,
                "price": 0,
                "price_type": "",
                "option_type_id": null,

            },
            finalItemRightADDITION: {},
            // ADDITION Whole
            finalItemADDITION: {},


            // Options Ended

            product_varients: null,
            product_varient_selected: null,
            varient_selected: false,
            media_gallery_entries: [],
            imageKey: 0,
            leftEyeQuantity: 1,
            rigthEyeQuantity: 1,
            cartLoader: false,
            eyedir: '',
            dropdown: false,
            optionSelected: null,
            checked: false,
        };
    }

    componentDidMount = () => {
        this.getProductDetails()

    }

    getProductDetails = async () => {
        var { product_details: { sku } } = this.props.route.params
        var { userData: { admintoken, allproducts } } = this.props
        console.log("product_details", sku)

        tempPRoducts = []

        setImmediate(() => {
            this.setState({
                loader: true,
            })
        })

        await api.get('/products/' + sku, {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        }).then(async (prod) => {

            // then we check the array of custom_attributes in for loop to fetch the attribute Brand to show in the products
            // on the screen as it is not in the main body of the object

            for (let i = 0; i < prod?.data.custom_attributes.length; i++) {

                // in the loop we check for on abject having attribute_code "brands" then pickup it value having ID

                if (prod?.data.custom_attributes[i].attribute_code == 'brands') {

                    await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,).then(async (data) => {
                        prod.data.brand = data?.data

                        // Condition for fetching products with type_id:"simple"

                        if (prod?.data?.visibility == 4 && prod?.data?.price > 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "simple") {

                            setImmediate(() => {
                                this.setState({
                                    product_details: prod?.data
                                })
                            })

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
                                            // in the Products Detail screen

                                            setImmediate(() => {
                                                this.setState({
                                                    product_details: prod?.data
                                                })
                                            })

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

            console.log("Product DEtails STate:", this.state.product_details)

            // this is for loader skeleton 




            this.getDescription('prop')
            this.checkOptions('prop')
            this.getMain_Info('prop')
            this.checkVarients('prop')
            this.productImages("prop")

        }).catch((err) => {
            console.log("Product Detail Api error on:  ", sku)
            return setImmediate(() => {
                this.setState({
                    loader: false
                })

            })

        })


    }

    checkOptions = (key) => {
        var { product_details: { options } } = this.state
        console.log("OPtions For Product", options)

        var x = [];

        switch (key) {
            case "prop":
                x = options
                break;

            case "varient":
                // x = this.state.product_varient_selected?.options
                x = options
        }

        console.log("OPtions For Product", x)

        if (x.length == 0) {
            return console.log("option are null")
        }

        for (let i = 0; i < x.length; i++) {

            console.log("CHeck TItle Options", x[i]?.title)
            if (x[i]?.title == "PACKAGE SIZE") {
                this.setState({ option_package_size: x[i] })
            }
            if (x[i]?.title == "POWER") {
                this.setState({ option_power: x[i] })
            }
            if (x[i]?.title == "CYL") {
                this.setState({ option_cyl: x[i] })
            }
            if (x[i]?.title == "AXES") {
                this.setState({ option_axes: x[i] })
            }
            if (x[i]?.title == "ADDITION") {
                this.setState({ option_addition: x[i] })
            }

        }
    }

    checkVarients = async () => {
        var { product_details: { product_varients } } = this.state
        // console.log("product_details Images Length", media_gallery_entries.length)
        // console.log("Product Varients", product_varients)

        if (product_varients?.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false,
                })
            })
            return console.log("no varients")
        }

        for (let pv = 0; pv < product_varients?.length; pv++) {
            // console.log("PRoduct Varients Item", product_varients[pv]?.id, "   ", product_varients[pv]?.name)

            for (let ca = 0; ca < product_varients[pv]?.custom_attributes?.length; ca++) {
                if (product_varients[pv]?.custom_attributes[ca]?.attribute_code == 'color') {
                    // console.log("Value iD", product_varients[pv]?.custom_attributes[ca]?.value)

                    await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_color&id=' + product_varients[pv]?.custom_attributes[ca]?.value,)
                        .then(async (data) => {
                            // console.log("Color Code", data?.data)
                            product_varients[pv].color = data?.data
                        }).catch((err) => {
                            console.log("Error Color APi", err)
                        })

                }
            }

        }

        setImmediate(() => {
            this.setState({ product_varients: product_varients, loader: false })
        })

        // console.log("PRoduct Varients Item", product_varients[1]?.color, "   ", product_varients[1]?.name)

    }

    productImages = (key) => {
        var { product_details: { media_gallery_entries, } } = this.state

        // console.log("media_gallery_entries", this.state.product_varient_selected?.media_gallery_entries)

        switch (key) {
            case "prop":
                setImmediate(() => {
                    this.setState({
                        media_gallery_entries: media_gallery_entries,
                    })
                })
                break;

            case "varient":
                // x = custom_attributes
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
                console.log("description", x[i]?.value)
                break;
            }
        }
    }

    getMain_Info = async (key) => {
        var { product_details: { custom_attributes } } = this.state
        const { userData: { admintoken }, } = this.props

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
            this.setState({ main_info_temp: items })
        })
    }

    plusOne = () => {
        var { product_details: { extension_attributes: { stock_item }, quantity } } = this.state
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
        var { finalItemLeftPower, finalItemRightPower, } = this.state
        console.log(this.state.eyedir)


        switch (this.state.eyedir) {
            case "leftPA":
                setImmediate(() => {
                    this.setState({
                        selectedItemLeftPackage: item, finalItemLeftPackage: {
                            "option_id": this.state.option_package_size?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "leftPO":
                console.log("leftPO", item)
                // for (let lp = 0; lp < this.state.leftEyeQuantity; lp++) {
                // finalItemLeftPower.push()
                // }
                setImmediate(() => {
                    this.setState({
                        selectedItemLeftPower: item,
                        finalItemLeftPower: {
                            "option_id": this.state.option_power?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "leftADD":
                console.log("leftADD", item)

                setImmediate(() => {
                    this.setState({
                        selectedItemLeftADDITION: item,
                        finalItemLeftADDITION: {
                            "option_id": this.state.option_addition?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "leftCYL":
                console.log("leftCYL", item)

                setImmediate(() => {
                    this.setState({
                        selectedItemLeftCYL: item,
                        finalItemLeftCYL: {
                            "option_id": this.state.option_cyl?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "leftAXES":
                console.log("leftAXES", item)

                setImmediate(() => {
                    this.setState({
                        selectedItemLeftAXES: item,
                        finalItemLeftAXES: {
                            "option_id": this.state.option_axes?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "rightPA":
                setImmediate(() => {
                    this.setState({
                        selectedItemRightPackage: item, finalItemRightPackage: {
                            "option_id": this.state.option_package_size?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "rightPO":
                setImmediate(() => {
                    this.setState({
                        selectedItemRightPower: item,
                        finalItemRightPower: {
                            "option_id": this.state.option_power?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "rightADD":
                console.log("rightADD", item)
                setImmediate(() => {
                    this.setState({
                        selectedItemRightADDITION: item,
                        finalItemRightADDITION: {
                            "option_id": this.state.option_addition?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "rightCYL":
                console.log("rightCYL", item)
                setImmediate(() => {
                    this.setState({
                        selectedItemRightCYL: item,
                        finalItemRightCYL: {
                            "option_id": this.state.option_cyl?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

            case "rightAXES":
                console.log("rightAXES", item)
                setImmediate(() => {
                    this.setState({
                        selectedItemRightAXES: item,
                        finalItemRightAXES: {
                            "option_id": this.state.option_axes?.option_id,
                            "option_value": item?.option_type_id
                        }, dropdown: false,
                    })
                })
                break;

        }
    }

    openDropDown = (val, eyedir) => {
        console.log(eyedir, val)
        setImmediate(() => {
            this.setState({ dropdown: !this.state.dropdown, optionSelected: val, eyedir: eyedir })
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

    selectedVarient = (data, index) => {
        // console.log("VArient Selected", data)
        setImmediate(() => {
            this.setState({ product_varient_selected: data, varient_selected: true })
        })
        setTimeout(() => {

            this.getDescription("varient")
            this.getMain_Info("varient")
            this.checkOptions("varient")
            this.productImages("varient")
        }, 1000)
    }
    addToCart = (product, index) => {

        var { userData } = this.props
        console.log("userData", userData?.token)
        setImmediate(() => {
            this.setState({
                cartLoader: true
            })
        })

        // product_varient_selected
        var productToSend = ''
        if (this.state.varient_selected == true) {
            productToSend = this.state.product_varient_selected

        } else {
            productToSend = product
        }
        if (userData?.token !== null || userData?.user?.cartID !== undefined) {
            console.log("productToSend?.type_id", productToSend?.type_id)
            if (productToSend?.type_id == "virtual" || productToSend?.type_id == "simple") {

                if (productToSend?.options.length == 0) {

                    let obj = {
                        "cartItem": {
                            "sku": productToSend?.sku,
                            "qty": this.state.quantity,
                            "name": productToSend?.name,
                            "price": productToSend?.price,
                            "product_type": productToSend?.type_id,
                            "quote_id": userData?.user?.cartID
                        }
                    }
                    console.log("this product does not have options", obj)

                    this.addToCartApi(obj)

                } else {
                    console.log("this product has options")
                    let obj = {}
                    // if it has same power than merge quantity
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemRightPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0 &&  // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemRightADDITION).length == 0 && // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity + this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        // let obj2 = {
                        //     "cartItem": {
                        //         "sku": productToSend?.sku,
                        //         "qty": this.state.rightEyeQuantity,
                        //         "name": productToSend?.name,
                        //         "price": productToSend?.price,
                        //         "product_type": productToSend?.type_id,
                        //         "quote_id": userData?.user?.cartID,
                        //         "product_option": {
                        //             "extension_attributes": {
                        //                 "custom_options": this.state.finalItemRightPower
                        //             }
                        //         }
                        //     }
                        // }

                        // console.log("this product does have options finalItemLeftPower", obj2)

                        // this.addToCartApi(obj2)

                        console.log("this product does have options Same Power", obj)
                    }

                    // POWER AND PACKAGES

                    // if powers are different
                    if (this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemRightPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemRightPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0 &&  // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemRightADDITION).length == 0 &&  // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {


                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [this.state.finalItemRightPower]
                                    }
                                }
                            }
                        }

                        console.log("this product does have options finalItemRightPower", obj)

                        this.addToCartApi(obj)

                        let obj2 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": this.state.finalItemLeftPower
                                    }
                                }
                            }
                        }

                        console.log("this product does have options finalItemLeftPower", obj2)

                        this.addToCartApi(obj2)
                    }

                    // Power and packages both are same
                    if (this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightPackage).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length !== 0 &&
                        this.state.finalItemLeftPackage?.option_value == this.state.finalItemRightPackage?.option_value &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0 &&  // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemRightADDITION).length == 0 &&  // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity + this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftPackage,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        console.log("this product does have options Same Power ANd Package", obj)
                    }

                    // Power and packages both are diff
                    if (this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        this.state.finalItemLeftPackage?.option_value !== this.state.finalItemRightPackage?.option_value &&
                        Object.keys(this.state.finalItemRightPackage).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length !== 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0 &&  // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemRightADDITION).length == 0 && // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftPackage,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightPower,
                                            this.state.finalItemRightPackage,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)

                        console.log("this product does not have options Same Power ANd Package", obj, obj1)
                    }

                    // if both Power same and packages both are diff
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        this.state.finalItemLeftPackage?.option_value !== this.state.finalItemRightPackage?.option_value &&
                        Object.keys(this.state.finalItemRightPackage).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length !== 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0 &&  // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemRightADDITION).length == 0 && // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftPackage,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightPower,
                                            this.state.finalItemRightPackage,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)


                        console.log("this product has Same Power ANd diff Package", obj, obj1)
                    }

                    // if product has diff power and same packages
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        this.state.finalItemLeftPackage?.option_value == this.state.finalItemRightPackage?.option_value &&
                        Object.keys(this.state.finalItemRightPackage).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length !== 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0 &&  // because lower condition was running of Power and ADDITION
                        Object.keys(this.state.finalItemRightADDITION).length == 0 && // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftPackage,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightPower,
                                            this.state.finalItemRightPackage,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)


                        console.log("this product has Same Power ANd diff Package", obj, obj1)
                    }


                    // Power And Addition
                    // Power and addition both are same
                    if (this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        this.state.finalItemLeftADDITION?.option_value == this.state.finalItemRightADDITION?.option_value &&
                        Object.keys(this.state.finalItemRightADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&  // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemRightPackage).length == 0 && // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity + this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftADDITION,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        console.log("this product does have options Same Power ANd ADDITION", obj)
                    }

                    // Power and ADDITION both are diff
                    if (this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        this.state.finalItemLeftADDITION?.option_value !== this.state.finalItemRightADDITION?.option_value &&
                        Object.keys(this.state.finalItemRightADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&  // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemRightPackage).length == 0 && // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftADDITION,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightPower,
                                            this.state.finalItemRightADDITION,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)

                        console.log("this product does not have options Same Power ANd ADDITION", obj, obj1)
                    }

                    // if both Power same and packages both are diff
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        this.state.finalItemLeftADDITION?.option_value !== this.state.finalItemRightADDITION?.option_value &&
                        Object.keys(this.state.finalItemRightADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&  // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemRightPackage).length == 0 &&  // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftADDITION,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightPower,
                                            this.state.finalItemRightADDITION,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)


                        console.log("this product has Same Power ANd diff ADDITION", obj, obj1)
                    }

                    // if product has diff power and same ADDITION
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        this.state.finalItemLeftADDITION?.option_value == this.state.finalItemRightADDITION?.option_value &&
                        Object.keys(this.state.finalItemRightADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&  // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemRightPackage).length == 0 &&  // because upper condition was running of Power and Packages
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftPower,
                                            this.state.finalItemLeftADDITION,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightPower,
                                            this.state.finalItemRightADDITION,

                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)


                        console.log("this product has Same Power ANd diff ADDITION", obj, obj1)
                    }

                    // conditions to put for AXES & CYL & POWER

                    // AXES left/right Equal then && CYL (left/right not equal)1d / (left/right equal)2d &&  Power (left/right not equal)3d / (left/right equal)4d
                    // AXES left/right not Equal then && CYL (left/right not equal)5d / (left/right equal)6 &&  Power (left/right not equal)7d / (left/right equal)8

                    // CYL left/right Equal then && AXES (left/right not equal)9d / (left/right equal)10d && Power (left/right not equal)11d / (left/right equal)12d
                    // CYL left/right not Equal then && AXES (left/right not equal)13d/ (left/right equal)14d && Power (left/right not equal)15d / (left/right equal)16d

                    // POWER left/right Equal then && AXES (left/right not equal)17d / (left/right equal)18d && CYL (left/right not equal)19d / (left/right equal)20d
                    // POWER left/right not Equal then && AXES (left/right not equal)21d / (left/right equal)22d && CYL (left/right not equal)23d / (left/right equal)24d


                    // if Axes  left/right is equal with each other && CYL left/right is not equal with each other && POWER left/right is not equal with each other
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftAXES?.option_value == this.state.finalItemRightAXES?.option_value &&
                        this.state.finalItemLeftCYL?.option_value !== this.state.finalItemRightCYL?.option_value &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightCYL).length !== 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length !== 0 &&
                        Object.keys(this.state.finalItemRightAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftAXES,
                                            this.state.finalItemLeftCYL,
                                            this.state.finalItemLeftPower,
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightAXES,
                                            this.state.finalItemRightCYL,
                                            this.state.finalItemRightPower
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)


                        console.log("this product has Same AXES ANd diff CYL AND diff Power", obj, obj1)
                    }

                    // if Axes  left/right is equal with each other && CYL left/right is equal with each other && POWER left/right is equal with each other
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftAXES?.option_value == this.state.finalItemRightAXES?.option_value &&
                        this.state.finalItemLeftCYL?.option_value == this.state.finalItemRightCYL?.option_value &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightCYL).length !== 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length !== 0 &&
                        Object.keys(this.state.finalItemRightAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftAXES,
                                            this.state.finalItemLeftCYL,
                                            this.state.finalItemLeftPower,
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        console.log("this product has Same AXES, CYL And Power", obj)
                    }


                    // if Axes  left/right is not equal with each other && CYL left/right is not equal with each other && POWER left/right is not equal with each other
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftAXES?.option_value !== this.state.finalItemRightAXES?.option_value &&
                        this.state.finalItemLeftCYL?.option_value !== this.state.finalItemRightCYL?.option_value &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightCYL).length !== 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length !== 0 &&
                        Object.keys(this.state.finalItemRightAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftAXES,
                                            this.state.finalItemLeftCYL,
                                            this.state.finalItemLeftPower,
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightAXES,
                                            this.state.finalItemRightCYL,
                                            this.state.finalItemRightPower
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)


                        console.log("this product has diff AXES, CYL AND Power", obj, obj1)
                    }


                    // if CYL left/right is equal with each other  && AXES left/right is not equal with each other && POWER left/right is not equal with each other
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftAXES?.option_value !== this.state.finalItemRightAXES?.option_value &&
                        this.state.finalItemLeftCYL?.option_value == this.state.finalItemRightCYL?.option_value &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightCYL).length !== 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length !== 0 &&
                        Object.keys(this.state.finalItemRightAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftAXES,
                                            this.state.finalItemLeftCYL,
                                            this.state.finalItemLeftPower,
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightAXES,
                                            this.state.finalItemRightCYL,
                                            this.state.finalItemRightPower
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)

                        console.log("this product has same CYL but diff AXES AND Power", obj, obj1)
                    }

                    // if CYL left/right is not equal with each other  && AXES left/right is equal with each other && POWER left/right is equal with each other
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftAXES?.option_value == this.state.finalItemRightAXES?.option_value &&
                        this.state.finalItemLeftCYL?.option_value !== this.state.finalItemRightCYL?.option_value &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightCYL).length !== 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length !== 0 &&
                        Object.keys(this.state.finalItemRightAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftAXES,
                                            this.state.finalItemLeftCYL,
                                            this.state.finalItemLeftPower,
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightAXES,
                                            this.state.finalItemRightCYL,
                                            this.state.finalItemRightPower
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)

                        console.log("this product has same AXES and Power but diff CYL", obj, obj1)
                    }
                    // if POWER left/right is not equal with each other  && AXES left/right is equal with each other && CYL left/right is equal with each other
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftAXES?.option_value == this.state.finalItemRightAXES?.option_value &&
                        this.state.finalItemLeftCYL?.option_value == this.state.finalItemRightCYL?.option_value &&
                        this.state.finalItemLeftPower?.option_value !== this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightCYL).length !== 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length !== 0 &&
                        Object.keys(this.state.finalItemRightAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftAXES,
                                            this.state.finalItemLeftCYL,
                                            this.state.finalItemLeftPower,
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightAXES,
                                            this.state.finalItemRightCYL,
                                            this.state.finalItemRightPower
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)

                        console.log("this product has same Power but diff CYL and AXES", obj, obj1)
                    }

                    // if POWER left/right is not equal with each other  && AXES left/right is equal with each other && CYL left/right is equal with each other
                    if (
                        this.state.checked == true &&
                        this.state.finalItemLeftAXES?.option_value !== this.state.finalItemRightAXES?.option_value &&
                        this.state.finalItemLeftCYL?.option_value !== this.state.finalItemRightCYL?.option_value &&
                        this.state.finalItemLeftPower?.option_value == this.state.finalItemRightPower?.option_value &&
                        Object.keys(this.state.finalItemRightCYL).length !== 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length !== 0 &&
                        Object.keys(this.state.finalItemRightAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length !== 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.leftEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemLeftAXES,
                                            this.state.finalItemLeftCYL,
                                            this.state.finalItemLeftPower,
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj)

                        let obj1 = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.rigthEyeQuantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemRightAXES,
                                            this.state.finalItemRightCYL,
                                            this.state.finalItemRightPower
                                        ]
                                    }
                                }
                            }
                        }

                        this.addToCartApi(obj1)

                        console.log("this product has diff Power but same CYL and AXES", obj, obj1)
                    }

                    // Whole Product Options

                    // PACKAGE SIZE && POWER

                    if (
                        this.state.checked == false &&
                        this.state.option_power !== null &&
                        this.state.option_package_size !== null &&
                        Object.keys(this.state.finalItemPower).length !== 0 &&
                        Object.keys(this.state.finalItemPackage).length !== 0 &&
                        Object.keys(this.state.finalItemADDITION).length == 0   // because upper condition was running of Power and Packages

                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.quantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemPackage,
                                            this.state.finalItemPower
                                        ]
                                    }
                                }
                            }
                        }

                        console.log("this product does have options finalItemPackage&Power", obj?.cartItem?.product_option?.extension_attributes)

                        this.addToCartApi(obj)
                    }


                    // when there is only power
                    if (
                        this.state.checked == false &&
                        this.state.option_power !== null &&
                        this.state.option_package_size == null &&
                        this.state.option_addition == null &&
                        this.state.option_axes == null &&
                        this.state.option_cyl == null &&
                        Object.keys(this.state.finalItemPower).length !== 0 &&
                        Object.keys(this.state.finalItemADDITION).length == 0   // because upper condition was running of Power and Packages
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.quantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemPower
                                        ]
                                    }
                                }
                            }
                        }
                        // {
                        //     "cartItem": {
                        //         "sku": "Air-Optix-Plus-HydraGlyde",
                        //         "qty": 2,
                        //         "name": "Air Optix Plus HydraGlyde",
                        //         "price": 195,
                        //         "product_type": "simple",
                        //         "quote_id": "135",
                        //         "product_option": {
                        //             "extension_attributes": {
                        //                 "custom_options": [
                        //                     {
                        //                         "option_id": 74,
                        //                         "option_value": 860
                        //                     },
                        //                     {
                        //                         "option_id": 75,
                        //                         "option_value": 861
                        //                     }
                        //                 ]
                        //             }
                        //         }
                        //     }
                        // }
                        // { "cartItem": { "name": "Bio True 1-Day for Astigmatism", "price": 200, "product_option": { "extension_attributes": [{"option_id": 84, "option_value": 933}] }, "product_type": "simple", "qty": 2, "quote_id": 2848, "sku": "BT30-Astigmatism" } }

                        console.log("this product does have options finalItemPower", obj?.cartItem?.product_option?.extension_attributes)

                        this.addToCartApi(obj)

                    }

                    // when there is only package
                    if (
                        this.state.checked == false &&
                        this.state.option_power == null &&
                        this.state.option_package_size !== null &&
                        this.state.option_addition == null &&
                        this.state.option_axes == null &&
                        this.state.option_cyl == null &&
                        Object.keys(this.state.finalItemPackage).length !== 0
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.quantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemPackage
                                        ]
                                    }
                                }
                            }
                        }

                        console.log("this product does have options finalItemPower", obj)

                        this.addToCartApi(obj)

                    }

                    // Power && Addition
                    if (
                        this.state.checked == false &&
                        this.state.option_power !== null &&
                        this.state.option_addition !== null &&
                        Object.keys(this.state.finalItemPower).length !== 0 &&
                        Object.keys(this.state.finalItemADDITION).length !== 0 &&
                        Object.keys(this.state.finalItemPackage).length == 0   // because upper condition was running of Power and Packages
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.quantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemADDITION,
                                            this.state.finalItemPower
                                        ]
                                    }
                                }
                            }
                        }

                        console.log("this product does have options finalItemAddition&Power", obj?.cartItem?.product_option?.extension_attributes)

                        this.addToCartApi(obj)
                    }

                    // Power && CYL && AXES
                    if (
                        this.state.checked == false &&
                        this.state.option_power !== null &&
                        this.state.option_axes !== null &&
                        this.state.option_cyl !== null &&
                        this.state.option_addition == null &&
                        Object.keys(this.state.finalItemPower).length !== 0 &&
                        Object.keys(this.state.finalItemADDITION).length == 0 &&
                        Object.keys(this.state.finalItemPackage).length == 0   // because upper condition was running of Power and Packages
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.quantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemPower,
                                            this.state.finalItemCYL,
                                            this.state.finalItemAXES,
                                        ]
                                    }
                                }
                            }
                        }

                        console.log("this product does have options finalItemPOwer&CYL&AXES", obj?.cartItem?.product_option?.extension_attributes)

                        this.addToCartApi(obj)
                    }

                    // Power && CYL 
                    if (
                        this.state.checked == false &&
                        this.state.option_power !== null &&
                        this.state.option_axes == null &&
                        this.state.option_cyl !== null &&
                        this.state.option_addition == null &&
                        Object.keys(this.state.finalItemPower).length !== 0 &&
                        Object.keys(this.state.finalItemADDITION).length == 0 &&
                        Object.keys(this.state.finalItemAXES).length == 0 &&
                        Object.keys(this.state.finalItemPackage).length == 0   // because upper condition was running of Power and Packages
                    ) {
                        obj = {
                            "cartItem": {
                                "sku": productToSend?.sku,
                                "qty": this.state.quantity,
                                "name": productToSend?.name,
                                "price": productToSend?.price,
                                "product_type": productToSend?.type_id,
                                "quote_id": userData?.user?.cartID,
                                "product_option": {
                                    "extension_attributes": {
                                        "custom_options": [
                                            this.state.finalItemPower,
                                            this.state.finalItemCYL,
                                        ]
                                    }
                                }
                            }
                        }

                        console.log("this product does have options finalItemPOwer&CYL", obj?.cartItem?.product_option?.extension_attributes)

                        this.addToCartApi(obj)
                    }

                    // when all conditions are null
                    if (
                        Object.keys(this.state.finalItemPower).length == 0 &&
                        Object.keys(this.state.finalItemLeftPower).length == 0 &&
                        Object.keys(this.state.finalItemRightPower).length == 0 &&
                        Object.keys(this.state.finalItemADDITION).length == 0 &&
                        Object.keys(this.state.finalItemLeftADDITION).length == 0 &&
                        Object.keys(this.state.finalItemRightADDITION).length == 0 &&
                        Object.keys(this.state.finalItemPackage).length == 0 &&
                        Object.keys(this.state.finalItemLeftPackage).length == 0 &&
                        Object.keys(this.state.finalItemRightPackage).length == 0 &&
                        Object.keys(this.state.finalItemAXES).length == 0 &&
                        Object.keys(this.state.finalItemCYL).length == 0 &&
                        Object.keys(this.state.finalItemLeftAXES).length == 0 &&
                        Object.keys(this.state.finalItemRightAXES).length == 0 &&
                        Object.keys(this.state.finalItemLeftCYL).length == 0 &&
                        Object.keys(this.state.finalItemRightCYL).length == 0
                    ) {
                        setImmediate(() => {
                            this.setState({
                                cartLoader: false
                            })
                        })
                        return alert("Please select Options for product")
                    }

                }

            } else {
                // this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                return alert("Please select a Product varient color!")
            }

        }

        else {
            alert("Please Login to your account first!")
            setImmediate(() => {
                this.setState({
                    cartLoader: false
                })
            })
            this.props.navigation.navigate("Account", { modal: "open" })
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
            console.log("Add to cart Item API response : ", response?.data)
            setImmediate(() => {
                this.setState({
                    cartLoader: false
                })
            })

        }).catch((err) => {
            alert("Failed to add product to cart! Try logging into your account again!")
            console.log("Add to cart item api error:  ", err.response)
            setImmediate(() => {
                this.setState({
                    cartLoader: false
                })
            })

        })
    }

    setWholeItemSelected = (item, key) => {
        switch (key) {
            case "POWER":
                setImmediate(() => {
                    this.setState({
                        finalItemPower: {
                            "option_id": this.state.option_power?.option_id,
                            "option_value": item?.option_type_id
                        }
                    })
                })
                break;

            case "PACKAGE SIZE":
                setImmediate(() => {
                    this.setState({
                        finalItemPackage: {
                            "option_id": this.state.option_package_size?.option_id,
                            "option_value": item?.option_type_id
                        }
                    })
                })
                break;

            case "ADDITION":
                setImmediate(() => {
                    this.setState({
                        finalItemADDITION: {
                            "option_id": this.state.option_addition?.option_id,
                            "option_value": item?.option_type_id
                        }
                    })
                })
                break;

            case "CYL":
                setImmediate(() => {
                    this.setState({
                        finalItemCYL: {
                            "option_id": this.state.option_cyl?.option_id,
                            "option_value": item?.option_type_id
                        }
                    })
                })
                break;

            case "AXES":
                setImmediate(() => {
                    this.setState({
                        finalItemAXES: {
                            "option_id": this.state.option_axes?.option_id,
                            "option_value": item?.option_type_id
                        }
                    })
                })
                break;

        }
    }


    render() {

        var {
            product_details,
            product_index,

        } = this.props?.route?.params

        var {
            product_varient_selected,
            media_gallery_entries,
            product_details: { },
        } = this.state
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
                    <HomeHeader />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ width: width - 20, }}>

                        <ImageCarousel
                            usage="openModal"
                            key={String(this.state.imageKey)}
                            data={media_gallery_entries}
                            onImagePress={(selected) => this.onImagePress(selected)}
                            varient_selected={this.state.varient_selected}
                            fisrtImage={this.state.product_varient_selected == null ?
                                {
                                    id: product_details?.media_gallery_entries[0]?.id,
                                    url: product_details?.media_gallery_entries[0]?.file,
                                    index: 0,
                                }
                                :
                                {
                                    id: this.state.product_varient_selected?.media_gallery_entries[0].id,
                                    url: this.state.product_varient_selected?.media_gallery_entries[0]?.file,
                                    index: 0,
                                }}
                        />




                        {/* Product Name */}
                        < Text style={[styles.product_name, {
                            marginTop: 10,
                        }]}>{product_varient_selected !== null ? product_varient_selected?.name : product_details?.name}</Text>

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
                                    onPress={() => this.addToCart(product_details, product_index)}
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
                            option_package_size={this.state.option_package_size}
                            option_power={this.state.option_power}
                            option_cyl={this.state.option_cyl}
                            option_axes={this.state.option_axes}
                            option_addition={this.state.option_addition}
                            selectedVarient={(data, index) => this.selectedVarient(data, index)}
                            product_varients={this.state.product_varients}
                            dropdown={this.state.dropdown}
                            checkMarked={(val) => this.checkMarked(val)}
                            selectedItemLeftPower={this.state.selectedItemLeftPower}
                            selectedItemLeftPackage={this.state.selectedItemLeftPackage}
                            selectedItemRightPower={this.state.selectedItemRightPower}
                            selectedItemRightPackage={this.state.selectedItemRightPackage}
                            selectedItemRightADDITION={this.state.selectedItemRightADDITION}
                            selectedItemLeftADDITION={this.state.selectedItemLeftADDITION}
                            selectedItemRightCYL={this.state.selectedItemRightCYL}
                            selectedItemLeftCYL={this.state.selectedItemLeftCYL}
                            selectedItemRightAXES={this.state.selectedItemRightAXES}
                            selectedItemLeftAXES={this.state.selectedItemLeftAXES}
                            openDropDown={(val, eyedir) => this.openDropDown(val, eyedir)}
                            onChangeText={(val, key) => this.onQuantityChange(val, key)}
                            leftEyeQuantity={this.state.leftEyeQuantity}
                            rigthEyeQuantity={this.state.rigthEyeQuantity}
                            setWholeItemSelected={(item, key) => this.setWholeItemSelected(item, key)}
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
                            data={product_details?.media_gallery_entries}
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