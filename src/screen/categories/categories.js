import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from '../home/components/homeHeader';
import TabNavigator from '../../components_reusable/TabNavigator';
import HomeCategories from '../home/components/homeCategories';
import api from '../../api/api';

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
        };
    }

    componentDidMount = () => {
        const { action, userData: { defaultcategory } } = this.props
        console.log("defaultcategory in categories", defaultcategory)
        setImmediate(() => {
            this.setState({ defaultCategories: defaultcategory })
        })
    }
    selectedItems = (item, index) => {
        console.log("Selected Item: ", item)
        setImmediate(() => {
            this.setState({ selectedCat: item })
        })
    }

    render() {
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
                                    this.state.defaultCategories?.children_data.map((item, index) => {
                                        return (

                                            <TouchableOpacity
                                                onPress={() => this.selectedItems(item, index)}
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

                                                    <Image source={require('../../../assets/placeholder.jpeg')} style={{ width: "100%", height: "100%" }} />
                                                </View>
                                                <Text numberOfLines={2} style={styles.text_item}>{item?.name}</Text>
                                            </TouchableOpacity>
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

                                            <TouchableOpacity
                                                //  onPress={() => selectedItems(item, index)}
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

                                                    <Image source={require('../../../assets/placeholder.jpeg')} style={{ width: "100%", height: "100%" }} />
                                                </View>
                                                <Text numberOfLines={1} style={styles.text_item}>{item?.name}</Text>
                                            </TouchableOpacity>
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