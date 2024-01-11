import { Text, StyleSheet, View, Dimensions, FlatList, NativeModules, TouchableOpacity, Platform, Image } from 'react-native'
import React, { Component, PureComponent, memo } from 'react'

import Ionicons from "react-native-vector-icons/Ionicons"


const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height
const HomeCategories = ({ data, navProps, mainCatPos }) => {


    // console.log("DefaultCategoryItems:;;;;; ", data)

    const selectedItems = (item, index,) => {

        // console.log("Selected Item: ", this.state.selectedCat)
        navProps.navigate("Products", { 
            item, 
            mainCat_selected: mainCatPos, 
            sub_category_id: item?.id,
            imageLinkMain:item?.image
        })

    }

    return (
        <View style={[styles.mainContainer, {
            //  height: 300 * data?.length,
            //marginTop: 80,
            marginBottom: 0

        }]}>
            <Text style={[styles.text_item, {
                marginBottom: 10,
                fontSize: 32
            }]}>Top Category</Text>

            <Text style={[styles.text_item, {
                marginBottom: 20,
                fontSize: 18,
                width: "70%",
                textAlign: "center",
            }]}>Browse the huge variety of our products</Text>


            {/* <FlatList
                data={data}
                numColumns={2}
                contentContainerStyle={styles.mainContainer}
                renderItem={(item, index) => {
                    console.log("item", item?.item)
                    return (

                        <TouchableOpacity style={styles.flatList_maCont} >


                            <View style={{
                                width: 150,
                                height: 150,
                                borderWidth: 1,
                                borderRadius: 120,
                                marginBottom: 10,
                                marginHorizontal: 10,
                                overflow: "hidden",
                                zIndex: 150
                                //   backgroundColor: "red"
                            }}>

                                <Image source={{ uri: item?.item?.img }} style={{ width: "100%", height: "100%" }} />
                            </View>
                            <Text style={styles.text_item}>{item?.item?.categoryName}</Text>
                        </TouchableOpacity>
                    )
                }}
            /> */}
            <View style={{
                width: width,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 40,
            }}>

                {
                    data.map((item, index) => {
                        console.log("item", item.id)
                        return (

                            <View
                                key={String(index)}
                            >
                                {item?.is_active == true && index != 4 &&
                                    <TouchableOpacity

                                        onPress={() => selectedItems(item, index)}
                                        style={styles.flatList_Cont}>


                                        <View style={{
                                            width: 150,
                                            height: 150,
                                            borderWidth: 1,
                                            borderRadius: 120,
                                            marginBottom: 10,
                                            overflow: "hidden",
                                            zIndex: 150,
                                        }}>
                                            <Image

                                                source={{ uri: item?.main_menu_image }}
                                                style={{ width: "100%", height: "100%", }} />
                                
                                        </View>
                                        <Text numberOfLines={1} style={[styles.text_item, {
                                            fontSize: 15,
                                            width: item?.name == "Accessories for Sunglasses" ? 105 : null,
                                            //alignSelf: "center"
                                        }]}>{item?.name}</Text>
                                    </TouchableOpacity>}
                            </View>
                        )
                    })
                }
            </View>
            {/* <Image source={require('../../../../assets/separator-1.png')} style={{ width: width - 220, height: 18, marginBottom: 30 }} /> */}
        </View>
    )
}

export default memo(HomeCategories)

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        // flexWrap: 'wrap',
        justifyContent: "flex-start",
        alignItems: "center",
        // marginBottom: 40,
        //paddingBottom: 80,
        marginTop: 20
        //backgroundColor: 'red'
    },
    flatList_Cont: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        marginHorizontal: 10

    },
    text_item: {
        fontSize: 20,
        fontWeight: "600",
        color: "#020621",
    }
})