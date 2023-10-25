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
        setImmediate(() => {
            this.setState({
                loader: true,
                loaderFilter: true

            })
        })

        let products = []
        let configurable_Products = []
        let tempPRoducts = []

        // Api to fetch  Array of products sku's of category selected

        await api.get('/categories/' + item.id + '/products', {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        }).then(async (res) => {
            var temp = res?.data

            // once the Array of sku is fetched we use it in a loop to fetch every product detail in the array

            for (let p = 0; p < temp.length; p++) {
                await api.get('/products/' + temp[p]?.sku, {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                }).then(async (prod) => {

                    if (p == temp.length - 1) {
                        setImmediate(() => {
                            this.setState({
                                loaderFilter: false,

                            })
                        })
                    }

                    // then we check the array of custom_attributes in for loop to fetch the attribute Brand to show in the products
                    // on the screen as it is not in the main body of the object

                    for (let i = 0; i < prod?.data.custom_attributes.length; i++) {

                        // in the loop we check for on abject having attribute_code "brands" then pickup it value having ID

                        if (prod?.data.custom_attributes[i].attribute_code == 'brands') {

                            // then we run the API for fetching attributes value by passing the ID we fetch before
                            // await api.get('/products/attributes/' + prod?.data.custom_attributes[i].attribute_code + '/options', {
                            //     headers: {
                            //         Authorization: `Bearer ${admintoken}`,
                            //     },
                            // })
                            //     .then(async (res) => {
                            //         console.log("RES",res?.data)

                                    await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + prod?.data?.custom_attributes[i].value,).then(async (data) => {
                                        prod.data.brand = data?.data

                                        // Condition for fetching products with type_id:"simple"

                                        if (prod?.data?.visibility == 4 && prod?.data?.price > 0 && prod?.data?.extension_attributes?.stock_item?.is_in_stock == true && prod?.data?.status == 1 && prod?.data?.type_id == "simple") {
                                            products.push(prod?.data)
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
                                                            // in the Products screen
                                                            products.push(prod?.data)

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
                                // })
                                // .catch((err) => {
                                //     console.log("More_info Api Error", err?.response)
                                //     //alert("Cant fetch More Information Data, Please Try again!")
                                // })
                            break;
                        }

                    }
                    // }

                    // this is for loader skeleton 
                    if (products?.length >= 1) {
                        setImmediate(() => {
                            this.setState({
                                loader: false,
                            })
                        })
                    }

                    // setting the products in the state once they are all done 
                    setImmediate(() => {
                        this.setState({
                            products: products,
                            original: products,
                        })
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