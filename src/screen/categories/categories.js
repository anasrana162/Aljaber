import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from '../home/components/homeHeader';
import TabNavigator from '../../components_reusable/TabNavigator';
import HomeCategories from '../home/components/homeCategories';
import api from '../../api/api';
import { ImageArray } from './categoryData';

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import DefaultCategories from './components/defaultCategories';
const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

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

    defaultCategories = () => {
        const { action, userData: { defaultcategory, admintoken } } = this.props
        var { tempArray } = this.state
        // console.log("defaultcategory in categories", defaultcategory)
        // setImmediate(() => {
        //     this.setState({ defaultCategories: defaultcategory })
        // })

        if (Object.keys(defaultcategory).length !== 0) {
            //console.log("working")
            var { children_data } = defaultcategory
            var obj = {}
            var tempArray1 = [];



            for (let i = 0; i < children_data.length; i++) {
                console.log(children_data[i]?.children_data.length)
                for (let j = 0; j < ImageArray.length; j++) {

                    if (ImageArray[j]?.id == children_data[i]?.id) {
                        var obj = {
                            "id": children_data[i]?.id,
                            "parent_id": children_data[i]?.parent_id,
                            "name": children_data[i]?.name,
                            "is_active": children_data[i]?.is_active,
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
        // console.log("tempArray1------------------", tempArray1)
        this.setState({
            defaultCategories: tempArray1
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
                console.log("Selected Item: ", this.state.selectedCat)
                this.props.navigation.navigate("Products", { item, defaultCategories: this.state.defaultCategories, mainCat_selected: this.state.selectedCat?.position })
        }
    }


    render() {
        // console.log("tempArray Outside", this.state.tempArray)
        return (
            <View style={styles.mainContainer}>
                {/* <HomeHeader /> */}
                <View style={styles.inner_main}>
                    <View style={styles.default_category_cont}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.flatList_outerCont}>

                                {
                                    this.state.defaultCategories?.map((item, index) => {
                                        return (
                                            <>

                                                {item?.is_active == true &&
                                                    <TouchableOpacity
                                                        key={String(item?.id)}
                                                        onPress={() => this.selectedItems(item, index, 'main')}
                                                        style={styles.flatList_Cont}>

                                                        <View style={{
                                                            width: 70,
                                                            height: 70,
                                                            borderWidth: 1,
                                                            borderRadius: 120,
                                                            borderColor: "#020621",
                                                            marginBottom: 10,
                                                            overflow: "hidden",
                                                            zIndex: 150,
                                                        }}>
                                                            {/* https://wpstaging51.a2zcreatorz.com/ */}
                                                            {item?.placeHolder == "false" && <Image source={{ uri: "https://aljaberoptical.com/" + item?.img }} style={{ width: "100%", height: "100%" }} />}
                                                            {item?.placeHolder == "true" && <Image source={{ uri: item?.img }} style={{ width: "100%", height: "100%" }} />}
                                                        </View>
                                                        <Text numberOfLines={2} style={styles.text_item}>{item?.name}</Text>
                                                    </TouchableOpacity>}
                                            </>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.sub_category}>
                        <ScrollView
                            //pagingEnabled 
                            // horizontal
                            showsVerticalScrollIndicator={false}
                        // showsHorizontalScrollIndicator={false}
                        //contentOffset={{ x: 6 }}
                        >
                            <View style={styles.flatList_outerCont_sub}>
                                {
                                    this.state.selectedCat?.children_data.map((item, index) => {
                                        console.log(item)
                                        return (
                                            <>
                                                {item?.is_active == true &&
                                                    <TouchableOpacity
                                                        onPress={() => this.selectedItems(item, index, 'sub')}
                                                        style={styles.flatList_Cont_sub}>

                                                        <View style={{
                                                            width: 100,
                                                            height: 90,
                                                            borderWidth: 1,
                                                            borderColor: "#020621",
                                                            borderRadius: 10,
                                                            marginBottom: 10,
                                                            overflow: "hidden",
                                                            zIndex: 150,
                                                        }}>

                                                            {item?.placeHolder == "false" && <Image source={{ uri: "https://aljaberoptical.com/" + item?.img }} style={{ width: "100%", height: "100%" }} />}
                                                            {item?.placeHolder == "true" && <Image source={{ uri: item?.img }} style={{ width: "100%", height: "100%" }} />}
                                                        </View>
                                                        <Text numberOfLines={1} style={styles.text_item}>{item?.name}</Text>
                                                    </TouchableOpacity>
                                                }
                                            </>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
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
    inner_main: {
        width: width,
        alignSelf: "center",
        height: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
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
        width: width - 110,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 200,
        marginTop: 20
        //backgroundColor:"red",
    },
    flatList_Cont: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        marginHorizontal: 10

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
        fontSize: 11,
        fontWeight: "600",
        color: "#020621",
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