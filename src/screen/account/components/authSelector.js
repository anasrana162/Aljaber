import { Text, StyleSheet, View, Dimensions, ScrollView, TouchableOpacity, Platform, Image, LogBox } from 'react-native'
import React, { Component, useState } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Login from './login'
import Register from './register'

const width = Dimensions.get("screen").width



const AuthSelector = ({ props }) => {


    /** States */
    const [login, setLogin] = useState(true)
    const [reg, setReg] = useState(false)
    const selectAuth = (key) => {
        switch (key) {
            case 'register':
                setImmediate(() => {
                    setLogin(true)
                    setReg(false)
                })
                break;
            case 'login':
                setImmediate(() => {
                    setReg(true)
                    setLogin(false)
                })
                break;
        }
    }


    return (
        <View style={styles.mainContainer}>

            {/** selector Button */}
            <View style={styles.selector_btn_cont}>

                {/** Login Button */}
                <TouchableOpacity
                    onPress={() => selectAuth("register")}
                    activeOpacity={0.6}
                    style={[styles.selector_btn_selected_cont, {
                        backgroundColor: login == true ? "white" : "transparent"
                    }]}
                >
                    <Text style={[styles.btn_text, {
                        color: login == true ? "black" : "white"
                    }]}>Login</Text>
                </TouchableOpacity>

                {/** Register Button */}
                <TouchableOpacity
                    onPress={() => selectAuth("login")}
                    activeOpacity={0.6}
                    style={[styles.selector_btn_selected_cont, {
                        backgroundColor: reg == true ? "white" : "transparent"
                    }]}
                >
                    <Text style={[styles.btn_text, {
                        color: reg == true ? "black" : "white"
                    }]}>Register</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>

                {login && <Login props={props} />}

                {reg && <Register props={props} />}


            </ScrollView>
        </View>
    )
}

export default AuthSelector

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        zIndex: 150,
        marginVertical: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    selector_btn_cont: {
        width: width - 120,
        height: 40,
        backgroundColor: "#020621",
        borderRadius: 20,
        justifyContent: "center",
        padding: 5,
        flexDirection: "row"
    },
    selector_btn_selected_cont: {
        width: "50%",
        height: 30,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },
    btn_text: {
        fontSize: 16,
        fontWeight: "600"
    },
})