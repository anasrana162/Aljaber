import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
const FBListCont = ({ filterData, checkBox, checkBoxID, filterData_Cont_Open, isColor, openFilterDataCont, openCheckBox, closeCheckBox }) => {

    // console.log("checkBoxID={checkBoxID}", checkBoxID)

    return (
        <View
            style={styles.item_cont}
        >
            <View style={styles.inner_item_cont}>
                <Text style={styles.item_text}>{filterData?.name}</Text>
                <TouchableOpacity
                    onPress={openFilterDataCont}
                    style={{ padding: 10 }}>
                    <AntDesign name={filterData_Cont_Open == true ? "minus" : "plus"} size={20} color="#777" />
                </TouchableOpacity>
            </View>

            {(filterData_Cont_Open == true && isColor == true) &&

                <View style={[styles.inner_item_list_cont, { flexWrap: "wrap" }]}>
                    {

                        filterData?.value?.map((data, index) => {
                            console.log(" filterData?.value", filterData)
                            return (
                                <TouchableOpacity
                                    key={String(index)}
                                    onPress={() => {
                                        if(checkBoxID?.filter((check_data) => check_data == data?.color_name)[0] == data?.color_name){

                                            closeCheckBox(data?.color_name, filterData?.attribute_code, data?.product_ids)
                                        }else{

                                            openCheckBox(data?.color_name, filterData?.attribute_code, data?.product_ids)}}
                                        }
                                    style={[styles.touchable, { backgroundColor: data?.color_code }]}>
                                    <>
                                        {checkBoxID?.filter((check_data) => check_data == data?.color_name)[0] == data?.color_name ?
                                            <>
                                                <AntDesign name="check" size={16} color="white" />
                                            </>

                                            : <></>}
                                    </>
                                </TouchableOpacity>


                            )
                        })}
                </View>
            }



            {(filterData_Cont_Open == true && isColor == undefined) &&

                <>
                    {
                        filterData?.value?.map((data, index) => {
                            // console.log(" filterData?.value", data)
                            return (
                                <View
                                    key={String(data?.id)}
                                    style={styles.inner_item_list_cont}>
                                    {/* {console.log("  ")}
                                    {console.log("checkBoxID Filter", checkBoxID?.filter((data) => data?.id == data?.id)[0])}
                                    {console.log("  ")} */}
                                    {checkBoxID?.filter((check_data) => check_data == data?.id)[0] == data?.id ?
                                        <TouchableOpacity
                                            // onPress={() => setcld_check(!cld_check)}
                                            onPress={() => closeCheckBox(data?.id, filterData?.attribute_code, data?.product_ids)}
                                        >
                                            <MaterialIcons name="check-box" size={20} color="#777" />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            // onPress={() => setcld_check(!cld_check)}
                                            onPress={() => openCheckBox(data?.id, filterData?.attribute_code, data?.product_ids)}

                                        >
                                            <MaterialIcons name="check-box-outline-blank" size={20} color="#777" />
                                        </TouchableOpacity>}

                                    <Text style={styles.product_name}>{data?.product_name} ({data?.product_count})</Text>

                                </View>

                            )
                        })}
                </>


            }


        </View>
    )
}

export default FBListCont

const styles = StyleSheet.create({
    item_cont: {
        width: "100%",
        padding: 10,
        // height: 50,

        borderTopWidth: 0.25,
        borderBottomWidth: 0.25,
        borderRightWidth: 1,
    },
    inner_item_cont: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    item_text: {
        fontWeight: "600",
        fontSize: 15,
        color: "black",
        textAlign: 'left',
        // padding: 10,
        width: 130,
    },
    inner_item_list_cont: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 5,
    },
    product_name: {
        fontWeight: "400",
        fontSize: 12,
        color: "#777",
        marginLeft: 5,
    },
    touchable: {
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent:"center",
        alignItems:"center",
        margin: 5,
        borderWidth:0.5,
    }
})