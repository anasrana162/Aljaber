import { Text, StyleSheet, View, Dimensions, ScrollView, TouchableOpacity, Platform, Image, LogBox, TextInput } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
const width = Dimensions.get("screen").width
const AuthTxtInp = ({ language, errorFlag, onChangeText, englishTitle, arabicTitle, changeIcon, placeholderTextColor,
    placeHolderTextEN, placeHolderTextAR, keyboardType, maxLength, secureTextEntry, errorMessageArabic, errorMessageEnglish, icon, value, style, onEndEditing, onTextInpTouch }) => {
    return (
        <>
            <View style={styles.txtInp_out_cont}>
                <TextInput
                    value={value}
                    placeholder={placeHolderTextEN}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    maxLength={maxLength}
                    secureTextEntry={secureTextEntry}
                    style={{ width: icon == undefined ? "100%" : "88%", height: "100%", paddingHorizontal: 10,color: "#020621", }}
                />
                <TouchableOpacity
                    onPress={changeIcon}
                >
                    <Image source={icon} style={{ width: 22, height: 22,marginTop:3 }} />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default AuthTxtInp

const styles = StyleSheet.create({
    txtInp_out_cont: {
        width: width - 80,
        height: 45,
        borderWidth: 1,
        borderColor: "#3F51B5",
        borderRadius: 20,
        marginVertical: 10,
        flexDirection: "row",
        // justifyContent:"center",
        alignItems: "center"
    }
})