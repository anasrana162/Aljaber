import { Text, StyleSheet, Image, View, Dimensions, Modal, NativeModules, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
const width = Dimensions.get("screen").width

const CustomerServices = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.inner_mainContainer}>

                {/* Title */}
                <Text style={styles.title}>Customer Services</Text>

                {/* Menu Footer */}
                <View style={styles.row_container}>

                    {/* My Account */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { }}
                    >
                        <Text style={[styles.title, { fontSize: 14, paddingVertical: 10, marginRight: 25 }]}>My Account</Text>
                    </TouchableOpacity>

                    {/* My Orders */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { }}
                    >
                        <Text style={[styles.title, { fontSize: 14, paddingVertical: 10, marginRight: 25 }]}>My Orders</Text>
                    </TouchableOpacity>

                    {/* My WishList */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { }}
                    >
                        <Text style={[styles.title, { fontSize: 14, paddingVertical: 10, marginRight: 25 }]}>My WishList</Text>
                    </TouchableOpacity>

                    {/* AddressBook */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { }}
                    >
                        <Text style={[styles.title, { fontSize: 14, paddingVertical: 10, marginRight: 25 }]}>AddressBook</Text>
                    </TouchableOpacity>

                    {/* Account Information */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { }}
                    >
                        <Text style={[styles.title, { fontSize: 14, paddingVertical: 10, marginRight: 25 }]}>Account Information</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </View>
    )
}

export default CustomerServices;

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        backgroundColor: "#e6ecff",
        justifyContent: "center",
        alignItems: "center",

    },
    inner_mainContainer: {
        width: "90%",
        // height: "100%",
        marginTop: 30,
        backgroundColor: "#e6ecff",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginBottom: 100
    },
    row_container: {
        width: "100%",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: "#020621"
    },
})