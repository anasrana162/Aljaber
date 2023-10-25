import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Fontisto from 'react-native-vector-icons/Fontisto'
import OptionDropdown from './optionDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const width = Dimensions.get("screen").width;

const Options = ({
    checkMarked,
    onChangeText,
    option_package_size,
    option_power,
    product_varients,
    selectedItemLeftPower,
    selectedItemLeftPackage,
    selectedItemRightPower,
    selectedItemRightPackage,
    openDropDown,
    leftEyeQuantity,
    rigthEyeQuantity,
    selectedVarient,
}) => {

    const [checked, setChecked] = useState(false)

    return (
        <View style={styles.mainContainer}>
            {option_power !== null && <View style={styles.checkBox_cont} >
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


            </View>}

            {product_varients !== null &&
                <View style={styles.colorFlatlist}>
                    <ScrollView
                        horizontal
                        style={{ width: "100%" }}
                    >
                        {
                            product_varients?.map((data, index) => {
                                // console.log("data", data?.color?.toLowerCase())
                                return (
                                    <TouchableOpacity
                                        onPress={() => selectedVarient(data, index)}
                                        key={String(index)}
                                        style={[styles.color_cont, {
                                            backgroundColor: data?.color?.toLowerCase()
                                        }]}>

                                    </TouchableOpacity>
                                )

                            })
                        }

                    </ScrollView>
                </View>
            }

            {checked ?
                <>
                    <View style={styles.checkBox_option}>
                        <Text style={styles.prescription_text}>ENTER YOUR PRESCRIPTION</Text>

                        <View style={styles.blue_cont}>

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

                                <View style={[styles.pre_inner_type_cont, { width: "40%" }]}>

                                    <View style={styles.pres_conts}>
                                        <Text style={styles.grid_text}>{option_package_size?.title}</Text>
                                    </View>
                                    <View style={styles.pres_conts}>

                                        <View style={[styles?.option_cont, { width: "90%", marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>

                                            <TouchableOpacity
                                                onPress={() => openDropDown(option_package_size, "leftPA")}
                                                style={[styles?.dropdown_cont, { marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>
                                                <Text style={styles.selectedItem_text}>{selectedItemLeftPackage?.title}</Text>
                                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" style={{ marginRight: 10 }} />
                                            </TouchableOpacity>

                                        </View>


                                    </View>
                                    <View style={styles.pres_conts}>
                                        <View style={[styles?.option_cont, { width: "90%", marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>

                                            <TouchableOpacity
                                                onPress={() => openDropDown(option_package_size, 'rightPA')}
                                                style={[styles?.dropdown_cont, { marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>
                                                <Text style={styles.selectedItem_text}>{selectedItemRightPackage?.title}</Text>
                                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" style={{ marginRight: 10 }} />
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.pre_inner_type_cont, { width: "35%" }]}>

                                    <View style={styles.pres_conts}>
                                        <Text style={styles.grid_text}>{option_power?.title}</Text>
                                    </View>
                                    <View style={styles.pres_conts}>
                                        <View style={[styles?.option_cont, { width: "90%", marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>

                                            <TouchableOpacity
                                                onPress={() => openDropDown(option_power, "leftPO")}
                                                style={[styles?.dropdown_cont, { marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>
                                                <Text style={styles.selectedItem_text}>{selectedItemLeftPower?.title}</Text>
                                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" style={{ marginRight: 10 }} />
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                    <View style={styles.pres_conts}>
                                        <View style={[styles?.option_cont, { width: "90%", marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>

                                            <TouchableOpacity
                                                onPress={() => openDropDown(option_power, "rightPO")}
                                                style={[styles?.dropdown_cont, { marginTop: 0, borderRadius: 5, overflow: "hidden" }]}>
                                                <Text style={styles.selectedItem_text}>{selectedItemRightPower?.title}</Text>
                                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#020621" style={{ marginRight: 10 }} />
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.pre_inner_type_cont, { width: "25%" }]}>

                                    <View style={styles.pres_conts}>
                                        <Text style={styles.grid_text}>QTY</Text>
                                    </View>
                                    <View style={styles.pres_conts}>
                                        <TextInput
                                            value={leftEyeQuantity.toString()}
                                            style={styles.quantityTextInp}
                                            onChangeText={(val) => onChangeText(val, 'left')}
                                            keyboardType='number-pad'
                                        />
                                    </View>
                                    <View style={styles.pres_conts}>
                                        <TextInput
                                            value={rigthEyeQuantity.toString()}
                                            style={styles.quantityTextInp}
                                            onChangeText={(val) => onChangeText(val, 'right')}
                                            keyboardType='number-pad'
                                        />
                                    </View>
                                </View>
                            </View>

                        </View>

                    </View>
                    <View style={{
                        width: "100%", height: 1, backgroundColor: "#020621",
                        marginTop: 15
                    }}></View>
                </>
                :
                <>
                    {option_package_size != null &&
                        <OptionDropdown checked={checked} title={option_package_size?.title} data={option_package_size} />
                    }

                    {option_power != null &&
                        <OptionDropdown checked={checked} title={option_power?.title} data={option_power} />
                    }

                    <View style={{
                        width: "100%", height: 1, backgroundColor: "#020621",
                        marginTop: 15
                    }}></View>
                </>}
        </View>
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
    colorFlatlist: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
    },
    color_cont: {
        width: 40,
        height: 40,
        borderRadius: 80,
        borderWidth: 0.3,
        marginHorizontal: 5,
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
        flexDirection: "row",
        justifyContent: 'flex-start'
    },
    eye_cont: {
        width: "25%",
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
        fontWeight: "500",
        fontSize: 12,
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