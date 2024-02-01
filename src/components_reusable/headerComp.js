import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import AntDesign from "react-native-vector-icons/AntDesign"
import { TouchableOpacity } from 'react-native'
const width = Dimensions.get("screen").width

const HeaderComp = ({ titleEN, titleAR, navProps }) => {
    return (
        <View style={styles.header_comp}>
            <TouchableOpacity 
            onPress={()=>navProps.pop()}
            style={{position:"absolute",left:10,}}>
                <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            {/** Title screen */}
            <Text style={styles.heading}>{titleEN}</Text>
        </View>
    )
}

export default HeaderComp

const styles = StyleSheet.create({
    heading: {
        fontSize: 22,
        color: "white",
        fontWeight: "600",

    },
    header_comp: {
        width: width,
        justifyContent: "center",
        backgroundColor: "#020621",
        alignItems: "center",
        paddingTop: 0,
        paddingBottom: 10
    },
})