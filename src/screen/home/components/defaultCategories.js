import { Text, StyleSheet, View, Dimensions, FlatList, NativeModules, TouchableOpacity, Platform, Image, KeyboardAvoidingView } from 'react-native'
import React, { Component, PureComponent, memo, useEffect } from 'react'
import DefaultCategoryItems from './defaultCategoryItems'
import api from '../../../api/api'
const width = Dimensions.get("screen").width

const DefaultCategories = ({ data, navProps, firstSubItem, admintoken, loaderDot }) => {
    // console.log("")
    // console.log("Default CAtegories:::::; ", firstSubItem)

    var [selectedItem, setSelectedItem] = React.useState(firstSubItem)
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0)

    const [keyADD, setKeyADD] = React.useState(0)
    const selectedItems = (item, index) => {
        // console.log("Selected Item: ", item)
        if (selectedItem?.id == item?.id) {
            return mainSelectedItems(item)
        }
        setImmediate(() => {
            setSelectedItem(item)
            setSelectedItemIndex(index)
            setKeyADD(keyADD + 1)
        })
    }

    const mainSelectedItems = async (item) => {

        var image = "/pub/media/wysiwyg/smartwave/porto/theme_assets/images/banner2.jpg"
        await api.get("categories/" + item?.id, {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            }
        }).then((res) => {
            // console.log("Response for Top Category API:", res?.data)
            for (let r = 0; r < res?.data?.custom_attributes.length; r++) {
                if (res?.data?.custom_attributes[r].attribute_code == "image") {
                    image = res?.data?.custom_attributes[r]?.value
                    break;
                }

            }
        }).catch((err) => {
            console.log("Err Fetching image in DefaultCategoryItems: ", err)
        })

        navProps.navigate("Products", {
            item,
            mainCat_selected: data?.position,
            sub_category_id: item?.id,
            imageLinkMain: image,
            otherCats: item,
            whereAbouts: "fullcats",

        })
    }



    const onNextPress = () => {

        if (data[selectedItemIndex + 1] == undefined) {
            setSelectedItem(firstSubItem)
            setSelectedItemIndex(0)
            setKeyADD(keyADD + 1)
        } else {
            setSelectedItem(data[selectedItemIndex + 1])
            setSelectedItemIndex(selectedItemIndex + 1)
            setKeyADD(keyADD + 1)

        }

    }
    // console.log("data", data);

    return (


        <View style={styles.mainContainer} key={keyADD}>

            <View style={styles.flatList_outerCont}>

                {
                    data?.map((item, index) => {
                        // console.log("firstSubItem:::::; ", firstSubItem?.id)
                        // console.log("selectedItem:::::; ", item?.visibe_menu)
                        // console.log("item:::::;111", item?.id, " ", item?.name, " ", item?.include_in_menu)
                        return (
                            <View
                                key={String(index)}
                            >

                                {item?.visibe_menu == 1 &&
                                    <TouchableOpacity

                                        onPress={() => selectedItems(item, index)}
                                        activeOpacity={0.9}
                                        style={styles.flatList_Cont}>
                                        <Image
                                            resizeMethod='resize'
                                            source={{ uri: item?.image }}
                                            resizeMode='cover'
                                            style={[styles.image_cont, { borderWidth: item?.id == selectedItem?.id ? 3 : 0, }]} />
                                        <Text numberOfLines={1} style={styles.text_item}>{item?.name}</Text>
                                        <View style={{
                                            width: "100%",
                                            height: 2,
                                            backgroundColor: item?.id == selectedItem?.id ? "#233468" : "transparent",
                                            borderRadius: 10,
                                            marginBottom: 10,
                                            marginTop: 2
                                        }} />
                                    </TouchableOpacity>
                                }
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
                    admintoken={admintoken}
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
        marginTop: 10
    },
    flatList_outerCont: {
        width: width - 10,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 0,
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

    },
    image_cont: {
        width: 90,
        height: 90,

        borderColor: "#233468",
        borderRadius: 120,
        marginBottom: 10,
        overflow: "hidden",
        zIndex: 150,
    },
})