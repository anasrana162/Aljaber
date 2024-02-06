import { Text, StyleSheet, View, Dimensions, NativeModules, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT
const imageUrl = "https://aljaberoptical.com/media/catalog/product/"

import HomeHeader from '../home/components/homeHeader';
import Drawer from '../../components_reusable/drawer';
import api, { custom_api_url, basis_auth } from '../../api/api';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import Loading from '../../components_reusable/loading';

class MyReviews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawer: false,
            loader: false,
            reviews: []
        }
    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }

    componentDidMount = () => {
        this.fetchReviews()
    }

    fetchReviews = () => {
        var { userData: { user }, } = this.props
        this.setState({
            loader: true
        })
        api.get(custom_api_url + "func=get_reviews&cid=" + user?.id).then((res) => {
            console.log("Fetch Review API", res?.data);
            this.setState({
                reviews: res?.data,
                loader: false
            })
        }).catch((err) => {
            console.log("fetch review Api error:", err);
            this.setState({
                loader: false
            })
        })
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {/** Header for My Reviews Screen */}
                <HomeHeader
                    navProps={this.props.navigation}
                    openDrawer={() => this.openDrawer()}
                />

                {/* Loader */}
                {this.state.loader &&
                    <Loading />
                }

                {/* Drawer */}
                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />

                <View style={styles.innerContainer}>

                    <Text style={[styles.title,{alignSelf:"center"}]}>My Reviews</Text>

                    {this.state.loader == false && <FlatList
                        data={this.state.reviews}
                        contentContainerStyle={{ marginVertical: 20 }}
                        ListEmptyComponent={() => {
                            return (
                                <>
                                    <Text style={styles.title}>No Products Reviewed</Text>
                                </>
                            )
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.listCont}>
                                    <Image
                                        source={{ uri: imageUrl + item?.product_image }}
                                        style={styles.imageItem}
                                        resizeMode='contain'
                                    />
                                    <View style={styles.innerListCont}>
                                        <Text style={styles.itemText} numberOfLines={1}>Product Name: {item?.product_name}</Text>
                                        <Text style={styles.itemText} numberOfLines={1}>Title: {item?.title}</Text>
                                        <Text style={styles.itemText} numberOfLines={1}>Nick name:{item?.nickname}</Text>
                                        <Text style={styles.itemText} numberOfLines={2}>Details: {item?.detail}</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />}



                </View>


            </View>
        )
    }
}


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

export default connect(mapStateToProps, mapDispatchToProps)(MyReviews);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
    innerContainer: {
        width: width - 20,
        // height: "100%",
        justifyContent: "center",

    },

    title: {
        fontWeight: "400",
        color: "black",
        fontSize: 18,
        marginTop: 30,
        alignItems: "flex-start",
    },
    listCont: {
        width: width - 40,
        padding: 10,
        justifyContent: "space-around",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    innerListCont: {
        width: "60%",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "column",
        rowGap: 5

    },
    imageItem: {
        width: 100,
        height: 100
    },
    itemText: {
        fontWeight: "500",
        color: 'black',
        fontSize: 14,
    }
})