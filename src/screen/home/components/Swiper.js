import { Text, StyleSheet, View, Dimensions, NativeModules, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import SwiperFlatList from 'react-native-swiper-flatlist';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT
import api from '../../../api/api';

const Swiper = ({ data, admintoken, navProps }) => {

    const selectedItems = async (item) => {

        var image = "/pub/media/wysiwyg/smartwave/porto/theme_assets/images/banner2.jpg"
        await api.get("categories/" + item?.catid, {
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
            console.log("Err Fetching image in Swiper: ", err)
            return
        })
        console.log("item?.catid", item?.catid);
        navProps.navigate("Products", {
            item,
            mainCat_selected: data?.position,
            sub_category_id: item?.catid,
            imageLinkMain: image,
            otherCats: [],
            whereAbouts: "banner",


        })
    }


    return (
        <View style={styles.mainContainer}>
            <SwiperFlatList
                autoplay
                autoplayDelay={2}
                autoplayLoop
                index={2}
                showPagination
                paginationDefaultColor='#f2f4fa'
                //paginationStyle={{ borderWidth: 1, height: 30, alignItems: "center", width: width - 60,borderRadius:20}}
                paginationActiveColor='#020621'
                // paginationStyleItemInactive={{ borderWidth: 1,borderColor:"#233468"}}
                // paginationStyleItemActive={{height:18,width:18 }}

                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        disabled={item?.catid == undefined || item?.catid == null || item?.catid == ""}
                        onPress={() => selectedItems(item)}
                        style={{ width: width, height: 125 }}>
                        <Image source={{ uri: item?.image }} style={{
                            width: width, height: 125
                        }} resizeMode='stretch' />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default Swiper

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        height: 170,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        // position: "absolute",
        // top: 90
    }
})