import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from './components/homeHeader';
import Swiper from './components/Swiper';
import TabNavigator from '../../components_reusable/TabNavigator';
import HomeCategories from './components/homeCategories';
import api from '../../api/api';
import RNRestart from 'react-native-restart';
import NetInfo from "@react-native-community/netinfo";
import DefaultCategories from './components/defaultCategories';
import ProductList from '../products/components/productList';
{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import Loading from '../../components_reusable/loading';
import { ImageArray } from '../categories/categoryData';
import { ProductData } from './productData';
const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

var sliderImages = [
    // {
    //     id: 1,
    //     source: "https://aljaberoptical.com/media/magestore/bannerslider/images/3/0/30-50_-02.jpg"
    // }, {
    //     id: 2,
    //     source: "https://aljaberoptical.com/media/magestore/bannerslider/images/w/e/web_banner_back_b.jpg"
    // },
    // {
    //     id: 3,
    //     source: "https://aljaberoptical.com/media/magestore/bannerslider/images/w/e/web_banner_t.jpg"
    // },
    // {
    //     id: 4,
    //     source: "https://aljaberoptical.com/media/magestore/bannerslider/images/e/a/ea_kids.jpg"
    // },
    // {
    //     id: 5,
    //     source: "https://aljaberoptical.com/media/magestore/bannerslider/images/e/a/ea_web_banner_1.jpg"
    // },
    // {
    //     id: 6,
    //     source: "https://aljaberoptical.com/media/magestore/bannerslider/images/o/l/oliver_peoples_web_banner.jpg"
    // },
    {
        id: 7,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/c/o/contact_lenses_web_banner_final.jpg"
    },
    {
        id: 8,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/c/o/color_contact_lenses_web_banner_copy_3.jpg"
    },
    {
        id: 9,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/a/y/ayis_high_20230427073515.jpg"
    },
]
var category = [
    {
        id: 1,
        img: "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/man-cat.jpg",
        categoryName: "Men"
    },
    {
        id: 2,
        img: "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/women-cat.jpg",
        categoryName: "Women"
    },
    {
        id: 3,
        img: "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/kid-cat.jpg",
        categoryName: "Kids"
    },
    {
        id: 4,
        img: "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/sunglasses-cat.jpg",
        categoryName: "Acessories"
    },
]

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultCategories: null,
            loader: false,
            categoryApiCounter: 0,
            network: true,
            defaultCategories1: null,
            selectedCat: null,
            selectedSubCat: null,
            tempArray: [],
            firstSubItem: null,
            randomProducts: null,
            topCategoryData: null,
        };
    }

    componentDidMount = () => {
        this.getDefaultCategories()
        this.unsubscribe()
        // this.randomProducts()
    }

    adminApi = async () => {

        // console.log(this.props)
        const { actions } = this.props
        var { adminTokenCounter } = this.state

        await api.post('integration/admin/token', {
            "username": "apiuser",
            "password": "Pakistani2023"
        }).then((res) => {
            console.log("Admin Api res: ||||| ", res?.data)
            if (res?.data) {
                setImmediate(() => {
                    actions.adminToken(res?.data)
                    this.setState({
                        adminToken: res?.data
                    })
                })
            }
        })
            .catch((err) => {
                console.log("Admin Api Error", err)
                console.log("Admin Api Error", err?.response)

                if (adminTokenCounter == 3) {
                    RNRestart.restart()
                } else {
                    setTimeout(() => {
                        adminTokenCounter = adminTokenCounter + 1
                        this.setState({ adminTokenCounter })
                        this.adminApi()
                    }, 5000);

                }
                // this.checkAdminToken()
            })
    }

    getDefaultCategories = async () => {

        const { actions, userData } = this.props
        var { categoryApiCounter } = this.state
        if (this.state.network == true) {

            if (userData?.admintoken == null) {
                console.log("Admin Token is null");
                // alert("Network error check your connection")
                this.adminApi()
                setImmediate(() => {
                    this.setState({ loader: true })
                })
                setTimeout(() => {
                    this.setState({ loader: false })
                    this.getDefaultCategories()
                }, 5000);
            } else {
                setImmediate(() => {
                    this.setState({ loader: true })
                })
                await api.get('categories', {
                    headers: {
                        Authorization: `Bearer ${userData?.admintoken}`,
                    },
                }).then((res) => {
                    //console.log("User Data:", res?.data)

                    setImmediate(() => {
                        this.setState({

                            defaultCategories: res?.data
                        })
                        actions.defaultCategories(res?.data)

                        setTimeout(() => {
                            this.defaultCategories()
                        }, 500)

                    })


                }).catch((err) => {
                    //alert("Network Error Code: (CAT#1)")
                    console.log("categories Api error: ", err.response)
                    setTimeout(() => {

                        if (categoryApiCounter == 3) {
                            RNRestart.restart();
                        } else {

                            categoryApiCounter = categoryApiCounter + 1
                            this.setState({ categoryApiCounter })
                            this.getDefaultCategories()
                        }
                    }, 3000);
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                })
            }
        }
    }

    defaultCategories = () => {
        const { actions, userData: { defaultcategory, admintoken } } = this.props
        if (Object.keys(defaultcategory).length !== 0) {
            //console.log("working")
            var { children_data } = defaultcategory
            var obj = {}
            var tempArray1 = [];

            for (let i = 0; i < children_data.length; i++) {
                // console.log(children_data[i]?.children_data.length)
                for (let j = 0; j < ImageArray.length; j++) {

                    if (ImageArray[j]?.id == children_data[i]?.id) {
                        var obj = {
                            "id": children_data[i]?.id,
                            "parent_id": children_data[i]?.parent_id,
                            "name": children_data[i]?.name,
                            "is_active": ImageArray[j]?.is_active,
                            "position": children_data[i]?.position,
                            "level": children_data[i]?.level,
                            "product_count": children_data[i]?.product_count,
                            "img": ImageArray[j]?.img,
                            "placeHolder": ImageArray[j]?.placeHolder,
                            "children_data": []
                        };
                        tempArray1.push(obj)

                        break;

                    }
                    if (ImageArray[i]?.id == undefined) {
                        var obj = {
                            "id": children_data[i]?.id,
                            "parent_id": children_data[i]?.parent_id,
                            "name": children_data[i]?.name,
                            "is_active": children_data[i]?.is_active,
                            "position": children_data[i]?.position,
                            "level": children_data[i]?.level,
                            "product_count": children_data[i]?.product_count,
                            "img": "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg",
                            "placeHolder": true,
                            "children_data": []
                        };
                        // tempArray1.push(obj)
                        // break;

                        for (let tA = 0; tA < tempArray1.length; tA++) {
                            if (tempArray1[tA]?.length == children_data[i]?.length) {
                                break;
                            } else {

                                tempArray1[tA]?.push(obj)
                            }

                        }

                    }
                }

                for (let j = 0; j < ImageArray.length; j++) {
                    // console.log(" ImageArray[j]?.children_data.length)", ImageArray[j]?.children_data.length)
                    //  Sub Cat
                    if (children_data[i]?.children_data.length !== 0) {

                        for (let ccl = 0; ccl < children_data[i]?.children_data.length; ccl++) {


                            for (let iA = 0; iA < ImageArray[j]?.children_data?.length; iA++) {

                                // console.log(ImageArray[j]?.children_data[iA])
                                var obj2 = {}
                                if (ImageArray[j]?.children_data[iA]?.id == children_data[i]?.children_data[ccl]?.id) {


                                    obj2 = {
                                        "id": children_data[i]?.children_data[ccl]?.id,
                                        "parent_id": children_data[i]?.children_data[ccl]?.parent_id,
                                        "name": children_data[i]?.children_data[ccl]?.name,
                                        "is_active": children_data[i]?.children_data[ccl]?.is_active,
                                        "position": children_data[i]?.children_data[ccl]?.position,
                                        "level": children_data[i]?.children_data[ccl]?.level,
                                        "product_count": children_data[i]?.children_data[ccl]?.product_count,
                                        "img": ImageArray[j]?.children_data[iA]?.img,
                                        "placeHolder": ImageArray[j]?.children_data[iA]?.placeHolder,
                                        "children_data": []
                                    };

                                    for (let tA = 0; tA < tempArray1.length; tA++) {
                                        if (children_data[i]?.id == tempArray1[tA]?.id) {
                                            tempArray1[tA]?.children_data.push(obj2)
                                            break;
                                        }
                                    }
                                }
                            }
                            if (ImageArray[i]?.children_data[ccl]?.id == undefined) {
                                var obj2 = {
                                    "id": children_data[i]?.children_data[ccl]?.id,
                                    "parent_id": children_data[i]?.children_data[ccl]?.parent_id,
                                    "name": children_data[i]?.children_data[ccl]?.name,
                                    "is_active": children_data[i]?.children_data[ccl]?.is_active,
                                    "position": children_data[i]?.children_data[ccl]?.position,
                                    "level": children_data[i]?.level,
                                    "product_count": children_data[i]?.children_data[ccl]?.product_count,
                                    "img": "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg",
                                    "placeHolder": true,
                                    "children_data": []
                                };

                                for (let tA = 0; tA < tempArray1.length; tA++) {
                                    if (tempArray1[tA]?.children_data.length == children_data[i]?.children_data.length) {
                                        break;
                                    } else {

                                        tempArray1[tA]?.children_data.push(obj2)
                                    }

                                }

                            }
                        }
                    }
                }
            }
        }
        // console.log("tempArray1", tempArray1[1])
        actions?.createdDefaultCategories(tempArray1)
        this.setState({

            defaultCategories1: tempArray1,
            firstSubItem: tempArray1[1]
        });
        this.topCatData(tempArray1)
    }

    unsubscribe = NetInfo.addEventListener(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        console.log("isInternetReachable", state.isInternetReachable)
        console.log("details", state.details)
        if (state.isConnected == false || state.isInternetReachable == false) {
            setImmediate(() => {
                this.setState({
                    network: false,
                })
            })
        } else {
            setImmediate(() => {
                this.setState({
                    network: true,
                })
            })
        }
    });

    topCatData = (array) => {
        let arr = []
        for (let ar = 0; ar < array.length; ar++) {
            if (array[ar]?.id == 26) {
                arr.push(array[ar])
            }
        }
        console.log("Top Categories:", arr[0]?.children_data)
        setImmediate(() => {
            this.setState({
                loader: false,
                topCategoryData: arr
            })
        })

    }

    randomProducts = () => {

        let randomProducts = []
        let RPID = []
        for (let p = 0; p < 6; p++) {

            if (RPID.length == 0) {
                const randomIndex = Math.floor(Math.random() * ProductData.length);
                // console.log("randomIndex RPID LENGTH COND", randomIndex)
                randomProducts[p] = ProductData[randomIndex]
                RPID.push(randomIndex)
            } else {
                for (let t = 0; t < RPID.length; t++) {
                    const randomIndex = Math.floor(Math.random() * ProductData.length);
                    if (RPID[t] !== randomIndex) {
                        // const randomIndex = Math.floor(Math.random() * ProductData.length);
                        // console.log("randomIndex RPID LENGTH COND", randomIndex)
                        randomProducts[p] = ProductData[randomIndex]
                    } else {
                        const randomIndex = Math.floor(Math.random() * ProductData.length);
                        // console.log("randomIndex RPID LENGTH COND", randomIndex)
                        randomProducts[p] = ProductData[randomIndex]
                    }
                }
            }





        }
        // console.log("randomProducts Array", randomProducts)

        setImmediate(() => {
            this.setState({
                randomProducts: randomProducts,
            })
        })

    }



    render() {

        return (
            <View style={styles.mainContainer}>

                {/** Header for Home Screen */}
                <HomeHeader />

                <ScrollView>
                    {/** Swiper below header */}
                    <Swiper data={sliderImages} />

                    {/* * Default Categories */}
                    {this.state.loader == false && <DefaultCategories
                        data={this.state.defaultCategories1}
                        navProps={this.props.navigation}
                        firstSubItem={this.state.firstSubItem}
                    />}

                    <ProductList
                        screenName="Home"
                        data={ProductData == null ? [] : ProductData}
                        loader={this.state.loader}
                        navProps={this.props.navigation}
                    />


                    {/** Categories like men, women etc */}
                    <HomeCategories
                        data={this.state.topCategoryData == null ? [] : this.state.topCategoryData[0]?.children_data}
                        mainCatPos={this.state.topCategoryData == null ? null : this.state.topCategoryData[0]?.position}
                        navProps={this.props.navigation}
                    />




                </ScrollView>

                {/** Tab Navigator */}
                <TabNavigator
                    screenName={"home"}
                    navProps={this.props.navigation}
                />

                {/* Loader */}
                {this.state.loader &&
                    <Loading />
                }


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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);