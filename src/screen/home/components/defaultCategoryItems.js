import { Text, StyleSheet, View, Dimensions, FlatList, NativeModules, TouchableOpacity, Platform, Image, ScrollView } from 'react-native'
import React, { Component, PureComponent, memo, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import api, { custom_api_url, basis_auth } from '../../../api/api';
const width = Dimensions.get("screen").width
import LottieView from 'lottie-react-native';
const DefaultCategoryItems = ({ data, navProps, onNextPress, admintoken }) => {
    // var tempArr = []
    var [tempArr, setTempArr] = useState([])
    var [loaderDot, setLoaderDot] = React.useState(false)
    selectedItems = async (item) => {
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
            otherCats: data,


        })
    }

    const fetchDetails = async () => {
        // console.log("working", data);
        setLoaderDot(true)
        var arr = []
        for (let i = 0; i < data?.children_data?.length; i++) {
            await api.get(custom_api_url + "func=get_category_image&catid=" + data?.children_data[i]?.id)
                .then((res) => {

                    data.children_data[i].image = "https://aljaberoptical.com" + res?.data?.image
                    data.children_data[i].visibe_menu = res?.data?.visibe_menu
                    if (data.children_data[i].visibe_menu == "1") {

                        arr.push(data?.children_data[i])
                    }
                    if (data?.children_data?.length - 1 == i) {
                        setTempArr(arr)
                        setLoaderDot(false)
                    }
                }).catch((err) => {
                    console.log("Err Fetching image in DefaultCategoryItems: ", err)
                })

        }
        // console.log(tempArr, "tempArr");

    }

    useEffect(() => {
        fetchDetails()
    }, [])

    return (
        <View style={styles.mainContainer}>

            <View style={{
                width: width - 15,
                height: 50,
                borderRadius: 5,
                overflow: "hidden",marginTop:20
            }}>
                <Image source={{ uri: data?.image }}
                resizeMode='cover'
                style={{ width: "100%", height: "100%", }} />
                <View style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    opacity: 0.5,
                    position: "absolute",
                    zIndex: 250,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text style={{ fontSize: 22, fontWeight: "700", color: "white" }}>{data?.name}</Text>
                </View>

            </View>


            {loaderDot == true ?
                <View style={{
                    width: "80%",
                    height: 150,
                }} >
                    < LottieView source={require('../../../animations/dots_load.json')}
                        autoPlay={true}
                        resizeMode='cover'
                        loop

                    />
                </View>
                :
                <View style={styles.flatList_outerCont}>
                    <TouchableOpacity
                        onPress={onNextPress}
                        style={styles.next_Arrow}>
                        <AntDesign name="arrowright" size={27} color="white" />
                    </TouchableOpacity>
                    <ScrollView
                        // pagingEnabled 
                        horizontal
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                    >
                        {
                            tempArr?.map((item, index) => {
                                console.log(item, "defaultCategoryItem")
                                // switch (item?.id) {
                                //     case 81:
                                //         item.is_active = false
                                //         break;
                                //     case 74:
                                //         item.is_active = false
                                //         break;
                                //     case 45:
                                //         item.is_active = false
                                //         break;
                                //     case 34:
                                //         item.is_active = false
                                //         break;
                                // }
                                return (
                                    <View
                                        key={String(index)}
                                    >
                                        {/* index <= 2 */}
                                        {item?.visibe_menu == "1" &&
                                            <TouchableOpacity
                                                onPress={() => selectedItems(item, index)}

                                                // key={String(item?.name)}
                                                style={styles.flatList_Cont}>

                                                <View style={{
                                                    width: 130,
                                                    height: 160,
                                                    // borderWidth: 1,
                                                    borderRadius: 5,
                                                    marginBottom: 10,
                                                    overflow: "hidden",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderWidth: item?.parent_id == 102 ? 1 : 0,
                                                    zIndex: 150,
                                                }}>

                                                    {/* https://wpstaging51.a2zcreatorz.com/ */}
                                                    <Image source={{ uri: item?.image }} style={{ width: "100%", height: "100%", }} />
                                                </View>
                                                <Text numberOfLines={2} style={styles.text_item}>{item?.name}</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            }
            {/* <Image source={require('../../../../assets/separator-1.png')} style={{ width: width - 220, height: 18, marginBottom: 30 }} /> */}
        </View>
    )
}

export default memo(DefaultCategoryItems)

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 0
    },
    flatList_outerCont: {
        width: width - 10,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 10,
        marginTop: 10
        //backgroundColor:"red",
    },
    flatList_Cont: {
        justifyContent: "flex-start",
        // backgroundColor:"red",
        width: width / 4,
        alignItems: "center",
        //marginBottom: 20,
        marginHorizontal: 20,
        marginVertical: 10

    },
    text_item: {
        fontSize: 12,
        fontWeight: "600",
        color: "#020621",
        textAlign: "center"
    },
    next_Arrow: {
        width: 50,
        height: 50,
        borderRadius: 30,
        position: "absolute",
        right: 10,
        zIndex: 200,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.7
    }
})