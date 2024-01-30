import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
const ContactInfo = ({ props }) => {
    // console.log(props, "contact comp")
    return (
        <View style={styles.mainCont} >

            <View style={styles.imageCont}>

                <Image
                    source={require("../../../../assets/aljabirlogo.png")}
                    style={{ width: "100%", height: "100%", }}
                />
            </View>
               
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>

                <Text style={styles.txt}>{props?.firstname} {props?.lastname}</Text>
                <TouchableOpacity style={styles.editBtn}>
                    <FontAwesome5 name="pencil-alt" size={18} color="black" />
                </TouchableOpacity>

            </View>
            <Text style={styles.txt}>{props?.email}</Text>
        </View>
    )
}

export default ContactInfo

const styles = StyleSheet.create({
    mainCont: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        alignSelf:"center"
    },
    imageCont: {
        width: 140,
        height: 140,
        padding: 10,
        marginTop: 30,
        borderRadius: 120,
        borderWidth: 1
    },
    txt: {
        fontSize: 14,
        fontWeight: "600",
        color: "#020621",
        // marginTop: 3
    },
    editBtn: {
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight:-45,
        marginLeft:10
    },

})