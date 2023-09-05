import { Text, StyleSheet, View, Dimensions, FlatList, NativeModules, TouchableOpacity, Platform, Image } from 'react-native'
import React, { Component, PureComponent, memo } from 'react'
import DefaultCategoryItems from './defaultCategoryItems'

const width = Dimensions.get("screen").width

const DefaultCategories = ({ data }) => {
    // console.log("")
    // console.log("Default CAtegories:::::; ", data[0]?.children_data)

    const [selectedItem, setSelectedItem] = React.useState(null)

    const selectedItems = (item, index) => {
        console.log("Selected Item: ", item)
        setImmediate(() => {
            setSelectedItem(item)
        })
    }

    return (
        <View style={styles.mainContainer}>

            {/* <Image source={require('../../../../assets/separator-1.png')} style={{ width: width - 220, height: 18, marginBottom: 30 }} /> */}

            <View style={styles.flatList_outerCont}>

                {
                    data[0]?.children_data.map((item, index) => {
                        return (

                            <TouchableOpacity
                                onPress={() => selectedItems(item, index)}
                                style={styles.flatList_Cont}>

                                <View style={{
                                    width: 70,
                                    height: 70,
                                  //  borderWidth: 1,
                                    borderRadius: 120,
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
            </View>

            <DefaultCategoryItems data={selectedItem} />
        </View>
    )
}

export default memo(DefaultCategories)

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
        marginBottom: 20,
    },
    flatList_Cont: {
        justifyContent: "center",
        width: width / 4,
        alignItems: "center",
        marginBottom: 20,
        marginHorizontal: 10

    },
    text_item: {
        fontSize: 12,
        fontWeight: "600",
        color: "#020621",
    }
})