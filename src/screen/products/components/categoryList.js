import { Text, StyleSheet, Image, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { Component } from 'react'
const width = Dimensions.get("screen").width
const CategoryList = ({ categories, selectedItem }) => {
    // console.log("CategoryList",categories)
    return (
        <View style={styles.mainContainer}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                horizontal
            >
                <View style={[styles.mainContainer, {
                    width: null,
                    flexDirection: "row"
                }]}>

                    {
                        categories.map((item, index) => {
                            return (

                                <TouchableOpacity
                                    onPress={() => selectedItem(item, index)}
                                    key={String(index)}
                                    style={{
                                        padding: 10,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        borderColor: "#3f999e",
                                        overflow: "hidden",
                                        zIndex: 150,
                                        marginHorizontal: 20
                                    }}>


                                    <Text numberOfLines={2} style={styles.text_item}>{item?.name}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </View>

    )
}

export default CategoryList

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        //flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        marginTop: 10,
        //  backgroundColor: "#bbb"
    },
})