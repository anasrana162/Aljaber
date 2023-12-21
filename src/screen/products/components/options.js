import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Fontisto from 'react-native-vector-icons/Fontisto'
import OptionDropdown from './optionDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import { custom_api_url } from '../../../api/api';
const width = Dimensions.get("screen").width;

const Options = ({
    optionKey,
    checkMarked,
    onChangeText,
    option_package_size,
    option_power,
    option_cyl,
    option_axes,
    option_addition,
    product_varients,
    selectedItemLeftPower,
    selectedItemLeftPackage,
    selectedItemRightPower,
    selectedItemRightPackage,
    selectedItemLeftADDITION,
    selectedItemRightADDITION,
    selectedItemRightCYL,
    selectedItemLeftCYL,
    selectedItemRightAXES,
    selectedItemLeftAXES,
    finalCartItemPackage,
    finalCartItemPower,
    finalCartItemCYL,
    finalCartItemAXES,
    finalCartItemADDITION,
    openDropDown,
    rigthEyeQuantity,
    leftEyeQuantity,
    selectedVarient,
    setWholeItemSelected,
    selectedCPO,
    selectedItemRight,
    selectedItemLeft,
    configurable_product_options,
    product_options,
}) => {

    const [_rigthEyeQuantity, setRigthEyeQuantity] = useState(rigthEyeQuantity)
    const [_leftEyeQuantity, setLeftEyeQuantity] = useState(leftEyeQuantity)

    const [checked, setChecked] = useState(false)

    return (
        <View style={styles.mainContainer}>
            <View style={styles.checkBox_cont} >
                {checked ?
                    <TouchableOpacity
                        onPress={() => {
                            setChecked(!checked)
                            checkMarked(!checked)
                        }}
                    >
                        <Fontisto name="checkbox-active" size={20} color="#020621" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => {
                            setChecked(!checked)
                            checkMarked(!checked)
                        }}
                    >
                        <Fontisto name="checkbox-passive" size={20} color="#020621" />
                    </TouchableOpacity>
                }
                <Text style={styles?.checkBox_text}>I NEED 2 DIFFERENT POWERS FOR MY LENSES</Text>


            </View>

            {/* Configurable Product Options */}
            {(configurable_product_options == null || configurable_product_options == undefined || configurable_product_options.length == 0) ?
                <>
                </>
                :
                <>
                    {checked == false && <View style={styles.colorFlatlist}>

                        {/* List */}
                        <ScrollView
                            horizontal
                            style={{ width: "100%" }}
                        >
                            {
                                configurable_product_options?.map((data, index) => {
                                    // console.log("data", data?.color?.toLowerCase())
                                    return (

                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            {/* Title */}
                                            <Text style={styles.title}> {data?.label}: </Text>

                                            {
                                                data?.values.map((val, index) => {
                                                    // console.log("data_name", val)
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => selectedVarient(val, index, data?.attribute_id, data?.label)}
                                                            key={String(index)}
                                                            style={[styles.color_cont, {
                                                                width: data?.label == "Color" ? 30 : null,
                                                                height: data?.label == "Color" ? 30 : null,
                                                                backgroundColor: data?.label == "Color" ? val?.color_code.toLowerCase() : "#f0f0f0"
                                                            }]}
                                                        >
                                                            {data?.label !== "Color" && <Text > {val?.value_name} </Text>}
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }


                                        </View>
                                    )

                                })
                            }

                        </ScrollView>
                    </View>}
                </>
            }

            {/* Custom Product Options */}

            {checked == false ?
                <>
                    {
                        product_options.map((data, index) => {
                            return (
                                <OptionDropdown
                                    // key={optionKey}
                                    checked={checked}
                                    title={data?.title}
                                    data={data?.values}
                                    setWholeItemSelected={(item) => setWholeItemSelected(item, data?.option_id,)}
                                // getItemDefault={finalCartItemPackage}
                                />
                            )
                        })
                    }
                </>
                :
                <>
                    <View style={styles.checkBox_option}>

                        <Text style={styles.prescription_text}>ENTER YOUR PRESCRIPTION</Text>
                        {configurable_product_options !== null && <View style={[styles?.option_cont, { width: "95%", marginTop: 0, marginBottom: 10, marginLeft: 10, borderRadius: 5, overflow: "hidden" }]}>
                            {
                                configurable_product_options.map((data, index) => {
                                    // console.log(configurable_product_options.length)
                                    var value_selected = selectedCPO.filter((val) => val?.title == data?.label)[0]

                                    return (
                                        <>
                                            {/* DropDown Title */}
                                            <Text style={{ color: "#020621", marginBottom: 5 }}>{data?.label} *</Text>
                                            {/* Dropdowns */}
                                            <TouchableOpacity
                                                onPress={() => openDropDown(data, data?.label, "CPO")}
                                                style={[styles?.dropdown_cont, { marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>
                                                <Text style={[styles.selectedItem_text, { fontSize: 14 }]}>{value_selected == undefined ? selectedCPO[0]?.value_name : value_selected?.val?.value_name}</Text>
                                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" style={{ marginRight: 10 }} />
                                            </TouchableOpacity>
                                            {/* ---------------------------- */}


                                        </>
                                    )
                                })
                            }

                        </View>}


                        <View style={styles.blue_cont}>
                            {/* Eye Heading Container */}
                            <View style={styles.eye_cont}>

                                <View style={styles.eye_inner_conts}>
                                    <Text style={styles.eye_text}>Left Eye</Text>
                                </View>
                                <View style={styles.eye_inner_conts}>
                                    <Text style={[styles.eye_text, { marginBottom: 5 }]}>Right Eye</Text>
                                </View>
                            </View>
                            {/* white container */}
                            <View style={styles.pre_type_cont}>

                                {
                                    product_options.map((data, index) => {
                                        // console.log("data", data)
                                        var value_selected_left = selectedItemLeft.filter((val) => val?.title == data?.title)[0]
                                        var value_selected_right = selectedItemRight.filter((val) => val?.title == data?.title)[0]
                                        return (
                                            <View style={[styles.pre_inner_type_cont, { width: width * ((50.5 / 100)) / product_options.length }]}>
                                                <View style={styles.pres_conts}>
                                                    <Text style={styles.grid_text}>{data?.title}</Text>
                                                </View>
                                                <View style={styles.pres_conts}>
                                                    <View style={[styles?.option_cont, { width: "90%", marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>

                                                        <TouchableOpacity
                                                            onPress={() => openDropDown(data, data?.title, "left", data?.option_id)}
                                                            style={[styles?.dropdown_cont, { marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>
                                                            <Text style={[styles.selectedItem_text, { marginLeft: 3 }]}>{value_selected_left == undefined ? "Select" : value_selected_left?.val?.title}</Text>
                                                            <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" />
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                                <View style={styles.pres_conts}>
                                                    <View style={[styles?.option_cont, { width: "90%", marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>

                                                        <TouchableOpacity
                                                            onPress={() => openDropDown(data, data?.title, "right", data?.option_id)}
                                                            style={[styles?.dropdown_cont, { marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>
                                                            <Text style={[styles.selectedItem_text, { marginLeft: 3 }]}>{value_selected_right == undefined ? "Select" : value_selected_right?.val?.title}</Text>
                                                            <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" />
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })

                                }

                                {/* Quantity Container */}
                                <View style={[styles.pre_inner_type_cont, { width: "25%" }]}>

                                    <View style={styles.pres_conts}>
                                        <Text style={styles.grid_text}>QTY</Text>
                                    </View>
                                    <View style={styles.pres_conts}>
                                        <TextInput
                                            value={_leftEyeQuantity.toString()}
                                            style={styles.quantityTextInp}
                                            onChangeText={(val) => {
                                                onChangeText(val, 'left')
                                                setLeftEyeQuantity(val.toString())
                                            }}
                                            keyboardType='number-pad'
                                        />
                                    </View>
                                    <View style={styles.pres_conts}>
                                        <TextInput
                                            value={_rigthEyeQuantity.toString()}
                                            style={styles.quantityTextInp}
                                            onChangeText={(val) => {
                                                onChangeText(val, 'right')
                                                setRigthEyeQuantity(val.toString())
                                            }}
                                            keyboardType='number-pad'

                                        />
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                </>
            }


        </View >
    )
}

export default Options

const styles = StyleSheet.create({
    mainContainer: {
        width: width - 20,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: 20,
        // marginBottom: 100,
    },
    checkBox_cont: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

    },
    title: {
        fontSize: 16,
        color: "black",
        fontWeight: "500"
    },
    colorFlatlist: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    color_cont: {
        // width: 40,
        // height: 40,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 80,
        borderWidth: 0.3,
        marginHorizontal: 5,
        backgroundColor: "#f0f0f0"
    },

    quantityTextInp: {
        width: "80%",
        height: 45,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        borderColor: "#020621",
        color: "#020621",
        fontWeight: "400",

    },
    checkBox_text: {
        fontSize: 12,
        fontWeight: "500",
        color: "#020621",
        marginLeft: 10,
    },
    option_cont: {
        width: width - 20,
        alignItems: "flex-start",
        marginTop: 20

    },
    checkBox_option: {
        width: "100%",
        borderWidth: 0.5,
        borderColor: "#020621",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    prescription_text: {
        fontSize: 14,
        fontWeight: "500",
        color: "#020621",
        margin: 10,
    },
    blue_cont: {
        width: width - 40,
        height: 200,
        backgroundColor: "#020621",
        alignSelf: "center",
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: 'flex-start'
    },
    eye_cont: {
        width: width / 4.5,
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    pre_type_cont: {
        width: "75%",
        height: "95%",
        flexDirection: "row",
        backgroundColor: "white",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    pre_inner_type_cont: {
        width: "33.2%%",
        height: "100%",
        //backgroundColor: "red",
        justifyContent: "flex-end",
        alignItems: "center",

    },
    eye_inner_conts: {
        width: "100%",
        height: "33.2%",
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor:"red"
    },
    eye_text: {
        fontWeight: "600",
        fontSize: 14,
        color: "white",
    },
    pres_conts: {
        width: "100%",
        height: "33.2%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: "#bbb",
    },
    grid_text: {
        fontWeight: "600",
        fontSize: 11,
        color: "#020621"
    },
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
        fontSize: 12,
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