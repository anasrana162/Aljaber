import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import TabNavigator from '../../components_reusable/TabNavigator';
{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultCategories: null,
            loader: false,
            selectedCat: this.props?.userData?.createddefaultcategory[1],
            selectedSubCat: null,
            tempArray: [],
        };
    }

    componentDidMount = () => {
        this.defaultCategories()
    }

    defaultCategories = () => {
        const { userData: { createddefaultcategory } } = this.props

        console.log("userData", createddefaultcategory)
        setImmediate(() => {

            this.setState({
                defaultCategories: createddefaultcategory
            })
        })
    }

    selectedItems = (item, index, key) => {
        switch (key) {
            case 'main':
                // console.log("Selected Item: ", item)
                setImmediate(() => {
                    this.setState({ selectedCat: item })
                })
                break;

            case 'sub':
                // console.log("Selected Item: ", this.state.selectedCat)
                this.props.navigation.navigate("Products", { item, sub_category_id: item?.id, defaultCategories: this.state.defaultCategories, mainCat_selected: this.state.selectedCat?.position,imageLinkMain: "https://aljaberoptical.com/pub/media/catalog/category_mobile/" + item?.id + ".jpg" })
        }
    }


    render() {
        // console.log("tempArray Outside", this.state.tempArray)
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
                                    {item?.item?.is_active == true &&
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

                    <View style={styles.flatList_outerCont_sub}>
                        {
                            this.state.selectedCat?.children_data.map((item, index) => {
                                console.log(item)
                                switch (item?.id) {
                                    case 81:
                                        item.is_active = false
                                        break;
                                    case 74:
                                        item.is_active = false
                                        break;
                                    case 45:
                                        item.is_active = false
                                        break;
                                    case 34:
                                        item.is_active = false
                                        break;
                                }
                                return (
                                    <View
                                        key={String(index)}
                                    >
                                        {item?.is_active == true &&
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

                                                {item?.parent_id == 102 && <View style={[styles.image_Cont, {
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }]}>
                                                    <Text numberOfLines={1} style={[styles.text_item, { color: "black", marginTop: 5, }]}>{item?.name}</Text>
                                                </View>}
                                                {item?.parent_id !== 102 && <Image resizeMode='stretch' source={{ uri: "https://aljaberoptical.com/pub/media/catalog/category_mobile/" + item?.id + ".jpg" }} style={styles.image_Cont} />}
                                                {item?.parent_id !== 102 && <Text numberOfLines={1} style={[styles.text_item, { color: "black", marginTop: 5 }]}>{item?.name}</Text>}

                                            </TouchableOpacity>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
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
        width: width,
        alignSelf: "center",
        marginTop: 20,
        // marginRight: 200,
        // flexDirection: "row",
        alignItems: "center"
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
    image_Cont: {
        width: 160,
        height: 150,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#020621",
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