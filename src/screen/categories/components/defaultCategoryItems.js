import { Text, StyleSheet, View, Dimensions, FlatList, NativeModules, TouchableOpacity, Platform, Image, ScrollView } from 'react-native'
import React, { Component, PureComponent, memo } from 'react'

const width = Dimensions.get("screen").width

const DefaultCategoryItems = ({ data }) => {
    console.log("DefaultCategoryItems:;;;;; ", data?.children_data)
    return (
        <View style={styles.mainContainer}>

            {/* <Image source={require('../../../../assets/separator-1.png')} style={{ width: width - 220, height: 18, marginBottom: 30 }} /> */}

            <View style={styles.flatList_outerCont}>
                {/* <ScrollView 
                 //pagingEnabled 
                 horizontal 
                 showsVerticalScrollIndicator={false}
                 showsHorizontalScrollIndicator={false}  
                 contentOffset={{x:6}}
                 > */}
                    {
                        data?.children_data.map((item, index) => {
                            console.log(item)
                            return (

                                <TouchableOpacity
                                  //  onPress={() => selectedItems(item, index)}
                                    style={styles.flatList_Cont}>

                                    <View style={{
                                        width: 100,
                                        height: 90,
                                       // borderWidth: 1,
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        overflow: "hidden",
                                        zIndex: 150,
                                    }}>

                                        <Image source={require('../../../../assets/placeholder.jpeg')} style={{ width: "100%", height: "100%" }} />
                                    </View>
                                    <Text numberOfLines={1} style={styles.text_item}>{item?.name}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                {/* </ScrollView> */}
            </View>


        </View>
    )
}

export default memo(DefaultCategoryItems)

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 20
    },
    flatList_outerCont: {
        width: width - 20,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start',
        alignItems: "center",
        marginBottom: 40,
        //backgroundColor:"red",
    },
    flatList_Cont: {
        justifyContent: "center",
       // backgroundColor:"red",
        width: width / 4,      
        alignItems: "center",
        //marginBottom: 20,
        marginHorizontal: 10,
        marginVertical:10

    },
    text_item: {
        fontSize: 12,
        fontWeight: "600",
        color: "#020621",
    }
})