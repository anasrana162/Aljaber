import { Text, StyleSheet, Image, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'

const width = Dimensions.get("screen").width
const imageUrl = "https://aljaberoptical.com/media/catalog/product/cache/7e7ccda6a55a8c6a873dc5d48d3e9907"

const ImageCarousel = ({ data, fisrtImage }) => {

    const [selected, setSelected] = useState(fisrtImage)
    const selectImage = (obj) => {
        console.log("OBJ selected:", obj)
        setSelected(obj)
    }

    return (
        <View style={styles.mainContainer}>
            <View style={{
                width: width - 10,
                height: 200,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                alignSelf: "center",
            }}>



                <Image
                    source={{ uri: imageUrl + selected?.url }}
                    style={{ width: "60%", height: "100%", }}
                    resizeMode='contain'
                />

            </View>
            {/* Image Selector */}
            <ScrollView
                style={{
                    width: width - 10, borderWidth: 1,
                    borderColor: "#f0f0f0"
                }}
                horizontal>
                <View style={styles?.image_selector_cont}>

                    {
                        data.map((image, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => selectImage({ id: image?.id, url: image.file })}
                                    style={[styles.image_selector_image, {
                                        borderWidth: image?.id == selected?.id ? 1 : null
                                    }]}>

                                    <Image
                                        source={{ uri: imageUrl + image.file }}
                                        style={{ width: "100%", height: "100%" }}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
            {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >

            </ScrollView> */}
        </View >
    )
}

export default ImageCarousel

const styles = StyleSheet.create({
    mainContainer: {
        width: width - 10,
        //  height: 350,
        paddingBottom: 10,
        marginTop:20,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    image_selector_cont: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",


    },
    image_selector_image: {
        width: 70,
        height: 70,
        marginRight: 5,
        borderColor: "#020621"
    }
})