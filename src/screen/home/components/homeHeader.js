import { Text, StyleSheet, View, Dimensions, NativeModules, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT
export default class HomeHeader extends Component {
    render() {
        var { navProps } = this.props
        return (
            <View style={styles.mainContainer}>
                {/* <View style={styles.colorView}></View> */}
                <View style={styles.inner_mainContainer}>

                    {/** Menu Icon Button */}
                    {/* <TouchableOpacity style={styles.menuIcon}>
                        <Ionicons name="menu" size={35} color="#020621" />
                    </TouchableOpacity> */}

                    {/**logo */}
                    <Image source={require('../../../../assets/Al-Jabir-name.png')}
                        style={styles.logo}
                    />

                    {/** Search icon Button */}
                    <TouchableOpacity
                    onPress={() => navProps.navigate("Search")}
                     style={styles.searchIcon}>
                        <Ionicons name="search" size={30} color="#020621" />
                    </TouchableOpacity>

                    {/** Favourate icon Button */}
                    <TouchableOpacity style={styles.favourateIcon}>
                        <Ionicons name="heart-outline" size={30} color="#020621" />
                    </TouchableOpacity>

                    {/** Cart icon Button */}
                    <TouchableOpacity
                        onPress={() => navProps.navigate("Cart")}
                        style={styles.cartIcon}>
                        <Ionicons name="cart-outline" size={30} color="#020621" />
                    </TouchableOpacity>
                </View>
                {/* <Text>Hello</Text> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        justifyContent: "center",
        backgroundColor: "white",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 1.5,
    },
    inner_mainContainer: {
        width: width,
        height: 70,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 5
    },
    colorView: {
        width: width,
        backgroundColor: "#020621",
        height: 20
    },
    logo: {
        position: "absolute",
        left: 10,
        width: 70,
        height: 50
    },
    menuIcon: {
        position: "absolute",
        left: 5
    },

    searchIcon: {
        position: "absolute",
        right: 130
    },

    favourateIcon: {
        position: "absolute",
        right: 70,
    },
    cartIcon: {
        position: "absolute",
        right: 10
    }

})