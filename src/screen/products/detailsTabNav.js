import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
const width = Dimensions.get("screen").width
import RenderHtml from 'react-native-render-html';
import Review from './components/review';
import Main_Info from './components/main_info';
const DetailsTabNav = ({ navProps, details_tab, productName, nickName, productId, customerId, main_infor }) => {

    const [details, setDetails] = useState(false)
    const [main_info, setMain_info] = useState(true)
    const [review, setReview] = useState(false)

    const TabPress = (key) => {
        switch (key) {
            case 'details':
                setDetails(!details)
                setMain_info(false)
                setReview(false)
                break;

            case 'main_info':
                setMain_info(!main_info)
                setReview(false)
                setDetails(false)
                break;

            case 'review':
                setReview(!review)
                setDetails(false)
                setMain_info(false)
                break;
        }
    }


    const tagsStyles = {
        body: {
            color: "black",
            alignItems: "center",
            width: "90%",
            fontFamily: "Careem-Bold",
        },
        a: {
            color: "green",
        },
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.tabCont}>

                {details_tab !== '' && <TouchableOpacity
                    onPress={() => TabPress("details")}
                    style={[styles.btn, { width: "30%" }]}>
                    <Text style={styles.btnText}>Details</Text>
                    {details && <View style={styles.btnLine}></View>}
                </TouchableOpacity>}

                {main_infor !== null &&
                    <TouchableOpacity
                        onPress={() => TabPress("main_info")}
                        style={[styles.btn, { width: "40%" }]}>
                        <Text style={styles.btnText}>More Information</Text>
                        {main_info && <View style={styles.btnLine}></View>}
                    </TouchableOpacity>}

                <TouchableOpacity
                    onPress={() => TabPress("review")}
                    style={[styles.btn, { width: "30%" }]}>
                    <Text style={styles.btnText}>Review</Text>
                    {review && <View style={styles.btnLine}></View>}
                </TouchableOpacity>

                <View style={styles.line}></View>

            </View>

            {details && <View style={styles.details_cont}>
                {details_tab !== '' &&
                    <RenderHtml
                        tagsStyles={tagsStyles}
                        contentWidth={width}
                        source={{
                            html: `${details_tab}`,
                        }}
                    />}
            </View>}

            {review && <Review
                productName={productName}
                nickName={nickName}
                productId={productId}
                customerId={customerId}
            />}

            {main_info && <Main_Info data={main_infor == null ? [] : main_infor} />}

        </View>
    )
}

export default DetailsTabNav

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 100,
        marginTop: 20,
    },
    tabCont: {
        width: "100%",
        alignSelf: "center",
        height: 50,
        //  backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

    },
    line: {
        width: "100%",
        height: 2,
        backgroundColor: "#ddd",
        position: "absolute",
        left: 0,
        bottom: 5,
        zIndex: 100,
    },
    btn: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor: "green",
    },
    btnLine: {
        width: "100%",
        height: 4,
        backgroundColor: "#020621",
        bottom: 5,
        zIndex: 140,
        borderRadius: 10,
        position: "absolute"

    },
    details_cont: {
        width: "95%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    btnText: {
        fontWeight: "700",
        fontSize: 16,
        color: "#020621",
    }
})