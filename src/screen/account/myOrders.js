import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { Component } from 'react'


{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import HomeHeader from '../home/components/homeHeader';
import Drawer from '../../components_reusable/drawer';
import { FlatList } from 'react-native-gesture-handler';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT
import moment from 'moment';
import { TouchableOpacity } from 'react-native';

class MyOrders extends Component {
    constructor(props) {
        super(props)
        var { userData: { orders } } = this.props
        this.state = {
            orders: orders,
            drawer: false,
        }

    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }

    render() {
        var { userData: { orders } } = this.props
        // console.log("Orders",orders);
        return (
            <View style={styles.mainContainer}>
                {/* <HeaderComp titleEN={"My Orders"} /> */}
                <HomeHeader
                    navProps={this.props.navigation}
                    openDrawer={() => this.openDrawer()}
                />

                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />
                <Text style={styles.heading}>My Orders</Text>

                <FlatList
                    data={this.state.orders}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => {
                        // console.log("items",item);
                        return (
                            <View style={styles.flatlistCont}>
                                <View style={styles.flatlistInnerView}>
                                    <Text style={styles.flatlistText}>Order#</Text>
                                    <Text style={styles.flatlistText}>{item?.increment_id}</Text>
                                </View>
                                <View style={styles.flatlistInnerView}>
                                    <Text style={styles.flatlistText}>Date:</Text>
                                    <Text style={styles.flatlistText}>{moment(item?.created_at).format("MM/DD/YY")}</Text>
                                </View>
                                <View style={styles.flatlistInnerView}>
                                    <Text style={styles.flatlistText}>Order Total:</Text>
                                    <Text style={styles.flatlistText}>AED {item?.grand_total}</Text>
                                </View>
                                <View style={styles.flatlistInnerView}>
                                    <Text style={styles.flatlistText}>Status:</Text>
                                    <Text style={styles.flatlistText}>{item?.status == "payment_review" ? "Processing" : item?.status}</Text>
                                </View>
                                <View style={styles.flatlistInnerView}>
                                    <Text style={styles.flatlistText}>Action:</Text>
                                    <TouchableOpacity
                                        style={{ paddingLeft: 10, }}
                                        onPress={() => this.props.navigation.navigate("Order_Details", {
                                            "order_detail": item,
                                        })}
                                    >
                                        <Text style={[styles.flatlistText, { color: "#08c", textDecorationLine: "underline" }]}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                />

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

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
    heading: {
        fontSize: 20,
        fontWeight: "500",
        color: "black",
        alignSelf: "flex-start",
        marginTop: 20,
        marginLeft: 20,
    },
    flatlistCont: {
        width: width - 100,
        marginVertical: 10,
        alignItems: "flex-start",
        alignSelf: "center",
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 15,
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
    flatlistInnerView: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    flatlistText: {
        fontSize: 14,
        color: "black",
        marginTop: 5
    },
})
