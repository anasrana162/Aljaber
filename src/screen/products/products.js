import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from '../home/components/homeHeader';
import TabNavigator from '../../components_reusable/TabNavigator';

import api from '../../api/api';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import ImageView from './components/ImageView';
import CategoryList from './components/categoryList';
import ProductList from './components/productList';
import { ImageArray } from '../categories/categoryData';
import axios from 'axios';
const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: null,
            categories: null,
            item: this.props?.route?.params?.item,
            original: null,
            loader: false,
            loaderFilter: false,
            productApiCounter: 0,
        };
    }

    // fetch data from single category products api
    // then send its sku from the data to Single Product Detail API with loop
    // then add that data to an array

    createData = async () => {
        var { item, productApiCounter } = this.state;
        const { userData: { admintoken, allproducts }, actions, userData } = this.props
        // console.log("item Products Screen]]]]]]]]]]]]]]]]",)

        setImmediate(() => {
            this.setState({
                loader: true,
                loaderFilter: true

            })
        })

        let products = []
        let configurable_Products = []
        let tempPRoducts = []
        await api.get('/categories/' + item.id + '/products', {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        }).then(async (res) => {
            //console.log("Product Api:", res?.data)
            var temp = res?.data
            // console.log("Products Index:", temp?.length)
            for (let p = 0; p < temp.length; p++) {
                // console.log("res?.data?:", temp[p]?.sku)

                await api.get('/products/' + temp[p]?.sku, {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                }).then(async (prod) => {
                    // console.log("Product Details Api:", prod?.data?.visibility, "  ", prod?.data?.price)


                    //    products.push(prod?.data)

                    // console.log("Api Array index current", products)
                    if (p == temp.length - 1) {
                        // console.log("Products List", products)
                        setImmediate(() => {
                            this.setState({
                                loaderFilter: false,

                            })
                        })
                    }

                    // for (let p = 0; p < products.length; p++) {

                    for (let i = 0; i < prod?.data.custom_attributes.length; i++) {


                        if (prod?.data.custom_attributes[i].attribute_code == 'brands') {
                            await api.get('/products/attributes/' + prod?.data.custom_attributes[i].attribute_code + '/options', {
                                headers: {
                                    Authorization: `Bearer ${admintoken}`,
                                },
                            })
                                .then(async (res) => {
                                    // console.log("")
                                    // console.log("----------------------------")
                                    // console.log("Item DEtails Api:", res?.data)
                                    // console.log("----------------------------")
                                    // console.log('')

                                    // console.log("products[p].custom_attributes[i].attribute_code", products[p].custom_attributes[i].value)

                                    await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,).then(async (data) => {

                                        // console.log("Data coming for brands:", data?.data)
                                        prod.data.brand = data?.data
                                        if (prod?.data?.visibility == 4 && prod?.data?.price > 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "simple") {
                                            products.push(prod?.data)
                                        }
                                        if (prod?.data?.price == 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "configurable") {
                                            // tempPRoducts.push(prod?.data)

                                            console.log("prod?.data?.extension_attributes?.configurable_product_links?.length", prod?.data?.extension_attributes?.configurable_product_links)


                                            for (let tp = 0; tp < prod?.data?.extension_attributes?.configurable_product_links?.length; tp++) {
                                                console.log("VAlue Given for varients", prod?.data?.extension_attributes?.configurable_product_links[tp])
                                                const selected_products = allproducts.filter((value) => value?.id == prod?.data?.extension_attributes?.configurable_product_links[tp])[0]
                                                // for (let cf = 0; cf < allproducts.length; cf++) {
                                                console.log("Product With index", selected_products)

                                                if (prod?.data?.extension_attributes?.configurable_product_links[tp] == selected_products?.id) {
                                                    // console.log("show Configurable varients filter", allproducts[cf]?.id," ",prod?.data?.extension_attributes?.configurable_product_links[tp])

                                                    var check = false
                                                    await api.get('/products/' + selected_products?.sku, {
                                                        headers: {
                                                            Authorization: `Bearer ${admintoken}`,
                                                        },
                                                    }).then(async (cfPD) => {
                                                        // await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,)
                                                        console.log("Configurable Product Details Api Response |||||", cfPD?.data?.name, "   ", cfPD?.data?.id)

                                                        cfPD.data.brand = data?.data // brand value
                                                        // if (tempPRoducts?.length !== prod?.data?.extension_attributes?.configurable_product_links?.length - 1) {

                                                            tempPRoducts.push(cfPD?.data)
                                                            // check = true
                                                      
                                                        // prod.data.price = cfPD.data?.price
                                                        // prod.data.product_varients = tempPRoducts
                                                        // console.log("Configurable Product Details Api Response", prod?.data?.name, "   ", prod?.data?.id)

                                                        // configurable_Products.push(prod?.data)
                                                        if (tp == prod?.data?.extension_attributes?.configurable_product_links?.length - 1) {
                                                            // for(let t= 0;t<configurable_Products?.length;t++){
                                                            prod.data.price = cfPD.data?.price
                                                            prod.data.product_varients = tempPRoducts
                                                            console.log("")
                                                            console.log("")
                                                            console.log("---------FINAL----------")
                                                            console.log("")
                                                            console.log("prod?.data", prod?.data?.id, "  ", prod?.data?.name, "  ", prod?.data?.type_id)
                                                            console.log("")
                                                            console.log("---------FINAL----------")
                                                            console.log("")
                                                            console.log("")
                                                            products.push(prod?.data)
                                                            tempPRoducts=[]
                                                            check = true

                                                        }


                                                    }).catch((err) => {
                                                        console.log("Configurable Product Details Api Error", err)

                                                    })
                                                    if (check == true) {
                                                        console.log("breaken-----------------------------------------")
                                                        break;
                                                    }



                                                } else {

                                                }



                                            }
                                            //  products.push(temp)

                                        }



                                    }).catch((err) => {
                                        console.log("DAta for Brands Api errr", err)
                                    })


                                })
                                .catch((err) => {
                                    console.log("More_info Api Error", err?.response)
                                    //alert("Cant fetch More Information Data, Please Try again!")
                                })

                            break;
                        }

                    }
                    // }

                    // this is for loader skeleton 
                    // console.log("Products Lenght", products[1]?.product_varients[0]?.name)
                    if (products?.length >= 1) {
                        setImmediate(() => {
                            this.setState({
                                loader: false,
                            })
                        })
                    }

                    setImmediate(() => {
                        this.setState({
                            products: products,
                            original: products,
                            // loader: false,
                        })
                        //s console.log("Products State", this.state.products[0].custom_attributes)
                    })


                }).catch((err) => {
                    //alert("Network Error Code: (CAT#1)")

                    console.log("Product Detail Api error on:  ", temp[p]?.sku)
                    return setImmediate(() => {
                        this.setState({
                            loader: false
                        })

                    })

                })
            }
        }).catch((err) => {
            //alert("Network Error Code: (CAT#1)")
            if (productApiCounter == 3) {

                productApiCounter = productApiCounter + 1
                console.log("Product Api error: ", err)
                setImmediate(() => {
                    this.setState({
                        loader: false
                    })
                })
                this.createData()
            }
            else {
                alert("Network Error")
                // this.props.navigation.goBack();


            }
        })

        // for (let cf = 0; cf < tempPRoducts.length; cf++) {
        //     console.log("")
        //     console.log("-----------")
        //     console.log("Configurable Products Name", tempPRoducts[cf].name)
        //     console.log("-----------")
        //     console.log("")
        //     console.log("-----------")
        //     console.log("Configurable Products Index", cf)
        //     console.log("-----------")
        //     console.log("")
        //     console.log("-----------")
        //     console.log("Configurable Products id", tempPRoducts[cf].id)
        //     console.log("")
        //     console.log("-----------")
        //     console.log("Configurable Products extension_attributes?.configurable_product_links", tempPRoducts[cf].extension_attributes?.configurable_product_links)
        //     console.log("-----------")
        //     console.log("")

        //     for (let cpl = 0; cpl < tempPRoducts[cf].extension_attributes?.configurable_product_links.length; cpl++) {

        //         // console.log("CPL Items", tempPRoducts[cf].extension_attributes?.configurable_product_links[cpl])

        //         const selected_products = allproducts.filter((value) => value?.id == tempPRoducts[cf].extension_attributes?.configurable_product_links[cpl])[0]
        //         if (tempPRoducts[cf].extension_attributes?.configurable_product_links[cpl] == selected_products?.id && selected_products?.type_id == "virtual"){
        //             console.log("check:    ", selected_products)

        //             await api.get('/products/' + selected_products?.sku, {
        //                 headers: {
        //                     Authorization: `Bearer ${admintoken}`,
        //                 },
        //             }).then(async (cfPD) => {
        //                 // await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,)
        //                 // console.log("Configurable Product Details Api Response |||||", cfPD?.data?.name, "   ", cfPD?.data?.id)

        //                 cfPD.data.brand = tempPRoducts[cf]?.brand // brand value

        //                 configurable_Products.push(cfPD?.data)
        //                 tempPRoducts[cf].price = cfPD.data?.price
        //                 tempPRoducts[cf].product_varients = configurable_Products
        //                 console.log("Configurable Product Details Api Response", tempPRoducts[cf]?.name, "   ", tempPRoducts[cf]?.id)
        //                 products.push(tempPRoducts[cf])


        //             }).catch((err) => {
        //                 console.log("Configurable Product Details Api Error", err)
        //             })
        //         }

        //     }



        // }
        // setImmediate(() => {
        //     this.setState({
        //         products: products,
        //         original: products,
        //         // loader: false,
        //     })
        //     //s console.log("Products State", this.state.products[0].custom_attributes)
        // })


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
                // console.log("position Working")
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

                //console.log(users);
                break;

            case "price":
                // console.log("price Working")
                this.state.products.sort(function (a, b) { return a.price - b.price });
                setImmediate(() => {
                    this.setState({ products })
                })
                break;

            case "brands":
                // console.log("Brands of products", this.state.products[0].brand)
                this.state.products.sort(function (a, b) {
                    if (a.brand < b.brand) {
                        return 1;
                    }
                    if (a.brand > b.brand) {
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

    componentDidMount = () => {
        this.createData()
        this.inner_Categories()

    }
    componentWillUnmount = () => {
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
    }

    render() {
        var { item } = this.props?.route?.params;
        return (
            <View style={styles.mainContainer}>
                {/** Screen Header */}
                <HomeHeader />

                {/** Top Image & Category Name */}
                <ImageView
                    source={item?.parent_id == 102 ?
                        { uri: "https://aljaberoptical.com/pub/media/catalog/category_mobile/" + item?.parent_id + ".jpg" }
                        :
                        { uri: "https://aljaberoptical.com/pub/media/catalog/category_mobile/" + item?.id + ".jpg" }}
                    textEN={item?.name}
                    textAR={""}
                />

                {/** Categories if it exists */}
                {this.state.categories !== null &&
                    <CategoryList
                        categories={this.state.categories}
                        selectedItem={(item, index) => this.selectedItems(item, index)}
                    />
                }

                {/* Product List */}


                < ProductList
                    data={this.state.products}
                    loader={this.state.loader}
                    navProps={this.props.navigation}
                    sortBY={(key) => this.sortBy(key)}
                    loaderFilter={this.state.loaderFilter}
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