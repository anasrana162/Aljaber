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
        };
    }

    // fetch data from single category products api
    // then send its sku from the data to Single Product Detail API with loop
    // then add that data to an array

    createData = () => {
        var { item } = this.state;
        const { userData: { admintoken }, actions, userData } = this.props
        // console.log("item Products Screen", item)

        let products = []
        api.get('/categories/' + item.id + '/products', {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        }).then((res) => {
            // console.log("Product Api:", res?.data)
            var temp = res?.data
            // console.log("Products Index:", temp?.length)
            for (let p = 0; p < temp.length; p++) {
                // console.log("res?.data?:", temp[p]?.sku)

                api.get('/products/' + temp[p]?.sku, {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    },
                }).then((prod) => {
                    // console.log("Product Details Api:", res?.data)

                    products.push(prod?.data)
                    // console.log("Api Array index current", p)
                    if (p == temp.length - 1) {

                        setImmediate(() => {
                            this.setState({
                                loader: false,
                                products: products,
                                original: products,
                            })
                            // console.log("Products State", this.state.products)
                        })
                    }


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
        var { item, defaultCategories: { children_data } } = this.props?.route?.params;
        console.log("children_data", item.children_data.length)

        setImmediate(() => {
            this.setState({
                categories: item.children_data.length == 0 ? null : item.children_data
            })
        })
    }

    selectedItems = (item, index) => {

        console.log("Selected Item: ", item)
        if (item.children_data.length !== 0) {

            setImmediate(() => {
                this.setState({
                    item: item,
                })
            })
        } else {
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
                    source={require('../../../assets/Sunglasses_6.jpg')}
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