import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView } from 'react-native'
import React, { Component } from 'react'


const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

class My_orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // authModal: false,
            def_ship_add: "",
            def_bill_add: "",
            def_ship_add_found: false,
            def_bill_add_found: false,
            countries: [],
            orders: null,
        };
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Text>my_orders</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(My_orders);

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        alignSelf: "flex-start",
        width: width - 20,
        marginLeft: 15
    },
})