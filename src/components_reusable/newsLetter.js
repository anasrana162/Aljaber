import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { Component } from 'react'
import api, { custom_api_url } from '../api/api'
const width = Dimensions.get("screen").width


const NewsLetter = ({ screenName, props: { userData: { admintoken } } }) => {

    const [email, setEmail] = React.useState('')

    const subscribe = () => {
        console.log("admintoken", admintoken)
        api.post(custom_api_url + "func=subscriber( Username: apiuser, Password: Pakistani2023 )", {
            "email": email,
        }).then((res) => {
            console.log("letter Subscription, ", res?.data)
        }).catch((err) => {
            console.log("NewsLtter Subscription Error", err)
        })
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.inner_mainContainer}>

                {/* Title */}
                <Text style={styles.title}>NewsLetter</Text>

                {/* Paragraph */}
                <Text style={styles.para}>Be the first to know about our amazing store and online offers</Text>

                {/* TextInput Email */}
                <TextInput
                    placeholder='Email'
                    placeholderTextColor={"#bbb"}
                    // value={}
                    style={styles.txtinp}
                    onChangeText={(txt) => setEmail(txt.toLowerCase())}
                />

                {/* Subscribe Button */}
                <TouchableOpacity
                    onPress={() => subscribe()}
                    style={styles.subscribe_btn}>
                    <Text style={[styles.title, { color: "white", fontSize: 14 }]}>Subscribe</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default NewsLetter



const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        // height: 200,
        backgroundColor: "#dce3fc",
        justifyContent: "center",
        alignItems: "center",

    },
    inner_mainContainer: {
        width: "90%",
        // height: "100%",
        marginTop: 30,
        backgroundColor: "#dce3fc",
        justifyContent: "flex-start",
        alignItems: "flex-start",

    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: "#020621"
    },
    para: {
        fontSize: 14,
        fontWeight: "500",
        color: "#020621",
        marginTop: 10,
        width: width - 30,
    },
    txtinp: {
        width: width - 60,
        height: 40,
        backgroundColor: "white",
        borderWidth: 1,
        marginTop: 20,
        paddingLeft: 10,
    },
    subscribe_btn: {
        width: 120,
        height: 40,
        backgroundColor: "#233468",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30,
    }
})