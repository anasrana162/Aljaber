import { Text, StyleSheet, Image, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
const width = Dimensions.get("screen").width
const ImageView = ({ source, textEN, textAR }) => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.category_cont}>
                <View style={styles.category_inner_cont}>

                    <Text style={styles.category_text}>{textEN}</Text>
                </View>
            </View>
            <Image source={source} style={{ width: "100%", height: "100%" }} resizeMode='stretch' />

        </View>
    )
}

export default ImageView

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        height: 120,
        backgroundColor: "#bbb"
    },
    category_cont: {
        //  width: 100,
        padding: 10,
        // height: 40,
        backgroundColor: "#f0f0f0",
        opacity: 0.8,
        position: "absolute",
        top: 0,
        left: 30,
        zIndex: 20,
        overflow:"hidden",
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
    },
    category_inner_cont: {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    category_text: {
        fontSize: 14,
        fontWeight: "700",
        color: "#020621"
    }
})