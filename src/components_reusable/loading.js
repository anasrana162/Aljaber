import { StyleSheet, Text, View, NativeModules, Dimensions, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

const Loading = ({ loading, screenName }) => {
    return (
        <>
            <View style={styles.loader_main_cont}>
            </View>
            <View style={styles.loader_main_inner_cont}>
                {screenName == undefined ?
                    <Image source={require('../../assets/giflogo.gif')} style={{ width: 400, height: 400, position: "absolute", zIndex: 300 }} />
                    :
                    <ActivityIndicator size={"large"} color={"black"} />
                }
                {/* <LottieView source={require('../animations/animation_lmfwxavv.json')} autoPlay={true} loop style={{ width: 230, height: 230, position: "absolute", zIndex: 300 }} /> */}
            </View>
        </>
    )
}

export default Loading

const styles = StyleSheet.create({
    loader_main_cont: {
        width: width,
        height: height,
        backgroundColor: "#fff",
        opacity: 0.9,
        position: "absolute",
        zIndex: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    loader_main_inner_cont: {
        width: width,
        height: height,
        backgroundColor: "transparent",
        position: "absolute",
        zIndex: 250,
        justifyContent: "center",
        alignItems: "center",
    },
})