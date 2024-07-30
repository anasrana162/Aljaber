import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import TabNavigator from '../../components_reusable/TabNavigator';
{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import api, { custom_api_url } from '../../api/api';
import Loading from '../../components_reusable/loading';
import LinearGradient from 'react-native-linear-gradient';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

import AntDesign from "react-native-vector-icons/AntDesign"

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultCategories: null,
            loader: false,
            selectedCat: null,
            selectedSubCat: null,
            tempArray: [],
        };
    }

    componentDidMount = () => {
        this.defaultCategories()
    }

    defaultCategories = async () => {
        const { userData: { createddefaultcategory } } = this.props
        // this.props?.userData?.createddefaultcategory[1]
        var firstItem = this.props?.userData?.createddefaultcategory[0]
        // console.log("userData", createddefaultcategory)
        var tempArr = []
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
        for (let i = 0; i < firstItem?.children_data?.length; i++) {
            await api.get(custom_api_url + "func=get_category_image&catid=" + firstItem?.children_data[i]?.id)
                .then((res) => {

                    firstItem.children_data[i].image = "https://aljaberoptical.com" + res?.data?.image
                    firstItem.children_data[i].visibe_menu = res?.data?.visibe_menu
                    if (firstItem.children_data[i].visibe_menu == "1") {

                        tempArr.push(firstItem?.children_data[i])
                    }
                    if (firstItem?.children_data?.length - 1 == i) {
                        firstItem.children_data = tempArr
                        setImmediate(() => {
                            this.setState({
                                selectedCat: firstItem,
                                loader: false,
                            })
                        })
                    }

                }).catch((err) => {
                    console.log("Err Fetching image in DefaultCategoryItems: ", err)
                })
        }
        setImmediate(() => {

            this.setState({
                defaultCategories: createddefaultcategory
            })
        })
    }

    selectedItems = async (item, index, key) => {
        const { userData: { admintoken } } = this.props
        switch (key) {
            case 'main':
                var tempArr = []
                setImmediate(() => {
                    this.setState({
                        selectedCat: null,
                        loader: true
                    })
                })
                // console.log("Selected Item: ", item)
                for (let i = 0; i < item?.children_data?.length; i++) {

                    await api.get(custom_api_url + "func=get_category_image&catid=" + item?.children_data[i]?.id)
                        .then((res) => {

                            item.children_data[i].image = "https://aljaberoptical.com" + res?.data?.image
                            item.children_data[i].visibe_menu = res?.data?.visibe_menu
                            if (item.children_data[i].visibe_menu == "1") {

                                tempArr.push(item?.children_data[i])
                            }
                            if (item?.children_data?.length - 1 == i) {
                                item.children_data = tempArr
                                setImmediate(() => {
                                    this.setState({
                                        selectedCat: item,
                                        loader: false,
                                    })
                                })
                            }

                        }).catch((err) => {
                            console.log("Err Fetching image in DefaultCategoryItems: ", err)
                        })
                }

                break;

            case 'sub':
                // console.log("Selected Item: ", this.state.selectedCat)

                var image = "/pub/media/wysiwyg/smartwave/porto/theme_assets/images/banner2.jpg"
                await api.get("categories/" + item?.id, {
                    headers: {
                        Authorization: `Bearer ${admintoken}`,
                    }
                }).then((res) => {
                    // console.log("Response for Top Category API:", res?.data)
                    for (let r = 0; r < res?.data?.custom_attributes.length; r++) {
                        if (res?.data?.custom_attributes[r].attribute_code == "image") {
                            image = res?.data?.custom_attributes[r]?.value
                            break;
                        }

                    }
                }).catch((err) => {
                    console.log("Err Fetching image in DefaultCategoryItems: ", err)
                })

                this.props.navigation.navigate("Products", {
                    item,
                    sub_category_id: item?.id,
                    defaultCategories: this.state.defaultCategories,
                    mainCat_selected: this.state.selectedCat?.position,
                    imageLinkMain: image,
                    otherCats: this.state.selectedCat,
                })
        }
    }


    render() {
        console.log("tempArray Outside", width)
        return (
            <View style={styles.mainContainer}>
                {/* <HomeHeader /> */}

                <Text style={styles.title}>Categories</Text>



                <View style={styles.inner_main}>
                    <FlatList
                        horizontal
                        data={this.state.defaultCategories}
                        showsHorizontalScrollIndicator={false}
                        renderItem={(item, index) => {
                            // console.log("Item",item?.item?.name)
                            return (
                                <>
                                    {/* item?.index != 0 this condition is for hiding shop by brand */}
                                    {item?.item?.visibe_menu == "1" &&
                                        <TouchableOpacity

                                            onPress={() => this.selectedItems(item?.item, index, 'main')}
                                            style={styles.flatList_Cont}>

                                            {/* <View style={{
                                            width: 165,
                                            height: 180,
                                            borderWidth: 1,
                                            borderRadius: 20,
                                            borderColor: "#020621",
                                            marginBottom: 10,
                                            overflow: "hidden",
                                            zIndex: 150,
                                        }}> */}
                                            {/* https://wpstaging51.a2zcreatorz.com/ */}
                                            {/* {item?.placeHolder == "false" && <Image source={{ uri: "https://aljaberoptical.com/" + item?.img }} style={{ width: "100%", height: "100%" }} />}
                                            {item?.placeHolder == "true" && <Image source={{ uri: item?.img }} style={{ width: "100%", height: "100%" }} />} */}
                                            {/* </View> */}
                                            <Text numberOfLines={2} style={styles.text_item}>{item?.item?.name}</Text>
                                        </TouchableOpacity>}
                                </>
                            )
                        }}
                    />


                    {/* {
                            this.state.defaultCategories?.map((item, index) => {
                                return (
                                   
                                )
                            })
                        } */}
                </View>
                <ScrollView style={{ width: width }}>
                    <View style={{ width: width - 30, alignSelf: "center" }}>

                        <View style={styles.flatList_outerCont_sub_new}>
                            {
                                this.state.selectedCat?.children_data.map((item, index) => {

                                    return (
                                        <View
                                            key={String(index)}
                                        >
                                            {item?.visibe_menu == "1" &&
                                                <TouchableOpacity
                                                    onPress={() => this.selectedItems(item, index, 'sub')}

                                                    style={{
                                                        width: width / 2.5,
                                                        height: 180,
                                                        borderColor: "#020621",
                                                        marginBottom: 20,
                                                        overflow: "hidden",
                                                        marginHorizontal: 10,
                                                        zIndex: 150,
                                                        borderRadius: 10,
                                                        alignItems: "center",
                                                        // alignSelf:"flex-end",
                                                        justifyContent: "center",
                                                    }}>
                                                    <LinearGradient
                                                        colors={["#54595fee", "#54595fee", "#54595fee",
                                                            "#54595fee", "#54595fd1", "#54595fc9", "#54595f8b", "#54595f68",
                                                            "#54595f5d", "#54595f3f", "#54595f2f", "#54595f0f", "#54595f00",
                                                            "#54595f00", "#54595f00", "#54595f00", "#54595f00", "#54595f00",
                                                            "#54595f00", "#54595f00", "#54595f00", "#54595f00", "#54595f00", "#54595f00", "#54595f00"].reverse()}
                                                        // start={{ x: 0, y: 0.5 }} // Start from left
                                                        // end={{ x: 1, y: 0.5 }} // End at right
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            position: "absolute",
                                                            zIndex: 250,
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}>

                                                    </LinearGradient>
                                                    <Image
                                                        source={require('../../../assets/giflogo.gif')}
                                                        style={[styles.image_Cont_new, { position: "absolute" }]}
                                                    />
                                                    {/* <View style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    backgroundColor: "black",
                                                    opacity: 0.2,
                                                    position: "absolute",
                                                    zIndex: 250,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>

                                                </View> */}
                                                    <View style={{
                                                        width: 140,
                                                        flexDirection: "row", position: "absolute",
                                                        alignSelf: "center",
                                                        zIndex: 250,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        bottom: 15
                                                    }}>

                                                        <Text style={[styles.text_item, {
                                                            color: "#ffffff",
                                                            marginTop: 5,
                                                            fontSize: 16,
                                                            fontWeight: "bold"
                                                            // marginRight: 5
                                                        }]}>{item?.name}</Text>
                                                        {/* <AntDesign name="right" size={20} color="white" /> */}
                                                    </View>


                                                    <Image resizeMode='cover' source={{ uri: item?.image }} style={styles.image_Cont_new} />

                                                </TouchableOpacity>
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    {/* <View style={styles.flatList_outerCont_sub}>
                        {
                            this.state.selectedCat?.children_data.map((item, index) => {
                                // console.log(item)
                                // switch (item?.id) {
                                //     case 81:
                                //         item.is_active = false
                                //         break;
                                //     case 74:
                                //         item.is_active = false
                                //         break;
                                //     case 45:
                                //         item.is_active = false
                                //         break;
                                //     case 34:
                                //         item.is_active = false
                                //         break;
                                //     // case 72:
                                //     //     item.is_active = false
                                //     //     break;
                                //     // case 89:
                                //     //     item.is_active = false
                                //     //     break;
                                //     // case 128:
                                //     //     item.is_active = false
                                //     //     break;
                                // }
                                return (
                                    <View
                                        key={String(index)}
                                    >
                                        {item?.visibe_menu == "1" &&
                                            <TouchableOpacity
                                                onPress={() => this.selectedItems(item, index, 'sub')}

                                                style={{
                                                    width: 160,
                                                    height: 170,
                                                    borderColor: "#020621",
                                                    marginBottom: 10,
                                                    overflow: "hidden",
                                                    marginHorizontal: 10,
                                                    zIndex: 150,
                                                }}>


                                                <Image resizeMode='cover' source={{ uri: item?.image }} style={styles.image_Cont} />
                                                <Text numberOfLines={1} style={[styles.text_item, { color: "black", marginTop: 5 }]}>{item?.name}</Text>

                                            </TouchableOpacity>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View> */}
                </ScrollView>
                {this.state.loader && <Loading />}
                {/** Tab Navigator */}
                <TabNavigator screenName={"category"} navProps={this.props.navigation} />
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
    title: {
        fontSize: 32,
        fontWeight: "600",
        color: "#020621",
        marginTop: 20,
        marginLeft: 20,
        alignSelf: "flex-start"
    },
    inner_main: {
        width: width - 20,
        alignSelf: "center",
        marginTop: 30,
        // marginRight: 200,
        // flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    default_category_cont: {
        width: 110,
        height: "100%",
        backgroundColor: "#bbb",
    },
    sub_category: {
        width: width - 110,
        height: "100%",
        backgroundColor: "#fff",
    },
    flatList_outerCont: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 170,
        marginTop: 20
    },
    flatList_outerCont_sub: {
        width: width,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 200,
        marginTop: 20
        //backgroundColor:"red",
    },
    flatList_outerCont_sub_new: {
        width: "100%",
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start',
        alignItems: "center",
        marginBottom: 200,
        // marginLeft:20,
        marginTop: 20
        //backgroundColor:"red",
    },
    image_Cont: {
        width: 160,
        height: 150,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#020621",
    },
    image_Cont_new: {
        width: "100%",
        height: "100%",
    },
    flatList_Cont: {
        padding: 5,
        backgroundColor: "#020621",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        // marginRight: 10,
        marginHorizontal: 5,
        // width: "100%",
        // backgroundColor:"red"

    },
    flatList_Cont_sub: {
        justifyContent: "center",
        // backgroundColor:"red",
        width: width / 4,
        alignItems: "center",
        //marginBottom: 20,
        marginHorizontal: 15,
        marginVertical: 10

    },
    text_item: {
        fontSize: 14,
        fontWeight: "700",
        color: "white",
        textAlign: "center"
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

export default connect(mapStateToProps, mapDispatchToProps)(Categories);