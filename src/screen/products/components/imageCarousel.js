import { Text, StyleSheet, Image, View, Dimensions, TouchableOpacity, ScrollView, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import Entypo from "react-native-vector-icons/Entypo"
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler'
const width = Dimensions.get("screen").width
const imageUrl = "https://aljaberoptical.com/media/catalog/product/cache/92a9a8f6050de739a96ad3044e707950"
const imageUrl2 = "https://aljaberoptical.com/media/catalog/product/cache/91596cb40167486f0a253bd4173ab8c2"
const ImageCarousel = ({ data, fisrtImage, onImagePress, usage, style, varient_selected }) => {

    const [selected, setSelected] = useState('')

    const selectImage = (obj) => {
        // console.log("OBJ selected:", obj)
        setSelected(obj)
    }

    useEffect(() => {
        setSelected(fisrtImage)
    }, [])

    const onNext = () => {
        if (data[selected?.index + 1] == undefined) {
            // console.log("reset working")
            setSelected(fisrtImage)
        } else {
            setSelected({
                id: data[selected?.index + 1]?.id,
                url: data[selected?.index + 1]?.file,
                index: selected?.index + 1,
            })
        }
    }

    const onBack = () => {
        if (data[selected?.index - 1] == undefined) {
            // console.log("reset working")
            setSelected(fisrtImage)
        } else {
            setSelected({
                id: data[selected?.index - 1]?.id,
                url: data[selected?.index - 1]?.file,
                index: selected?.index - 1,
            })
        }
    }

    scale = new Animated.Value(1)

    onZoomEventFunction = Animated.event(
        [{
            nativeEvent: { scale: this.scale }
        }],
        {
            useNativeDriver: true // very imp
        }
    )
    onZoomStateChangeFunction = (event) => {
        if (event.nativeEvent.oldState == State.ACTIVE) {
            Animated.spring(this.scale, {
                toValue: 1,
                useNativeDriver: true // imp very
            }).start()
        }
    }

    // console.log("adata ", fisrtImage)
    return (
        <GestureHandlerRootView style={[styles.mainContainer, style]}>

            <View style={{
                width: width - 10,
                height: usage == "open" ? 400 : 200,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                alignSelf: "center",
            }}>


                <TouchableOpacity
                    onPress={() => onNext()}
                    style={[styles.next, { right: 15, }]}>
                    <Entypo name="chevron-right" size={25} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onBack()}
                    style={[styles.next, { left: usage == "open" ? 15 : 5 }]}>
                    <Entypo name="chevron-left" size={25} color="white" />
                </TouchableOpacity>

                {usage == "openModal" ?
                    <TouchableOpacity
                        onPress={() => onImagePress(selected)}
                        style={{ width: "60%", height: "100%", justifyContent: "center", alignItems: "center", alignSelf: "center" }}
                    >
                        {/* {varient_selected ? */}
                            <Image
                                source={{ uri: imageUrl2 + selected?.url }}
                                style={{
                                    width: "100%", height: "100%",
                                }}
                                resizeMode='contain'
                            />
                            {/* // : <Image
                            //     source={{ uri: imageUrl2 + selected?.url }}
                            //     style={{
                            //         width: "100%", height: "100%",
                            //     }}
                            //     resizeMode='contain'
                            // />} */}
                    </TouchableOpacity>
                    :

                    <PinchGestureHandler
                        onActivated={() => { console.log("working") }}
                        onGestureEvent={this.onZoomEventFunction}
                        onHandlerStateChange={this.onZoomStateChangeFunction}
                    >

                        <Animated.Image
                            source={{ uri: imageUrl2 + selected?.url }}
                            style={[{ width: "80%", height: "100%", zIndex: 700 }, {
                                transform: [{
                                    scale: this.scale
                                }]
                            }]}
                            resizeMode='contain'
                        />
                    </PinchGestureHandler>

                }

            </View>
            {/* Image Selector */}
            <ScrollView
                style={{
                    width: width - 10, borderWidth: usage == "open" ? 2 : 1,
                    borderColor: "#f0f0f0",
                }}
                horizontal>
                <View style={styles?.image_selector_cont}>

                    {
                        data.map((image, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => selectImage({ id: image?.id, url: image.file, index: index })}
                                    style={[styles.image_selector_image, {
                                        borderWidth: image?.id == selected?.id ? 1 : null
                                    }]}>

                                    {/* {varient_selected ? */}
                                        <Image
                                            source={{ uri: imageUrl2 +  image.file }}
                                            style={{
                                                width: "100%", height: "100%",
                                            }}
                                            resizeMode='contain'
                                        />
                                        {/* : <Image
                                            source={{ uri: imageUrl + selected?.url }}
                                            style={{
                                                width: "100%", height: "100%",
                                            }}
                                            resizeMode='contain'
                                        />} */}
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

        </GestureHandlerRootView>
    )
}

export default ImageCarousel

const styles = StyleSheet.create({
    mainContainer: {
        width: width - 10,
        //  height: 350,
        paddingBottom: 10,
        marginTop: 20,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    image_selector_cont: {
        width: "100%",
        height: 70,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",


    },
    image_selector_image: {
        width: 70,
        height: 70,
        marginRight: 5,
        borderColor: "#020621"
    },
    next: {
        width: 25,
        height: 30,
        backgroundColor: "rgba(52,52,52,0.6)",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 200
    }
})