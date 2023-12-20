import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
const width = Dimensions.get("screen").width;

const OptionDropdown = ({
    title,
    data,
    style,
    checked,
    style1,
    setWholeItemSelected, getItemDefault }) => {

    const [selectedItem, setSelectedItem] = useState(
        {
            "title": "--Please Select--",
            "sort_order": 0,
            "price": 0,
            "price_type": "",
            "option_type_id": null
        } 
    )
    const [dropdown, setDropdown] = useState(false)

    const selectItem = (item, key,) => {
        console.log("item", item)
        setWholeItemSelected(item, key)
        setSelectedItem(item)
    }

    // console.log("getItemDefault",getItemDefault)

    return (
        <View style={[styles?.option_cont, style]}>
            {checked == false && <Text style={{ color: "#020621" }}>{title} *</Text>}
            <TouchableOpacity
                onPress={() => setDropdown(!dropdown)}
                style={[styles?.dropdown_cont, style1]}>
                <Text style={styles.selectedItem_text}>{selectedItem?.title}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" style={{ marginRight: 10 }} />
            </TouchableOpacity>
            {dropdown &&
                <View style={[styles?.dropDown_style, {
                    position: checked == false ? null : "absolute",
                    zIndex: 200,
                    height: data?.length >= 5 ? 150 : null,
                }]}>
                    <ScrollView style={{ width: "100%" }} nestedScrollEnabled>
                        {
                            data.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={String(index)}
                                        onPress={() => selectItem(item)}
                                        style={styles?.dropDown_item_style}>
                                        {selectedItem?.title !== item?.title && <Fontisto name="check" size={16} color="white" style={{ marginLeft: 10 }} />}
                                        {selectedItem?.title == item?.title && <Fontisto name="check" size={16} color="black" style={{ marginLeft: 10 }} />}
                                        <Text style={styles.dropDown_item_text}>{item?.title}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            }
        </View>
    )
}

export default OptionDropdown

const styles = StyleSheet.create({
    option_cont: {
        width: width - 20,
        alignItems: "flex-start",
        marginTop: 20

    },
    dropdown_cont: {
        width: "100%",
        height: 45,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#020621",
        marginTop: 10
    },
    selectedItem_text: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: "500",
        color: "#020621",
    },

    dropDown_style: {
        width: "100%",
        // height: 200,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#020621",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: "hidden",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    dropDown_item_style: {
        width: "95%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 5,

    },
    dropDown_item_text: {
        fontSize: 14,
        fontWeight: "500",
        color: "#020621",
        marginHorizontal: 10
    }
})