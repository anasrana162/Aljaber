import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from './components/homeHeader';
import Swiper from './components/Swiper';
import TabNavigator from '../../components_reusable/TabNavigator';
import HomeCategories from './components/homeCategories';
import api from '../../api/api';
import RNRestart from 'react-native-restart';
import NetInfo from "@react-native-community/netinfo";
{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import Loading from '../../components_reusable/loading';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

var sliderImages = [
    {
        id: 1,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/3/0/30-50_-02.jpg"
    }, {
        id: 2,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/w/e/web_banner_back_b.jpg"
    },
    {
        id: 3,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/w/e/web_banner_t.jpg"
    },
    {
        id: 4,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/e/a/ea_kids.jpg"
    },
    {
        id: 5,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/e/a/ea_web_banner_1.jpg"
    },
    {
        id: 6,
        source: "https://aljaberoptical.com/media/magestore/bannerslider/images/o/l/oliver_peoples_web_banner.jpg"
    },
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
        };
    }
    adminApi = async () => {

        // console.log(this.props)
        const { actions } = this.props
        var { adminTokenCounter } = this.state

        await api.post('integration/admin/token', {
            "username": "manager",
            "password": "Pakistan2023"
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
                            loader: false,
                            defaultCategories: res?.data
                        })
                        actions.defaultCategories(res?.data)
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



    componentDidMount = () => {
        this.getDefaultCategories()
        this.unsubscribe()
    }

    render() {

        return (
            <View style={styles.mainContainer}>

                {/** Header for Home Screen */}
                <HomeHeader />

                <ScrollView>
                    {/** Swiper below header */}
                    <Swiper data={sliderImages} />

                    {/** Default Categories */}
                    {/* <DefaultCategories data={[this.state.defaultCategories]}/> */}

                    {/** Categories like men, women etc */}
                    <HomeCategories data={category} navProps={this.props.navigation} />



                </ScrollView>

                {/** Tab Navigator */}
                <TabNavigator screenName={"home"} navProps={this.props.navigation} />

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