import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
const Dropdown = ({ dataDropdown, selectItem, purpose }) => {
    // console.log(dataDropdown.slice(1))

    var cutArray = purpose == "province" ? dataDropdown.slice(1) : dataDropdown
    // console.log("cutArray", dataDropdown)
    return (
        <View style={styles.dropdownContainer}>
            <ScrollView>
                {cutArray.map((val, index) => {
                    // console.log("dataDropdown", val?.country)
                    return (
                        <TouchableOpacity
                            key={String(index)}
                            style={styles.dropdown_item}
                            onPress={() => selectItem(val)}
                        >
                            <Text style={styles.dropdown_item_text}>{val?.country == undefined ? val?.title : val?.country}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default Dropdown

const styles = StyleSheet.create({
    dropdownContainer: {
        width: '100%',
        minHeight: 100,
        maxHeight: 250,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: "white",
        marginBottom: 10,
        padding: 5,
    },
    dropdown_item: {
        width: "100%",
        height: 30,
        borderBottomWidth: 0.5,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    dropdown_item_text: {
        fontSize: 14,
        fontWeight: "600",
        color: "#313131"
    },
})