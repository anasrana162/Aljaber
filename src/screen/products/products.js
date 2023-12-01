import { Text, StyleSheet, Image, View, BackHandler, Dimensions, NativeModules, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from '../home/components/homeHeader';;
import Ionicons from "react-native-vector-icons/Ionicons"
import api, { custom_api_url } from '../../api/api';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

import ImageView from './components/ImageView';
import CategoryList from './components/categoryList';
import ProductList from './components/productList';
import { ImageArray } from '../categories/categoryData';
import axios from 'axios';
import FilterBoard from './components/filterBoard';
const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class Products extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            products: null,
            categories: null,
            breakLoop: "",
            loopInProgress: false,
            item: this.props?.route?.params?.item,
            lastFetchedProductLength: 0,
            productSkuLength: 0,
            originalList: null,
            original: null,
            loader: false,
            loaderFilter: false,
            productApiCounter: 0,
            filterBoardOpen: false,
            filtered_product_ids: [],
            filtered_products: [],
            filterKey: 0,
            highest_price: "",
            lowest_price: "",
            filteredPrice: "",
            contact_lens_diameter: {
                name: "Contact Lens Diameter",
                attribute_code: "contact_lens_diameter",
                count: 0,
                product_ids: [],
                value: [],
            },
            contact_lens_base_curve: {
                name: "Contact Lens Base Curve",
                attribute_code: "contact_lens_base_curve",
                count: 0,
                product_ids: [],
                value: [],
            },
            water_container_content: {
                name: "Water Container Content",
                attribute_code: "water_container_content",
                count: 0,
                product_ids: [],
                value: [],
            },
            contact_lens_usage: {
                name: "Contact Lens Usage",
                attribute_code: "contact_lens_usage",
                count: 0,
                product_ids: [],
                value: [],
            },
            brands: {
                name: "Brands",
                attribute_code: "brands",
                count: 0,
                product_ids: [],
                value: [],
            },
            size: {
                name: "Size",
                attribute_code: "size",
                count: 0,
                product_ids: [],
                value: [],
            },
            model_no: {
                name: "Model No",
                attribute_code: "model_no",
                count: 0,
                product_ids: [],
                value: [],
            },
            color: {
                name: "Colors",
                attribute_code: "color",
                count: 0,
                product_ids: [],
                value: [],
            },
            box_content_pcs: {
                name: "Box Content (PCS)",
                attribute_code: "box_content_pcs",
                count: 0,
                product_ids: [],
                value: [],
            },
            lense_color: {
                name: "Lense Color",
                attribute_code: "lense_color",
                count: 0,
                product_ids: [],
                value: [],
            },
            frame_type: {
                name: "Frame Type",
                attribute_code: "frame_type",
                count: 0,
                product_ids: [],
                value: [],
            },
            frame_shape: {
                name: "Frame Shape",
                attribute_code: "frame_shape",
                count: 0,
                product_ids: [],
                value: [],
            },
            polarized: {
                name: "Polarized",
                attribute_code: "polarized",
                count: 0,
                product_ids: [],
                value: [],
            },
            frame_color: {
                name: "Frame Color",
                attribute_code: "frame_color",
                count: 0,
                product_ids: [],
                value: [],
            },
            frame_material: {
                name: "Frame Material",
                attribute_code: "frame_material",
                count: 0,
                product_ids: [],
                value: [],
            },
            bridge_size: {
                name: "Bridge Size",
                attribute_code: "bridge_size",
                count: 0,
                product_ids: [],
                value: [],
            },
            temple_color: {
                name: "Temple Color",
                attribute_code: "temple_color",
                count: 0,
                product_ids: [],
                value: [],
            },
            temple_size: {
                name: "Temple Size",
                attribute_code: "temple_size",
                count: 0,
                product_ids: [],
                value: [],
            },
            temple_material: {
                name: "Temple Material",
                attribute_code: "temple_material",
                count: 0,
                product_ids: [],
                value: [],
            },
            gender: {
                name: "Gender",
                attribute_code: "gender",
                count: 0,
                product_ids: [],
                value: [],
            },

        };
    }


    componentDidMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.checkExistingProductData()
        this.inner_Categories()
        this.fetchFilterData()

    }
    handleBackButtonClick() {
        setImmediate(() => {
            this.setState({ breakLoop: "break", loopInProgress: false })
        })
        setTimeout(() => {
            this.props.navigation.pop()
        }, 500)
        return true;
    }
    goBack = () => {
        if (this.state.loader == false) {

            setImmediate(() => {
                this.setState({ breakLoop: "break", loopInProgress: false })
            })
            setTimeout(() => {
                this.props.navigation.pop()
            }, 500)
        }
    }

    checkExistingProductData = () => {
        const { userData: { admintoken, allproducts, clearpres, color, toric, pres, lenssol,
            cgadults, cgkids, egmen, egwomen, egkids, sgmen, sgwomen,
            sgkids, cords, spraycleaner, cases, giftcards, safetyglasses, swimgoggles },
            actions, userData, route: { params: { sub_category_id } } } = this.props

        console.log("sub_category_id |||||", sub_category_id)

        console.log("swicth working");
        switch (sub_category_id) {
            // Category Contact Lenses
            case 29:
                console.log("Working clearpres")
                this.createData(clearpres)
                break;
            case 30:
                this.createData(color)
                break;
            case 31:
                this.createData(toric)
                break;
            case 32:
                this.createData(pres)
                break;
            case 33:
                this.createData(lenssol)
                break;

            // Category Computer Glasses
            case 27:
                this.createData(cgadults)
                break;
            case 28:
                this.createData(cgkids)
                break;


            // Category Eyeglasses
            case 34:
                this.createData(egmen)
                break;
            case 103:
                this.createData(egwomen)
                break;
            case 104:
                this.createData(egkids)
                break;

            // Category Sunglasses
            case 42:
                this.createData(sgmen)
                break;
            case 43:
                this.createData(sgwomen)
                break;
            case 44:
                this.createData(sgkids)
                break;

            // Category Accessories
            case 122:
                this.createData(cords)
                break;
            case 123:
                this.createData(spraycleaner)
                break;
            case 124:
                this.createData(cases)
                break;
            case 125:
                this.createData(giftcards)
                break;
            case 126:
                this.createData(safetyglasses)
                break;
            case 127:
                this.createData(swimgoggles)
                break;

            default:
                this.createData(null)
                break;

        }


    }

    createData = async (savedProducts) => {
        var { item, productApiCounter } = this.state;
        const { userData: { admintoken, }, actions, route: { params: { sub_category_id } } } = this.props

        // opening Loaders
        setImmediate(() => {
            this.setState({
                loader: true,
                loaderFilter: true

            })
        })

        let products = []
        if (savedProducts.length == 0 || savedProducts == null || savedProducts == undefined) {

            var result = await api.get(custom_api_url + "func=get_category_products&cid=" + sub_category_id)

            var sorted = result.data.slice().sort(function (a, b) {
                return a.price - b.price;
            });

            var smallest = sorted[0],
                largest = sorted[sorted.length - 1];

            // setting the products in the state once they are all done 


            // console.log("result.data", result.data)
            actions.savedProducts(sub_category_id.toString(), result.data)
            setImmediate(() => {

                this.setState({
                    highest_price: largest?.price,
                    lowest_price: smallest?.price,
                    products: result.data,
                    original: result.data,
                    loader: false,
                    loaderFilter: false

                })
            })

        } else {

            // console.log("Saved Condition WOrking", savedProducts)
            var sorted = savedProducts.slice().sort(function (a, b) {
                return a.price - b.price;
            });

            var smallest = sorted[0],
                largest = sorted[sorted.length - 1];
            setImmediate(() => {

                this.setState({
                    highest_price: parseInt(largest?.price),
                    lowest_price: parseInt(smallest?.price),
                    products: savedProducts,
                    original: savedProducts,
                    loader: false,
                    loaderFilter: false

                })
            })

        }


    }

    onMomentumScrollEnd = async (savedProducts, load) => {
        console.log("")
        console.log("")
        console.log("")
        console.log("-------------------------------------")
        console.log("-----------------onMomentumScrollEnd Function--------------------")
        console.log("-------------------------------------")
        console.log("")
        console.log("")
        console.log("")
        var { lastFetchedProductLength, products, original, item, } = this.state
        const { userData: { admintoken, }, actions, route: { params: { sub_category_id } } } = this.props
        // alert("fetch more")

        let productsArr = []
        var tempSKU = []


        for (let sp = 0; sp < products.length; sp++) {
            let obj1 = { "category_id": products[sp]?.products, "position": products[sp]?.position, "sku": products[sp]?.sku }
            if (obj1.category_id !== undefined) {
                tempSKU.push(obj1)
            }
        }


        if (this.state.originalList == null) {

            await api.get('/categories/' + item.id + '/products', {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            }).then((res) => {
                setImmediate(() => {
                    this.setState({ originalList: res?.data })
                })
            }).catch((err) => {
                console.log("Cannot fetch categories LEngth")
            })
        }

        let loopIndex = 10
        var temp = this.state.originalList
        var temp_left = temp
        for (let t = 0; t < temp.length; t++) {
            // console.log("TEMP check by index", temp[t])
            for (let check = 0; check < tempSKU.length; check++) {
                if (tempSKU[check].sku == temp[t]?.sku) {
                    var spliced = temp.splice(t, 1);
                    // console.log("SPliced:", spliced, "LEft:", temp)
                }

            }
        }

        for (let p = 0; p < loopIndex; p++) {
            await api.get('/products/' + temp_left[p]?.sku, {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            }).then(async (prod) => {

                prod.data.category_id = temp_left[p]?.category_id;
                prod.data.position = temp_left[p]?.position;
                // then we check the array of custom_attributes in for loop to fetch the attribute Brand to show in the products
                // on the screen as it is not in the main body of the object

                for (let i = 0; i < prod?.data.custom_attributes.length; i++) {

                    // in the loop we check for on abject having attribute_code "brands" then pickup it value having ID

                    if (prod?.data.custom_attributes[i].attribute_code == 'brands') {

                        await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,).then(async (data) => {
                            prod.data.brand = data?.data

                            // Condition for fetching products with type_id:"simple"

                            if (prod?.data?.visibility == 4 && prod?.data?.price > 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "simple") {
                                let obj = {
                                    "id": prod?.data?.id,
                                    "sku": prod?.data?.sku,
                                    "name": prod?.data?.name,
                                    "brand": data?.data,
                                    "price": prod?.data?.price,
                                    "type_id": "simple",
                                    "media_gallery_entries": prod?.data?.media_gallery_entries,
                                    "weight": prod?.data?.weight,
                                }
                                products.push(obj)
                                original.push(obj)
                                setImmediate(() => {
                                    this.setState({ products, original })
                                })
                                savedProducts.push(prod?.data)
                                actions.savedProducts(sub_category_id.toString(), savedProducts)
                                this.createFilterData(prod?.data)

                            }

                            // Condition for fetching products with type_id:"Configurable"

                            if (prod?.data?.price == 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "configurable") {

                                var getprice = await axios.post("https://aljaberoptical.com/pub/script/custom_api.php?func=configurable_price&id=" + prod?.data?.id).then((price_api) => {
                                    return price_api?.data
                                }).catch((err) => {
                                    console.log("Error caught in custom Price fetch API PRoduct Details screen")
                                })

                                console.log("Price from APi:", getprice)

                                prod.data.price = getprice
                                prod.data.brand = data?.data

                                let obj = {
                                    "id": prod?.data?.id,
                                    "sku": prod?.data?.sku,
                                    "name": prod?.data?.name,
                                    "brand": data?.data,
                                    "price": getprice,
                                    "type_id": "configurable",
                                    "media_gallery_entries": prod?.data?.media_gallery_entries,
                                    "weight": prod?.data?.weight,
                                }
                                products.push(obj)
                                original.push(obj)
                                setImmediate(() => {
                                    this.setState({ products, original })
                                })
                                savedProducts.push(prod?.data)
                                actions.savedProducts(sub_category_id.toString(), savedProducts)
                                this.createFilterData(prod?.data)
                            }
                        }).catch((err) => {
                            console.log("DAta for Brands Api errr", err)
                        })
                        break;
                    }
                }
                // if (products.length >= itemsToLoad - 1) {
                //     setImmediate(() => {
                //         this.setState({
                //             loader: false,
                //         })
                //     })
                // }



                var sorted = products.slice().sort(function (a, b) {
                    return a.price - b.price;
                });

                var smallest = sorted[0],
                    largest = sorted[sorted.length - 1];

                // // setting the products in the state once they are all done 


                setImmediate(() => {
                    this.setState({
                        highest_price: largest?.price,
                        lowest_price: smallest?.price,
                        loopInProgress: false,
                    })
                })
            }).catch((err) => {
                console.log("Product Detail Api error on:  ", temp_left[p]?.sku)
                loopIndex = loopIndex + 1

            })

            if (this.state.breakLoop == "break") {
                console.log("")
                console.log("")
                console.log("----------||||||||||---------------")
                console.log("Loop Broken")
                console.log("----------||||||||||---------------")
                console.log("")
                console.log("")
                break;
            }

        }

    }

    fetchFilterData = async () => {
        var { item, productApiCounter } = this.state;
        const { userData: { admintoken, allproducts }, actions, route: { params: { sub_category_id } } } = this.props

        let products = []
        var tempSKU = []
        var tempPRoducts = []
        // Api to fetch  Array of products sku's of category selected


        var result = await api.get("products?searchCriteria[filterGroups][0][filters][0][field]=category_id&searchCriteria[filterGroups][0][filters][0][value]=" + sub_category_id + "&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&searchCriteria[filterGroups][1][filters][0][field]=visibility&searchCriteria[filterGroups][1][filters][0][value]=4&searchCriteria[filterGroups][1][filters][0][conditionType]=eq&searchCriteria[filterGroups][2][filters][0][field]=status&searchCriteria[filterGroups][2][filters][0][value]=1&searchCriteria[filterGroups][2][filters][0][conditionType]=eq&searchCriteria[sortOrders][0][field]=created_at&searchCriteria[sortOrders][0][direction]=DESC&fields=items[id,name,status,price,visibility,type_id,extension_attributes,custom_attributes]", {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        })
        // console.log("Result For Custom Attributes", result?.data?.items)

        for (let rdi = 0; rdi < result?.data?.items.length; rdi++) {

            for (let ca = 0; ca < result?.data?.items[rdi].custom_attributes.length; ca++) {

                if (result?.data?.items[rdi].custom_attributes[ca].attribute_code == 'brands') {

                    await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + result?.data?.items[rdi].custom_attributes[ca].value,).then(async (data) => {
                        result.data.items[rdi].brand = data?.data

                        // Condition for fetching products with type_id:"simple"

                        if (result?.data?.items[rdi].visibility == 4 && result?.data?.items[rdi].price > 0 && result?.data?.items[rdi].status == 1 && result?.data?.items[rdi].type_id == "simple") {
                            this.createFilterData(result?.data?.items[rdi])

                        }

                        // Condition for fetching products with type_id:"Configurable"

                        if (result?.data?.items[rdi].price == 0 && result?.data?.items[rdi].status == 1 && result?.data?.items[rdi].type_id == "configurable") {

                            var getprice = await axios.post("https://aljaberoptical.com/pub/script/custom_api.php?func=configurable_price&id=" + result?.data?.items[rdi].id).then((price_api) => {
                                return price_api?.data
                            }).catch((err) => {
                                console.log("Error caught in custom Price fetch API PRoduct Details screen")
                            })

                            // console.log("Price from APi:", getprice)

                            result.data.items[rdi].price = getprice
                            result.data.items[rdi].brand = data?.data
                            for (let tp = 0; tp < result.data.items[rdi].extension_attributes?.configurable_product_links?.length; tp++) {

                                // Comparing these ID's with the ID's of all products fetched redux which was from All products api from homescreen 

                                const selected_products = allproducts.filter((value) => value?.id == result.data.items[rdi].extension_attributes?.configurable_product_links[tp])[0]

                                // Condition

                                if (result.data.items[rdi].extension_attributes?.configurable_product_links[tp] == selected_products?.id) {

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
                                        cfPD.data.parent_product_id = result.data.items[rdi].id
                                        cfPD.data.options = result.data.items[rdi].options
                                        cfPD.data.type_id = result.data.items[rdi].type_id
                                        // then we push all these product varients into a temporary array so the loop is complete reaching all of the id's in
                                        // the configurable_product_links then we push into main array otherwsie it will mix all the different products varients
                                        // together

                                        tempPRoducts.push(cfPD?.data)

                                        // here's the condition once the configurable_product_links array reach its end
                                        if (tp == result.data.items[rdi].extension_attributes?.configurable_product_links?.length - 1) {

                                            //we also change the value of price of the main product because products with type_id have "0" price
                                            // so we take a price from its varient overwrite (Note price of all vareints are same)
                                            result.data.items[rdi].price = cfPD.data?.price

                                            // then we create an of product_varients and push into main product's object to show and display the varients in
                                            // product details screen
                                            result.data.items[rdi].product_varients = tempPRoducts

                                            // then we push this product into main products array with all of these things so it can be displayed
                                            // in the Products Detail screen

                                            console.log("result.data.items[rdi].product_varients",result.data.items[rdi].product_varients)

                                            this.createFilterData(result.data.items[rdi])

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
                            this.createFilterData(result?.data?.items[rdi])
                        }
                    }).catch((err) => {
                        console.log("DAta for Brands Api errr", err)
                    })
                    break;
                }
            }
        }
    }

    createFilterData = async (product) => {
        // console.log("Product From CreateData Function:", product)
        var filterData = []
        var { custom_attributes, product_varients, } = product
        var { contact_lens_diameter, contact_lens_base_curve, temple_size, bridge_size, gender, temple_material, temple_color, frame_type, polarized, frame_color, frame_shape, frame_material, water_container_content, contact_lens_usage, brands, size, lense_color, model_no, box_content_pcs, color } = this.state
        if (product_varients !== undefined) {
             console.log("Product From CreateData Function:", product_varients)
            for (let pv = 0; pv < product_varients.length; pv++) {
                for (let ca = 0; ca < product_varients[pv]?.custom_attributes.length; ca++) {
                    if (product_varients[pv]?.custom_attributes[ca]?.attribute_code == 'color') {
                        // console.log("Value iD", product_varients[pv]?.custom_attributes[ca]?.value)

                        await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_color&id=' + product_varients[pv]?.custom_attributes[ca]?.value,)
                            .then(async (data) => {
                                // console.log("Color Code", data?.data)
                                product_varients[pv].color = {
                                    color_name: product_varients[pv]?.custom_attributes[ca]?.value,
                                    color_code: data?.data,
                                    product_ids: []
                                }
                                color.count = color?.count + 1
                                color?.product_ids.push(product?.id)
                                var check = color?.value.filter((val) => val?.color_name == product_varients[pv].color?.color_name)[0]
                                // console.log("Check Color Value", check)
                                if (check?.color_name == product_varients[pv].color?.color_name) {
                                    // console.log("")
                                    // console.log("---------------------")
                                    // console.log("already exists! COLOR")
                                    // console.log("---------------------")
                                    // console.log("")
                                    for (let n = 0; n < color?.value.length; n++) {
                                        if (color?.value[n].color_name == product_varients[pv].color?.color_name) {
                                            // console.log("found Value Color",)
                                            color.value[n].product_ids.push(product?.id)
                                            //this.setState({ color })
                                            break;
                                        }
                                    }
                                } else {

                                    product_varients[pv].color.product_ids.push(product?.id)
                                    color?.value?.push(product_varients[pv].color)
                                    this.setState({ color })
                                    // console.log(contact_lens_diameter)
                                }

                            }).catch((err) => {
                                console.log("Error Color APi", err)
                            })

                        break;

                    }
                }
            }
        }

        for (let i = 0; i < custom_attributes.length; i++) {

            if (custom_attributes[i]?.attribute_code == "contact_lens_diameter") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for contact_lens_diameter", value)
                contact_lens_diameter.count = contact_lens_diameter?.count + 1
                contact_lens_diameter?.product_ids.push(product?.id)
                // console.log(contact_lens_diameter?.value)
                var check = contact_lens_diameter?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! contact_lens_diameter2")
                    // console.log("---------------------")
                    // console.log("")


                    for (let n = 0; n < contact_lens_diameter?.value.length; n++) {
                        if (contact_lens_diameter?.value[n].product_name == value) {
                            // console.log("found Value",)
                            contact_lens_diameter.value[n].product_ids.push(product?.id)
                            contact_lens_diameter.value[n].product_count = contact_lens_diameter?.value[n].product_count + 1
                            break;
                        }
                    }


                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    contact_lens_diameter?.value?.push(obj)
                    this.setState({ contact_lens_diameter })
                    // console.log(contact_lens_diameter)
                }

            }
            if (custom_attributes[i]?.attribute_code == "contact_lens_base_curve") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for contact_lens_base_curve", value)

                contact_lens_base_curve.count = contact_lens_base_curve?.count + 1
                contact_lens_base_curve?.product_ids.push(product?.id)
                // console.log(contact_lens_base_curve?.value)
                var check = contact_lens_base_curve?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! contact_lens_base_curve")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < contact_lens_base_curve?.value.length; n++) {
                        if (contact_lens_base_curve?.value[n].product_name == value) {
                            // console.log("found Value",)
                            contact_lens_base_curve.value[n].product_ids.push(product?.id)
                            contact_lens_base_curve.value[n].product_count = contact_lens_base_curve?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    contact_lens_base_curve?.value.push(obj)
                    this.setState({ contact_lens_base_curve })
                    // console.log(contact_lens_base_curve)
                }

            }
            if (custom_attributes[i]?.attribute_code == "water_container_content") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for water_container_content", value)

                water_container_content.count = water_container_content?.count + 1
                water_container_content?.product_ids.push(product?.id)
                // console.log(water_container_content?.value)
                var check = water_container_content?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! contact_lens_base_curve")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < water_container_content?.value.length; n++) {
                        if (water_container_content?.value[n].product_name == value) {
                            // console.log("found Value",)
                            water_container_content.value[n].product_ids.push(product?.id)
                            water_container_content.value[n].product_count = water_container_content?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    water_container_content?.value.push(obj)
                    this.setState({ water_container_content })
                    // console.log(water_container_content)
                }

            }
            if (custom_attributes[i]?.attribute_code == "contact_lens_usage") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for contact_lens_usage", value)

                contact_lens_usage.count = contact_lens_usage?.count + 1
                contact_lens_usage?.product_ids.push(product?.id)
                // console.log(contact_lens_usage?.value)
                var check = contact_lens_usage?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! contact_lens_usage")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < contact_lens_usage?.value.length; n++) {
                        if (contact_lens_usage?.value[n].product_name == value) {
                            // console.log("found Value",)
                            contact_lens_usage?.value[n].product_ids.push(product?.id)
                            contact_lens_usage.value[n].product_count = contact_lens_usage?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    contact_lens_usage?.value.push(obj)
                    this.setState({ contact_lens_usage })
                    // console.log(contact_lens_usage)
                }

            }
            if (custom_attributes[i]?.attribute_code == "brands") {
                var value = product?.brand
                // console.log("VAlue for contact_lens_usage", value)

                brands.count = brands?.count + 1
                brands?.product_ids.push(product?.id)
                // console.log(brands?.value)
                var check = brands?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! contact_lens_usage")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < brands?.value.length; n++) {
                        if (brands?.value[n].product_name == value) {
                            // console.log("found Value",)
                            brands?.value[n].product_ids.push(product?.id)
                            brands.value[n].product_count = brands?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    brands?.value.push(obj)
                    this.setState({ brands })
                    // console.log(brands)
                }

            }
            if (custom_attributes[i]?.attribute_code == "size") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for size", value)

                size.count = size?.count + 1
                size?.product_ids.push(product?.id)
                // console.log(size?.value)
                var check = size?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < size?.value.length; n++) {
                        if (size?.value[n].product_name == value) {
                            // console.log("found Value",)
                            size?.value[n].product_ids.push(product?.id)
                            size.value[n].product_count = size?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    size?.value.push(obj)
                    this.setState({ size })
                    // console.log(size)
                }

            }
            if (custom_attributes[i]?.attribute_code == "temple_size") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for size", value)

                temple_size.count = temple_size?.count + 1
                temple_size?.product_ids.push(product?.id)
                // console.log(size?.value)
                var check = temple_size?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < size?.value.length; n++) {
                        if (temple_size?.value[n].product_name == value) {
                            // console.log("found Value",)
                            temple_size?.value[n].product_ids.push(product?.id)
                            temple_size.value[n].product_count = temple_size?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    temple_size?.value.push(obj)
                    this.setState({ temple_size })
                    // console.log(size)
                }

            }
            if (custom_attributes[i]?.attribute_code == "model_no") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for model_no", value)

                model_no.count = model_no?.count + 1
                model_no?.product_ids.push(product?.id)
                // console.log(model_no?.value)
                var check = model_no?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < model_no?.value.length; n++) {
                        if (model_no?.value[n].product_name == value) {
                            // console.log("found Value",)
                            model_no?.value[n].product_ids.push(product?.id)
                            model_no.value[n].product_count = model_no?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    model_no?.value.push(obj)
                    this.setState({ model_no })
                    // console.log(model_no)
                }

            }
            if (custom_attributes[i]?.attribute_code == "lense_color") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for model_no", value)

                lense_color.count = lense_color?.count + 1
                lense_color?.product_ids.push(product?.id)
                // console.log(model_no?.value)
                var check = lense_color?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < lense_color?.value.length; n++) {
                        if (lense_color?.value[n].product_name == value) {
                            // console.log("found Value",)
                            lense_color?.value[n].product_ids.push(product?.id)
                            lense_color.value[n].product_count = lense_color?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    lense_color?.value.push(obj)
                    this.setState({ lense_color })
                    // console.log(model_no)
                }

            }
            if (custom_attributes[i]?.attribute_code == "frame_color") {
                var value = await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_color&id=' + custom_attributes[i]?.value).then(async (data) => {

                    // console.log("Data?.data", data?.data)
                    return data?.data

                }).catch((err) => {
                    console.log("Attribute DEtail Function Api Error", err)
                })
                // console.log("VAlue for box_content_pcs", value)

                frame_color.count = frame_color?.count + 1
                frame_color?.product_ids.push(product?.id)
                var check = frame_color?.value.filter((val) => val?.color_code == value)[0]
                // console.log("check |||||", check, " ", value)

                if (check?.color_code == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! color inner func")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < frame_color?.value.length; n++) {
                        if (frame_color?.value[n].color_code == value) {
                            // console.log("found Value color",)
                            frame_color?.value[n].product_ids.push(product?.id)
                            // let temp = color?.value[n].product_ids.filter((val,index) => color?.value[n].product_ids.indexOf(val) === index)
                            this.setState({ frame_color })
                            break;
                        }
                    }
                } else {
                    var obj = {
                        color_name: custom_attributes[i]?.value,
                        color_code: value,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    frame_color?.value.push(obj)
                    // let temp1=color?.value.filter((val,index) => val.product_ids.indexOf(val) === index)
                    this.setState({ frame_color })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "color") {
                var value = await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_color&id=' + custom_attributes[i]?.value).then(async (data) => {

                    // console.log("Data?.data", data?.data)
                    return data?.data

                }).catch((err) => {
                    console.log("Attribute DEtail Function Api Error", err)
                })
                // console.log("VAlue for box_content_pcs", value)

                color.count = color?.count + 1
                color?.product_ids.push(product?.id)
                var check = color?.value.filter((val) => val?.color_code == value)[0]
                // console.log("check |||||", check, " ", value)

                if (check?.color_code == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! color inner func")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < color?.value.length; n++) {
                        if (color?.value[n].color_code == value) {
                            // console.log("found Value color",)
                            color?.value[n].product_ids.push(product?.id)
                            // let temp = color?.value[n].product_ids.filter((val,index) => color?.value[n].product_ids.indexOf(val) === index)
                            this.setState({ color })
                            break;
                        }
                    }
                } else {
                    var obj = {
                        color_name: custom_attributes[i]?.value,
                        color_code: value,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    color?.value.push(obj)
                    // let temp1=color?.value.filter((val,index) => val.product_ids.indexOf(val) === index)
                    this.setState({ color })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "bridge_size") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                bridge_size.count = bridge_size?.count + 1
                bridge_size?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = bridge_size?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < bridge_size?.value.length; n++) {
                        if (bridge_size?.value[n].product_name == value) {
                            // console.log("found Value",)
                            bridge_size?.value[n].product_ids.push(product?.id)
                            bridge_size.value[n].product_count = bridge_size?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    bridge_size?.value.push(obj)
                    this.setState({ bridge_size })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "frame_material") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                frame_material.count = frame_material?.count + 1
                frame_material?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = frame_material?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < frame_material?.value.length; n++) {
                        if (frame_material?.value[n].product_name == value) {
                            // console.log("found Value",)
                            frame_material?.value[n].product_ids.push(product?.id)
                            frame_material.value[n].product_count = frame_material?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    frame_material?.value.push(obj)
                    this.setState({ frame_material })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "frame_type") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                frame_type.count = frame_type?.count + 1
                frame_type?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = frame_type?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < frame_type?.value.length; n++) {
                        if (frame_type?.value[n].product_name == value) {
                            // console.log("found Value",)
                            frame_type?.value[n].product_ids.push(product?.id)
                            frame_type.value[n].product_count = frame_type?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    frame_type?.value.push(obj)
                    this.setState({ frame_type })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "polarized") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                polarized.count = polarized?.count + 1
                polarized?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = polarized?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < polarized?.value.length; n++) {
                        if (polarized?.value[n].product_name == value) {
                            // console.log("found Value",)
                            polarized?.value[n].product_ids.push(product?.id)
                            polarized.value[n].product_count = polarized?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    polarized?.value.push(obj)
                    this.setState({ polarized })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "temple_color") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                temple_color.count = temple_color?.count + 1
                temple_color?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = temple_color?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < temple_color?.value.length; n++) {
                        if (temple_color?.value[n].product_name == value) {
                            // console.log("found Value",)
                            temple_color?.value[n].product_ids.push(product?.id)
                            temple_color.value[n].product_count = temple_color?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    temple_color?.value.push(obj)
                    this.setState({ temple_color })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "gender") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                gender.count = gender?.count + 1
                gender?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = gender?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < gender?.value.length; n++) {
                        if (gender?.value[n].product_name == value) {
                            // console.log("found Value",)
                            gender?.value[n].product_ids.push(product?.id)
                            gender.value[n].product_count = gender?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    gender?.value.push(obj)
                    this.setState({ gender })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "temple_material") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                temple_material.count = temple_material?.count + 1
                temple_material?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = temple_material?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < temple_material?.value.length; n++) {
                        if (temple_material?.value[n].product_name == value) {
                            // console.log("found Value",)
                            temple_material?.value[n].product_ids.push(product?.id)
                            temple_material.value[n].product_count = temple_material?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    temple_material?.value.push(obj)
                    this.setState({ temple_material })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "frame_shape") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                frame_shape.count = frame_shape?.count + 1
                frame_shape?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = frame_shape?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < frame_shape?.value.length; n++) {
                        if (frame_shape?.value[n].product_name == value) {
                            // console.log("found Value",)
                            frame_shape?.value[n].product_ids.push(product?.id)
                            frame_shape.value[n].product_count = frame_shape?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    frame_shape?.value.push(obj)
                    this.setState({ frame_shape })
                    // console.log(box_content_pcs)
                }

            }
            if (custom_attributes[i]?.attribute_code == "box_content_pcs") {
                var value = await this.attributeDetail(custom_attributes[i]?.value)
                // console.log("VAlue for box_content_pcs", value)

                box_content_pcs.count = box_content_pcs?.count + 1
                box_content_pcs?.product_ids.push(product?.id)
                // console.log(box_content_pcs?.value)
                var check = box_content_pcs?.value.filter((val) => val?.product_name == value)[0]

                if (check?.product_name == value) {
                    // console.log("")
                    // console.log("---------------------")
                    // console.log("already exists! size")
                    // console.log("---------------------")
                    // console.log("")
                    for (let n = 0; n < box_content_pcs?.value.length; n++) {
                        if (box_content_pcs?.value[n].product_name == value) {
                            // console.log("found Value",)
                            box_content_pcs?.value[n].product_ids.push(product?.id)
                            box_content_pcs.value[n].product_count = box_content_pcs?.value[n].product_count + 1
                            break;
                        }
                    }
                } else {
                    var obj = {
                        id: custom_attributes[i]?.value,
                        product_name: value,
                        product_count: 1,
                        product_ids: []
                    }
                    obj.product_ids.push(product?.id)
                    box_content_pcs?.value.push(obj)
                    this.setState({ box_content_pcs })
                    // console.log(box_content_pcs)
                }

            }
        }
    }

    attributeDetail = async (code, key) => {

        var result = await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + code).then(async (data) => {

            // console.log("Data?.data", data?.data)
            return data?.data

        }).catch((err) => {
            console.log("Attribute DEtail Function Api Error", err)
        })
        return await result

    }

    inner_Categories = () => {
        var { item, mainCat_selected } = this.props?.route?.params;
        var { userData: { defaultcategory, admintoken } } = this.props
        // console.log("children_data", item)
        var mainIndex = mainCat_selected - 1
        if (mainIndex == 0) {
            mainIndex = 0
        } else {
            mainIndex = mainIndex - 1
        }
        // console.log("children_data", mainIndex)
        // console.log("defaultCategories", defaultcategory?.children_data[mainIndex]?.children_data[item.position - 1]?.children_data)

        var inner_cats = defaultcategory?.children_data[mainIndex]?.children_data[item.position - 1]?.children_data

        setImmediate(() => {
            this.setState({
                categories: inner_cats == 0 ? null : inner_cats
            })
        })
    }

    selectedItems = (selecteditem, index) => {


        var { item, mainCat_selected } = this.props?.route?.params;
        // because position is giving 1 which index of array in first value while array starts with 0
        var mainIndex = mainCat_selected - 1
        if (mainIndex == 0) {
            mainIndex = 0
        } else {
            // since there is 2nd position missing in data after 1 so thats why subtracting for second time
            // see in defaultCategories console.log or  ImageArray file while matching parent ids
            mainIndex = mainIndex - 1
        }
        var sub_index = selecteditem?.position - 1
        var sub_cats = ImageArray[mainIndex]?.children_data[item.position - 1].children_data[sub_index]
        if (sub_cats.children_data.length !== 0) {

            setImmediate(() => {
                this.setState({
                    item: sub_cats.children_data[0],
                })
                this.createData()
            })
        } else {
            alert("Coming Soon")
            console.log("children_data empty cannot set Item state")
        }

    }

    sortBy = async (key) => {
        var { products, products: { custom_attributes } } = this.state
        const { userData: { admintoken }, actions, userData } = this.props
        switch (key) {
            case "position":
                this.state.products.sort(function (a, b) {
                    if (a.name < b.name) {
                        return 1;
                    }
                    if (a.name > b.name) {
                        return -1;
                    }
                    return 0;
                });
                setImmediate(() => {
                    this.setState({ products })
                })
                break;

            case "product_name":
                this.state.products.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });

                setImmediate(() => {
                    this.setState({ products })
                })
                break;

            case "price":
                this.state.products.sort(function (a, b) { return a.price - b.price });
                setImmediate(() => {
                    this.setState({ products })
                })
                break;

            case "brands":
                this.state.products.sort(function (a, b) {
                    if (a.brand > b.brand) {
                        return 1;
                    }
                    if (a.brand < b.brand) {
                        return -1;
                    }
                    return 0;
                });
                setImmediate(() => {
                    this.setState({ products })
                })
                break;


        }
    }

    updatePriceFilter = (val) => {
        var { products, filtered_products } = this.state
        setImmediate(() => {
            this.setState({
                filteredPrice: parseInt(val)
            })
        })
        filtered_products = []

        for (let i = 0; i < products.length; i++) {
            if (products[i]?.price <= parseInt(val)) {
                filtered_products.push(products[i])
            }
        }
        setImmediate(() => {
            this.setState({ filtered_products, })
        })

    }

    applyFilter = (product_ids) => {
        var { filtered_product_ids, products, filtered_products } = this.state
        filtered_product_ids = [...filtered_product_ids, ...product_ids]
        filtered_products = []
        filtered_product_ids = filtered_product_ids.filter((item, index) => filtered_product_ids.indexOf(item) === index)
        setImmediate(() => {
            this.setState({ filtered_product_ids, })
        })
        for (let i = 0; i < filtered_product_ids?.length; i++) {
            var filterData = products.filter((prs) => prs?.id == filtered_product_ids[i])[0]

            let obj = {
                "id": filterData?.id,
                "sku": filterData?.sku,
                "type": filterData?.type_id,
                "name": filterData?.name,
                "brand": filterData?.brands,
                "price": filterData?.price,
                "image": filterData?.image,
            }
            filtered_products.push(obj)
            if (i == filtered_product_ids?.length - 1) {
                break;
            }
        }
        setImmediate(() => {
            this.setState({ filtered_products, })
        })
    }

    removeFilter = (product_ids) => {
        var { filtered_product_ids, products, filtered_products } = this.state
        for (let a = 0; a < product_ids.length; a++) {
            var fids = filtered_product_ids.filter((val) => val == product_ids[a])[0]
            if (fids == product_ids[a]) {
                const index = filtered_product_ids.indexOf(fids);
                filtered_product_ids.splice(index, 1)
            } else {
                console.log("let it rip!")
            }
        }
        filtered_products = []
        for (let i = 0; i < filtered_product_ids?.length; i++) {
            var filterData = products.filter((prs) => prs?.id == filtered_product_ids[i])[0]
            filtered_products.push(filterData)
            if (i == filtered_product_ids?.length - 1) {
                break;
            }
        }
        setImmediate(() => {
            this.setState({ filtered_products, filtered_products })
        })
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

        api.get('/categories/' + '' + '/products', {
            headers: {
                Authorization: `Bearer ${''}`,
            },
        }).catch((err) => {
            console.log("Request Cancel")
        })
        api.get('/products/attributes/' + '' + '/options', {
            headers: {
                Authorization: `Bearer ${''}`,
            },
        }).catch((err) => {
            console.log("Request Cancel")
        })

        axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + "",).catch((err) => {
            console.log("Request Cancel")
        })

        axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + "").catch((err) => {
            console.log("Request Cancel")
        })

    }

    openFilterBoard = () => {
        console.log("opening")
        setImmediate(() => {
            this.setState({
                filterBoardOpen: !this.state.filterBoardOpen
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
                        console.log("Add to cart item api error:  ", err)
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






    render() {
        var { item, imageLinkMain } = this.props?.route?.params;
        var { contact_lens_diameter, contact_lens_base_curve, temple_size, filterKey, filteredPrice, highest_price, lowest_price, bridge_size, gender, temple_material, temple_color, frame_color, frame_material, frame_type, polarized, frame_shape, water_container_content, lense_color, contact_lens_usage, brands, size, model_no, box_content_pcs, color } = this.state;

        return (

            <View style={styles.mainContainer} >
                {/** Screen Header */}
                < HomeHeader navProps={this.props.navigation} />

                {/** Top Image & Category Name */}
                < ImageView    
                    source={{ uri: "https://aljaberoptical.com" + imageLinkMain }}
                    textEN={item?.name}
                    textAR={""}
                />

                {/** Categories if it exists */}
                {
                    this.state.categories !== null &&
                    <CategoryList
                        categories={this.state.categories}
                        selectedItem={(item, index) => this.selectedItems(item, index)}
                    />
                }

                {/* Product List */}


                < ProductList
                    data={this.state.filtered_products.length == 0 ? this.state.products : this.state.filtered_products}
                    loader={this.state.loader}
                    navProps={this.props.navigation}
                    sortBY={(key) => this.sortBy(key)}
                    openFilterBoard={() => this.openFilterBoard()}
                    loaderFilter={this.state.loaderFilter}
                    addToCart={(product, index) => this.addToCart(product, index)}
                    totalProductsLength={this.state.productSkuLength}      
                />


                <FilterBoard
                    key={filterKey}
                    filterBoardOpen={this.state.filterBoardOpen}
                    contact_lens_diameter={contact_lens_diameter}
                    contact_lens_base_curve={contact_lens_base_curve}
                    water_container_content={water_container_content}
                    contact_lens_usage={contact_lens_usage}
                    brands={brands}
                    frame_shape={frame_shape}
                    price={filteredPrice}
                    size={size}
                    temple_size={temple_size}
                    model_no={model_no}
                    lense_color={lense_color}
                    frame_type={frame_type}
                    frame_color={frame_color}
                    frame_material={frame_material}
                    bridge_size={bridge_size}
                    lowest_price={lowest_price}
                    highest_price={highest_price}
                    temple_color={temple_color}
                    temple_material={temple_material}
                    polarized={polarized}
                    gender={gender}
                    box_content_pcs={box_content_pcs}
                    color={color}
                    applyFilter={(product_ids) => this.applyFilter(product_ids)}
                    removeFilter={(product_ids) => this.removeFilter(product_ids)}
                    updatePriceFilter={(val) => this.updatePriceFilter(val)}
                    onDismiss={() => this.openFilterBoard()}
                />


                {this.state.loaderFilter &&
                    <View style={{ position: "absolute", bottom: 0, zIndex: 200, backgroundColor: "#ffffff", width: width, height: 60, justifyContent: "center", alignItems: "center" }}>

                        <ActivityIndicator size="small" color="black" />
                    </View>}

                <TouchableOpacity
                    onPress={() => this.goBack()}
                    style={styles.home_btn}>
                    <Ionicons name="home" size={22} color="white" />
                </TouchableOpacity>

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
    home_btn: {
        width: 50,
        height: 50,
        position: "absolute",
        backgroundColor: "black",
        bottom: 50,
        right: 15,
        zIndex: 200,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
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

export default connect(mapStateToProps, mapDispatchToProps)(Products);