import { Text, StyleSheet, View, Dimensions, NativeModules, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import SwiperFlatList from 'react-native-swiper-flatlist';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT


const Swiper = ({ data }) => {
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
                    <View style={{ width: width, height: 125 }}>
                        <Image source={{ uri: item?.source }} style={{
                            width: width, height: 125
                        }} resizeMode='stretch' />
                    </View>
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