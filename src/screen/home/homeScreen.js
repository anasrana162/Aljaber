import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from './components/homeHeader';
import Swiper from './components/Swiper';
import TabNavigator from '../../components_reusable/TabNavigator';
import HomeCategories from './components/homeCategories';
import api, { custom_api_url, basis_auth } from '../../api/api';
import { encode as base64encode } from 'base-64'
import axios from 'axios';
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
import StoreFeatures from '../products/components/storeFeatures';
import NewsLetter from '../../components_reusable/newsLetter';
import CustomerServices from '../../components_reusable/customerServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from '../../components_reusable/drawer.js';
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
    //     source: "https://aljaberoptical.com/media/magestore/bannerslider/images/b/a/banners_ajo_1950_x_450-02.jpg"
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

var topCategory = [
    {
        "id": 42,
        "parent_id": 26,
        "name": "Men",
        "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/man-cat.jpg",
        "is_active": true,
        "position": 1,
        "level": 3,
        "product_count": 175,
        "children_data": []
    },
    {
        "id": 43,
        "parent_id": 26,
        "name": "Women",
        "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/women-cat.jpg",
        "is_active": true,
        "position": 2,
        "level": 3,
        "product_count": 209,
        "children_data": []
    },
    {
        "id": 44,
        "parent_id": 26,
        "name": "Kids",
        "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/kid-cat.jpg",
        "is_active": true,
        "position": 3,
        "level": 3,
        "product_count": 97,
        "children_data": []
    },
    {
        "id": 122,
        "parent_id": 102,
        "name": "Acessories",
        "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/sunglasses-cat.jpg",
        "is_active": true,
        "image": "/pub/media/wysiwyg/smartwave/porto/theme_assets/images/banner2.jpg",
        "position": 1,
        "level": 3,
        "product_count": 41,
        "children_data": []
    },
]

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultCategories: this.props.userData?.defaultcategory,
            loader: false,
            loaderDot: false,
            categoryApiCounter: 0,
            network: true,
            defaultCategories1: null,
            selectedCat: null,
            selectedSubCat: null,
            tempArray: [],
            firstSubItem: null,
            randomProducts: null,
            topCategoryData: this.props.userData?.topcatdata,
            drawer: false,
            banners: [],
        };
    }

    componentDidMount = () => {
        // this.adminApi()     
        this.props.navigation.addListener('focus', async () => {
            this.adminApi(),
                setTimeout(() => {
                    this.fetchUserOrders()
                    this.loginUser()
                });
        }, 1000)
        this.defaultCategories()
        this.randomProducts()
        this.getBanners()
        this.unsubscribe()

        // 
    }

    getBanners = () => {
        axios.get(custom_api_url + "func=get_home_banners").then((res) => {
            // console.log("fethch Banners Api Res", res?.data);
            setImmediate(() => {
                this.setState({ banners: res?.data })
            })
        }).catch((err) => {
            console.log("Get Banners api Error:", err);
        })
    }

    loginUser = async () => {

        var { actions } = this.props

        var LoginData = await AsyncStorage.getItem("@aljaber_userLoginData")
        var objLoginData = JSON.parse(LoginData)
        console.log("LoginData", objLoginData)
        if (objLoginData !== null) {

            var customerToken = await api.post('integration/customer/token', {
                username: objLoginData?.username,
                password: objLoginData?.password,
            })

            // console.log("customerToken", customerToken?.data)
            if (customerToken?.data !== "") {
                const res = await api.post(
                    "carts/mine",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${customerToken?.data}`,
                            "Content-Type": "application/json",
                        },
                    }
                ).then((result) => {


                    // console.log("========Success ALJEBER============ Home", result?.data);

                    api.get('customers/me', {
                        headers: {
                            Authorization: `Bearer ${customerToken?.data}`,
                        },
                    }).then((user_data) => {


                        if (user_data?.data) {
                            // console.log("TOKEN GENERATED============Home",)
                            actions.userToken(customerToken?.data)
                            user_data.data.cartID = result?.data
                            actions.user(user_data?.data)

                        }
                    }).catch((err) => {
                        alert("Network Error Code: (cd1)")
                        console.log("customer data Api error HOme: ", err?.response)

                    })
                }).catch((err) => {
                    console.log("Error AddtoCart ID API Home:", err?.message)

                })
            }
        }
        else {
            var guestCartKey = await AsyncStorage.getItem("@aljaber_guestCartKey")
            var guestCartID = await AsyncStorage.getItem("@aljaber_guestCartID")
            if (guestCartKey == null || guestCartID == null) {
                this.getGuestCartKey()
            } else {

                console.log("Guest Key exists");
                actions.guestCartKey(guestCartKey)
                actions.guestCartID(JSON.parse(guestCartID))
                console.log("No credentials found for login")
            }
        }
    }

    getGuestCartKey = async () => {
        var { actions } = this.props
        await api.post("guest-carts")
            .then(async (result) => {
                console.log("Guest Cart Key in Home.js:", result?.data);
                var guestCartID = await AsyncStorage.getItem("@aljaber_guestCartID")
                if (guestCartID == null) {
                    await api.get("guest-carts/" + result?.data)
                        .then((res) => {
                            console.log("Guest Cart ID in Home.js:", res?.data);
                            AsyncStorage.setItem("@aljaber_guestCartID", JSON.stringify(res?.data));
                            AsyncStorage.setItem("@aljaber_guestCartKey", result?.data);
                            actions.guestCartKey(result?.data)
                            actions.guestCartID(res?.data)
                        }).catch((err) => {
                            console.log("Guest Cart ID in Home.js Error:", err.response.data.message);
                        })
                }
            }).catch((err) => {
                console.log("Guest Cart Key in Home.js Error:", err);
            })
    }

    // fetchAllProductsForSearch = async () => {
    //     var { actions } = this.props
    //     var fetchProducts = await api.get(custom_api_url + "func=get_all_products")
    //     let products = []
    //     for (let i = 0; i < fetchProducts?.data.length; i++) {
    //         if (fetchProducts?.data[i].type == "configurable" || fetchProducts?.data[i].type == "simple" && fetchProducts?.data[i].visibility == 4) {
    //             products.push(fetchProducts?.data[i])
    //         }
    //     }

    //     actions?.searchProducts(products)
    //     // console.log("Fetched products final:", products)

    // }
    //     componentWillUnmount=()=>{
    // this.unsubscribe()
    //     }

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

        const { actions, userData: { admintoken } } = this.props
        var { categoryApiCounter, adminToken } = this.state
        setImmediate(() => {
            this.setState({ loader: true })
        })
        if (this.state.network == true) {

            await api.get('categories', {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            }).then((res) => {
                //console.log("User Data:", res?.data)

                setImmediate(() => {
                    this.setState({

                        defaultCategories: res?.data
                    })
                    actions.defaultCategories(res?.data)

                    setTimeout(() => {
                        this.loginUser()
                        this.defaultCategories()
                        this.topCategoryData()
                        // this.fetchAllProductsForSearch()
                        this.randomProducts()
                    }, 500)

                })


            }).catch((err) => {
                //alert("Network Error Code: (CAT#1)")
                console.log("categories Api error: ", err)
                setTimeout(() => {

                    if (categoryApiCounter == 3) {
                        RNRestart.restart();
                    } else {

                        categoryApiCounter = categoryApiCounter + 1
                        this.setState({ categoryApiCounter })
                        this.adminApi()
                        this.getDefaultCategories()
                    }
                }, 3000);
                // setImmediate(() => {
                //     this.setState({
                //         // loader: false
                //     })
                // })
            })
        }
        // }
    }

    defaultCategories = async () => {
        const { actions, userData: { defaultcategory, admintoken } } = this.props

        var { children_data } = defaultcategory
        // console.log("tempArray1", defaultcategory)
        // actions?.createdDefaultCategories(children_data)
        setImmediate(() => {
            this.setState({ loader: true })
        })
        // this to to hide some categories ID's are specified in switch
        var tempArr = []
        for (let i = 0; i < children_data?.length; i++) {

            // var image = "/pub/media/wysiwyg/smartwave/porto/theme_assets/images/banner2.jpg"
            await api.get(custom_api_url + "func=get_category_image&catid=" + children_data[i]?.id)
                .then((res) => {
                    // console.log("Response for Top Category API:", res?.data)


                    // console.log("Image fetch", res?.data);


                    children_data[i].image = "https://aljaberoptical.com" + res?.data?.image
                    children_data[i].visibe_menu = res?.data?.visibe_menu
                    // console.log("children_data defaultCategories", children_data[i]);
                    if (children_data[i].visibe_menu == "1") {

                        tempArr.push(children_data[i])
                    }
                    // switch (children_data[i].id) {
                    //     case 50:
                    //         children_data[i].is_active = false
                    //         break;
                    //     case 72:
                    //         children_data[i].parent_position = defaultcategory.position
                    //         actions.offersObj(children_data[i])
                    //         children_data[i].is_active = false
                    //         break;
                    //     case 89:
                    //         children_data[i].is_active = false
                    //         break;
                    //     case 128:
                    //         children_data[i].is_active = false
                    //         break;

                    //     default:
                    //         // /children_data[i].is_active = true
                    //         tempArr.push(children_data[i])
                    //         break;
                    // }



                }).catch((err) => {
                    console.log("Err Fetching image in DefaultCategoryItems: ", err)
                })

        }
        // console.log(tempArr);
        actions?.createdDefaultCategories(tempArr)
        this.setState({
            defaultCategories1: tempArr,
            firstSubItem: tempArr[0],
            loader: false,
        });
        tempArr = []
        // this.topCatData(tempArr)
        // this.topCategoryData()
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

    topCategoryData = async () => {
        var { userData: { admintoken } } = this.props
        var { topCategoryData } = this.state
        for (let i = 0; i < topCategory.length; i++) {
            // this api is being used for taking out image link for product screen top image
            await api.get("categories/" + topCategory[i]?.id, {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                }
            }).then((res) => {
                if (topCategory[i]?.id == 122) {
                    topCategoryData.push(topCategory[i])

                }
                for (let r = 0; r < res?.data?.custom_attributes.length; r++) {
                    if (res?.data?.custom_attributes[r].attribute_code == "image") {
                        topCategory[i].image = res?.data?.custom_attributes[r].value
                        topCategoryData.push(topCategory[i])
                        break;
                    }
                    // this cndition is for Acessories because it doenst have a attribute code "image" so there is no image link and
                    // thats why in the array imagelink is manually given so it is also pushed in the array
                    // as it is without any modification like above rest which have attribute code image
                    if (topCategory[i]?.id == 122) {
                        // topCategoryData.push(topCategory[i])
                        break;
                    }
                }
            }).catch((err) => {
                console.log("fetching Image link api error Homescreen ", err)
            })
        }
        setImmediate(() => {
            this.setState({
                // loader: false,
                topCategoryData
            })
        })
    }

    randomProducts = async () => {
        var { userData } = this.props
        var sku_arr = []
        var temp_sku_arr = []

        setImmediate(() => {
            this.setState({ loaderDot: true })
        })

        // Fetch all Products
        await api.get('/products?fields=items[id,sku,name,type_id]&searchCriteria=all', {
            headers: {
                Authorization: `Bearer ${userData?.admintoken}`,
            },
        }).then((res) => {

            if (res?.data) {
                // console.log("Response All Products API", res?.data?.items)
                for (let r = 0; r < res?.data?.items?.length; r++) {
                    // store only that have type_id simple
                    temp_sku_arr?.push(res?.data?.items[r])
                    if (res?.data?.items[r]?.type_id == "simple") {
                        sku_arr.push(res?.data?.items[r])

                    }

                }
            }

        }).catch((err) => {
            console.log("Error All Products API", err)
        })

        // Generate random Index number to store some from huge amount of products
        // console.log("Stored Products length", sku_arr?.length)
        var { actions } = this.props
        actions?.allProducts(temp_sku_arr)
        var store_product = []
        var index = 15
        var store_index = []
        for (let i = 0; i < index; i++) {
            var random_index = parseInt(Math.random() * sku_arr?.length);

            // check for repitition in values
            // console.log("Random Index", random_index)
            const findIndex = store_index.find((i) => {
                //console.log("IIIIII",i)
                return i == random_index
            })
            // console.log("Random_index generated",)
            if (findIndex !== random_index) {
                store_index.push(random_index)
            } else {
                random_index = parseInt(Math.random() * sku_arr?.length);
                //store_index.push(random_index)
            }

            // Getting product details from each sku
            await api.get('/products/' + sku_arr[random_index]?.sku, {
                headers: {
                    Authorization: `Bearer ${userData?.admintoken}`,
                },
            }).then(async (res) => {
                if (res?.data) {
                    // console.log("Product Details Api in Random Products Function Response:   ", res?.data?.custom_attributes, "  ", sku_arr[random_index],)
                    if (res?.data?.price > 0 && res?.data?.visibility == 4 && res?.data?.extension_attributes?.stock_item?.is_in_stock == true && res?.data?.status == 1) {
                        // storing products with its detail in array
                        var brand = res?.data?.custom_attributes.filter((val) => val?.attribute_code == "brands")[0]
                        // console.log("Brand",brand)

                        await axios.get('https://aljaberoptical.com/pub/script/custom_api.php?func=option_label&id=' + brand.value,).then(async (data) => {
                            res.data.brand = data?.data
                            // console.log("res?.data", res?.data?.brand)

                            store_product.push(res?.data)
                        }).catch((err) => {
                            console.log("Brand value error random products", err)
                        })


                    } else {
                        console.log(" adding Index 1")
                        // index = index + 1
                    }

                }

            }).catch((err) => {
                // console.log("Product Details Api in Random Products Function ERROR", err)
                index = index + 1
            })

        }


        setImmediate(() => {
            var { actions } = this.props
            // actions?.allProducts(temp_sku_arr)
            actions?.randomProducts(store_product)
            this.setState(
                {
                    loaderDot: false,
                    randomProducts: store_product
                }
            )
        })
        // for (let p = 0; p < store_product.length; p++) {
        //     console.log("Stored Products ", store_product[p]?.name, " ", store_product[p]?.visibility, " ", store_product[p]?.price, " ", store_product[p]?.extension_attributes?.stock_item?.is_in_stock)
        // }


    }

    isUserLoggedIn = (product, index, key) => {
        var { userData: { user, } } = this.props
        switch (key) {
            case "cart":

                if (Object.keys(user).length == 0) {
                    console.log("userLogged in");
                    this.addToCartGuest(product, index)
                } else {
                    this.addToCart(product, index)
                }
                break;

            case "wishlist":
                if (Object.keys(user).length == 0) {
                    console.log("userLogged in");
                    // this.addToWishList(product, index)
                    alert("Please Login in to your account")
                } else {
                    this.addToWishList(product)
                }
                break;
        }
    }

    addToCartGuest = (product, index) => {

        var { userData } = this.props
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })

        if (userData?.admintoken !== null || userData?.guestcartkey !== null) {

            if (product?.type_id == "virtual" || product?.type_id == "simple") {

                if (product?.options.length == 0) {

                    var obj = {
                        "cartItem": {
                            "sku": product?.sku,
                            "qty": 1,
                            "name": product?.name,
                            "price": product?.price,
                            "product_type": "simple",
                            "quote_id": userData?.guestcartid?.id
                        }
                    }
                    console.log("this product does not have options", obj)

                    api.post("guest-carts/" + userData?.guestcartkey + "/items", obj, {
                        headers: {
                            Authorization: `Bearer ${userData?.admintoken}`,
                        },
                    }).then((response) => {
                        setImmediate(() => {
                            this.setState({
                                loader: false
                            })
                        })
                        console.log(" Guest Add to cart Item API response : ", response?.data)
                        alert("Product Added to Cart!")
                    }).catch((err) => {
                        setImmediate(() => {
                            this.setState({
                                loader: false
                            })
                        })
                        console.log("Add to cart item api error:  ", err)
                    })

                } else {
                    console.log("this product has options")
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                    this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                    return alert("Please select a Product Options!")
                }

            } else {
                this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                setImmediate(() => {
                    this.setState({
                        loader: false
                    })
                })
                return alert("Please select a Product varient color!")
            }

        }

        else {
            alert("Something Went wrong!")
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            // this.props.navigation.navigate("Account", { modal: "open" })
        }

    }
    addToCart = (product, index) => {

        var { userData } = this.props
        console.log("userData", userData?.token)
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })

        if (userData?.token !== null || userData?.user?.cartID !== undefined) {

            // if (product?.type_id == "virtual" || product?.type_id == "simple") {

            // if (product?.options.length == 0) {

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
                alert("Product Added to Cart!")
                setImmediate(() => {
                    this.setState({
                        loader: false
                    })
                })
            }).catch((err) => {
                alert(err?.response.data.message)
                setImmediate(() => {
                    this.setState({
                        loader: false
                    })
                })
                this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
                console.log("Add to cart item api error:  ", err)
            })

            // } else {
            //     console.log("this product has options")
            //     this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
            //     return alert("Please select a Product Options!")
            // }

            // } else {
            //     this.props.navigation.navigate("ProductDetails", { product_details: product, product_index: index })
            //     return alert("Please select a Product varient color!")
            // }

        }

        else {
            alert("Please Login to your account first!")
            this.props.navigation.navigate("Account", { modal: "open" })
        }

    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }

    addToWishList = (productId) => {
        var { userData: { user } } = this.props
        console.log("Product ID:   ", productId);
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
        const base64Credentials = base64encode(`${basis_auth.Username}:${basis_auth.Password}`);
        api.post(custom_api_url + "func=add_wishlist", {
            "productId": productId,
            "customerId": user?.id
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${base64Credentials}`,
            },
        }).then((res) => {
            console.log("Product added to widhlist Home Screen Result:   ", res?.data);
            alert("Product Successfully Added")
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
        }).catch((err) => {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            console.log("Product added to widhlist Home Screen Error:   ", err?.response?.data?.message);
        })


    }

    fetchUserOrders = () => {
        var { userData: { user, admintoken }, actions } = this.props
        // console.log("customer?.id", user?.id)
        api.get("orders?searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bfield%5d=" + "customer_id"
            + "&searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bvalue%5d=" + user?.id
            + "searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bconditionType%5d=eq",
            {
                headers: {
                    Authorization: `Bearer ${admintoken}`,
                },
            })
            .then((res) => {
                // console.log("Orders of Coustomer are:", res?.data)
                actions.myOrders(res?.data?.items)
            }).catch((err) => {
                console.log("Err get customer orders api:  ", err?.response?.data?.message)
            })
    }

    render() {
        var { userData: { user } } = this.props

        return (
            <View style={styles.mainContainer}>

                {/** Header for Home Screen */}
                <HomeHeader
                    navProps={this.props.navigation}
                    openDrawer={() => this.openDrawer()}
                    isLoggedIn={Object.keys(user).length == 0 ? false : true}
                />

                {/* Drawer */}
                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />

                <ScrollView>
                    {/** Swiper below header */}
                    <Swiper
                        data={this.state.banners}
                        navProps={this.props.navigation}
                        admintoken={this.props.userData.admintoken} />

                    {/* * Default Categories */}
                    {this.state.loader == false && <DefaultCategories
                        data={this.state.defaultCategories1}
                        navProps={this.props.navigation}
                        firstSubItem={this.state.firstSubItem}
                        admintoken={this.props.userData.admintoken}

                    />}

                    {/** Categories like men, women etc */}
                    {/* <HomeCategories
                        // data={this.state.topCategoryData == null ? [] : this.state.topCategoryData[0]?.children_data}
                        data={this.state.topCategoryData}
                        mainCatPos={this.state.topCategoryData == null ? null : this.state.topCategoryData[0]?.position}
                        navProps={this.props.navigation}
                    /> */}
                    <ProductList
                        screenName="Home"
                        data={this.state.randomProducts}
                        loaderDot={this.state.loaderDot}
                        navProps={this.props.navigation}
                        addToCart={(product, index) => this.isUserLoggedIn(product, index,"cart")}
                        addToWishList={(id) => this.isUserLoggedIn(id,"","wishlist")}
                    />



                    <StoreFeatures screenName={"home"} />

                    <NewsLetter props={this.props}
                        style={{ marginBottom: Object.keys(user).length == 0 ? 60 : 0 }}
                    />

                    {
                        Object.keys(user).length !== 0 && <CustomerServices
                            navProps={this.props.navigation}
                        />
                    }

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