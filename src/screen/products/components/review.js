import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
const width = Dimensions.get("screen").width

const Review = ({ ProductName }) => {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>YOUR REVIEWING</Text>
            <Text style={[styles.title, { fontSize: 15, marginTop: 10,marginBottom:0 }]}>{ProductName?.toUpperCase()}</Text>

            <Text style={styles.textInp_title}>NICKNAME*</Text>
            <TextInput
                style={styles.txtInp}
            />

            <Text style={styles.textInp_title}>SUMMARY*</Text>
            <TextInput
                style={styles.txtInp}
            />

            <Text style={styles.textInp_title}>REVIEW*</Text>
            <TextInput
                style={styles.txtInp}
            />

            {/* Submit button */}

            <TouchableOpacity style={styles.submit_btn}>
                <Text style={styles.submit_btn_txt}>SUBMIT</Text>
            </TouchableOpacity>


        </View>
    )
}

export default Review

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#233468",
        marginTop: 40
    },
    textInp_title: {
        fontSize: 12,
        fontWeight: "500",
        color: "#233468",
        marginTop: 20,
        marginBottom: 10,
    },
    txtInp: {
        width: "95%",
        height: 40,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#020621",
    },

    submit_btn: {
        width: 100,
        height: 40,
        backgroundColor: "#233468",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        borderRadius: 5
    },

    submit_btn_txt: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
    }
})