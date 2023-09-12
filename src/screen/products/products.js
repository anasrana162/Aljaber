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
        };
    }

    // fetch data from single category products api
    // then send its sku from the data to Single Product Detail API with loop
    // then add that data to an array

    createData = async () => {
        var { item } = this.state;
        const { userData: { admintoken }, actions, userData } = this.props
        console.log("item Products Screen", item)

        setImmediate(() => {
            this.setState({
                loader: true,

            })
        })

        let products = []
        await api.get('/categories/' + item.id + '/products', {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        }).then(async (res) => {
             console.log("Product Api:", res?.data)
            var temp = res?.data
            // console.log("Products Index:", temp?.length)
            for (let p = 0; p < temp.length; p++) {
                // console.log("res?.data?:", temp[p]?.sku)

                await api.get('/products/' + temp[p]?.sku, {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                }).then((prod) => {
                    //  console.log("Product Details Api:", res?.data)

                    products.push(prod?.data)
                    // console.log("Api Array index current", p)
                    if (p == temp.length - 1) {

                        setImmediate(() => {
                            this.setState({
                                loader: false,

                            })
                            // console.log("Products State", this.state.products)
                        })
                    }
                    setImmediate(() => {
                        this.setState({

                            products: products,
                            original: products,
                        })
                        // console.log("Products State", this.state.products)
                    })


                }).catch((err) => {
                    //alert("Network Error Code: (CAT#1)")
                    console.log("Product Detail Api error: ", err.response)
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                    this.createData()
                })
            }
        }).catch((err) => {
            //alert("Network Error Code: (CAT#1)")
            console.log("Product Api error: ", err)
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            this.createData()
        })
    }
    inner_Categories = () => {
        var { item, defaultCategories, mainCat_selected } = this.props?.route?.params;
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


        var { item, defaultCategories, mainCat_selected } = this.props?.route?.params;
        //var { userData: { defaultcategory, admintoken } } = this.props
        // console.log("defaultCategories", defaultCategories)
        // because position is giving 1 which index of array in first value while array starts with 0
        var mainIndex = mainCat_selected - 1
        if (mainIndex == 0) {
            mainIndex = 0
        } else {
            // since there is 2nd position missing in data after 1 so thats why subtracting for second time
            // see in defaultCategories console.log or  ImageArray file while matching parent ids
            mainIndex = mainIndex - 1
        }

        // var inner_cats = defaultcategory?.children_data[mainIndex]?.children_data[item.position - 1]?.children_data
        //  var sub_cats=defaultCategories[mainIndex]?.children_data[item.position - 1]

        var sub_index = selecteditem?.position - 1

        var sub_cats = ImageArray[mainIndex]?.children_data[item.position - 1].children_data[sub_index]
        // console.log("mainIndex", mainIndex)
         console.log("inner_cats", sub_cats)
        // console.log("Selected Item: ", selecteditem)
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

    componentDidMount = () => {
        this.createData()
        this.inner_Categories()
    }

    render() {
        var { item } = this.props?.route?.params;
        // console.log("Products State", this.state.products)
        return (
            <View style={styles.mainContainer}>
                {/** Screen Header */}
                <HomeHeader />

                {/** Top Image & Category Name */}
                <ImageView
                    source={{ uri: "https://aljaberoptical.com/" + item?.img }}
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


                {this.state.products != null && < ProductList data={this.state.products} loader={this.state.loader} />}


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