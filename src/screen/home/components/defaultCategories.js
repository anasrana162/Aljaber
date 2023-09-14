import { Text, StyleSheet, View, Dimensions, FlatList, NativeModules, TouchableOpacity, Platform, Image } from 'react-native'
import React, { Component, PureComponent, memo } from 'react'
import DefaultCategoryItems from './defaultCategoryItems'

const width = Dimensions.get("screen").width

const DefaultCategories = ({ data, navProps, firstSubItem }) => {
    console.log("")
    // console.log("Default CAtegories:::::; ", firstSubItem)

    var [selectedItem, setSelectedItem] = React.useState(null)
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(null)

    const selectedItems = (item, index) => {
       // console.log("Selected Item: ", item)
        setImmediate(() => {
            setSelectedItem(item)
            setSelectedItemIndex(index)
        })
    }

    const onNextPress = () => {
        //console.log("DATA ON NEXT PRESS", data?.length - 1)
        
            if (data[selectedItemIndex + 1]?.is_active == "true") {

                setSelectedItem(data[selectedItemIndex + 1])
                setSelectedItemIndex(selectedItemIndex + 1)
            } else {
                setSelectedItem(data[selectedItemIndex + 3])
                setSelectedItemIndex(selectedItemIndex + 3)
            }
    }

    return (
        <View style={styles.mainContainer}>



            <View style={styles.flatList_outerCont}>

                {
                    data?.map((item, index) => {
                        return (
                            <View
                            key={String(index)}
                            >

                                {item.is_active == "true" && 
                                <TouchableOpacity
                                    onPress={() => selectedItems(item, index)}
                                    activeOpacity={0.9}
                                   
                                    style={styles.flatList_Cont}>

                                    <View style={{
                                        width: 90,
                                        height: 90,
                                        borderWidth: item?.id == selectedItem?.id ? 3 : 0,
                                        borderColor: "#233468",
                                        borderRadius: 120,
                                        marginBottom: 10,
                                        overflow: "hidden",
                                        zIndex: 150,
                                    }}>

                                        {/* https://wpstaging51.a2zcreatorz.com/ */}
                                        {item?.placeHolder == "false" && <Image source={{ uri: "https://aljaberoptical.com/" + item?.img }} style={{ width: "100%", height: "100%" }} />}
                                        {item?.placeHolder == "true" && <Image source={{ uri: item?.img }} style={{ width: "100%", height: "100%" }} />}
                                    </View>
                                    <Text numberOfLines={1} style={styles.text_item}>{item?.name}</Text>
                                    <View style={{
                                        width: "100%",
                                        height: 2,
                                        backgroundColor: item?.id == selectedItem?.id ? "#233468" : "transparent",
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        marginTop: 2
                                    }} />
                                </TouchableOpacity>}
                            </View>
                        )
                    })
                }
            </View>

            <DefaultCategoryItems
                data={selectedItem == null ? firstSubItem : selectedItem}
                selectedItemIndex={selectedItemIndex}
                mainCats={data}
                navProps={navProps}
                onNextPress={() => onNextPress()}
            />
        </View>
    )
}

export default memo(DefaultCategories)

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    flatList_outerCont: {
        width: width - 10,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 20,
    },
    flatList_Cont: {
        justifyContent: "center",
        // width: 150,
        // height: 150,
        alignItems: "center",
        marginBottom: 10,
        marginHorizontal: 10

    },
    text_item: {
        fontSize: 11,
        fontWeight: "400",
        color: "#020621",

    }
})