import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

const width = Dimensions.get("screen").width

const CustomTextInp = ({ style, placeholder, onChangeText, value, keyboardType, titleEN, titleAR, numberOfLines, multiline, onEndEditing }) => {
    // console.log("numoflines", numberOfLines)
    return (
        <View style={[styles.mainContainer, style]}>
            {(titleEN == undefined && titleAR == undefined) ?
                <></>
                :
                <Text style={styles.title}>{titleEN}</Text>}
            <TextInput
                value={value}
                numberOfLines={numberOfLines}
                multiline={multiline}
                placeholder={placeholder}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                onEndEditing={onEndEditing}
                style={[styles.textinp_cont, {
                    height: numberOfLines !== undefined ? 100 : 40,
                }]}
            />
        </View>
    )
}

export default CustomTextInp

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        alignItems: "flex-start",
        marginTop: 10,
        marginBottom: 10,
    },
    textinp_cont: {
        // marginLeft: 10,
        width: "100%",
        borderWidth: 1,
        borderColor: "#777",
        // borderRadius: 5,
        color: "black",
        paddingLeft: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: "400",
        color: "#777",
        // marginLeft: 10,
        marginBottom: 5,
    },
})