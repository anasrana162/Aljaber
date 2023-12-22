import { Text, StyleSheet, View, ActivityIndicator, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
const width = Dimensions.get("screen").width
import { encode as base64encode } from 'base-64'
import axios from 'axios'
import { custom_api_url, basis_auth } from '../../../api/api'

const Review = ({ productName, nickName, productId, customerId }) => {

    const [nick_name, setnick_name] = useState(nickName)
    const [nick_name_err, setnick_name_err] = useState(false)
    const [summary, setsummary] = useState("")
    const [summary_err, setsummary_err] = useState(false)
    const [review, setreview] = useState("")
    const [review_err, setreview_err] = useState(false)
    const [loader, setloader] = useState(false)

    // console.log("productId in review.js", productId)
    // console.log("customerId in review.js", customerId)

    const onSubmit = () => {
        setloader(true)

        if (nickName == "") {
            setloader(false)
            setnick_name_err(true)
        }
        if (summary == "") {
            setloader(false)
            setsummary_err(true)
        }
        if (review == "") {
            setloader(false)
            setreview_err(true)
        }
        const base64Credentials = base64encode(`${basis_auth.Username}:${basis_auth.Password}`);
        // console.log("BTAO", base64Credentials)
        if (nick_name_err == false && summary_err == false && review_err == false) {
            // console.log("adminToken", customerToken)
            axios.post(custom_api_url + "func=post_review",

                {
                    "productId": productId,
                    "customerId": customerId,
                    "customerNickName": nickName,
                    "reviewTitle": summary,
                    "reviewDetail": review
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${base64Credentials}`,
                },
            }
            )
                .then((res) => {
                    console.log("res review Post API", res?.data)
                    alert("Success")
                    setloader(false)
                })
                .catch((err) => {
                    console.log("Err Review Post Api", err)
                    alert("Error! Try again Later")
                    setloader(false)
                })

        } else {
            return
        }

    }

    const onChangeText = (txt, key) => {
        switch (key) {
            case "nick_name":
                setnick_name(txt)
                break;
            case "summary":
                setsummary(txt)
                break;
            case "review":
                setreview(txt)
                break;
        }
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>YOUR REVIEWING</Text>
            <Text style={[styles.title, { fontSize: 15, marginTop: 10, marginBottom: 0 }]}>{productName?.toUpperCase()}</Text>

            <Text style={[styles.textInp_title, { color: nick_name_err ? "red" : "#233468" }]}>NICKNAME*</Text>
            <TextInput
                value={nick_name}
                style={styles.txtInp}
                onChangeText={(txt) => onChangeText(txt, "nick_name")}
            />

            <Text style={[styles.textInp_title, { color: summary_err ? "red" : "#233468" }]}>SUMMARY*</Text>
            <TextInput
                value={summary}
                style={styles.txtInp}
                onChangeText={(txt) => onChangeText(txt, "summary")}
            />

            <Text style={[styles.textInp_title, { color: review_err ? "red" : "#233468" }]}>REVIEW*</Text>
            <TextInput
                value={review}
                style={styles.txtInp}
                onChangeText={(txt) => onChangeText(txt, "review")}
            />

            {/* Submit button */}

            <TouchableOpacity
                onPress={() => onSubmit()}
                style={styles.submit_btn}>
                {loader == true ?
                    <ActivityIndicator size={"small"} color="#020621" />
                    :
                    <Text style={styles.submit_btn_txt}>SUBMIT</Text>
                }
            </TouchableOpacity>


        </View>
    )
}

export default Review

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#233468",
        marginTop: 40
    },
    textInp_title: {
        fontSize: 12,
        fontWeight: "500",
        color: "#233468",
        marginTop: 20,
        marginBottom: 10,
    },
    txtInp: {
        width: "95%",
        height: 40,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#020621",
        paddingLeft: 10,
        color: "black",
        fontSize: 14,
        fontWeight: "400"
    },

    submit_btn: {
        width: 100,
        height: 40,
        backgroundColor: "#233468",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        borderRadius: 5
    },

    submit_btn_txt: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
    }
})