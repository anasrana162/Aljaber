import { Text, StyleSheet, View, Dimensions, NativeModules, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import TextInput_Dropdown from './textInput_Dropdown';

const width = Dimensions.get("screen").width

const Shipping_Tax = ({ openShipping_TaxModal, isModalOpen, props, shipping, flatrate, countries, provinces, selectItem, selectedValue }) => {

    var { userData: { user } } = props

    var addressDefault = {}
    var countryDefault = ""
    var provinceDefault = ""

    const [countryDD, setCountryDD] = useState(false)
    const [provinceDD, setProvinceDD] = useState(false)

    const openDropDowns = (key) => {
        switch (key) {
            case "country":
                setCountryDD(!countryDD)
                break;
            case "province":
                setProvinceDD(!provinceDD)
                break;
        }
    }

    console.log("UserData", user)
    if (Object.keys(user).length !== 0) {

        if (user?.addresses?.length !== 0) {
            addressDefault = user?.addresses[0]
            provinceDefault = user?.addresses[0]?.region?.region
            if (countries.length !== 0) {
                var filtered = countries.filter((val) => val?.country_id == user?.addresses[0]?.country_id)[0]
                // console.log("Filterd", filtered)
                countryDefault = filtered?.country
            }
        }
    }

    // console.log("addressDefault", addressDefault)


    return (
        <View>
            <View style={[styles.line, { marginTop: 10, marginBottom: 5 }]} />

            <View style={styles.mainContainer}>

                <TouchableOpacity
                    onPress={openShipping_TaxModal}
                    style={styles.touchable}>
                    <Text style={styles.ship_tax_text}>Estimate Shipping and Tax</Text>
                    {isModalOpen ?
                        <AntDesign name="down" size={18} color="black" />
                        :
                        <AntDesign name="right" size={18} color="black" />}
                </TouchableOpacity>

                {isModalOpen &&
                    <View style={styles.modal_mainContainer}>
                        {/* Country */}
                        <TextInput_Dropdown
                            dataDropdown={countries}
                            titleEN={"Country"}
                            titleAR={""}
                            type={"dropdown"}
                            defaultSelected={Object.keys(addressDefault).length == 0 ? "" : countryDefault}
                            purpose={"country"}
                            isModalOpen={countryDD}
                            openDropDown={() => openDropDowns("country")}
                            selectItem={(val) => selectItem(val, "country")}
                        />

                        {/* Province */}
                        <TextInput_Dropdown
                            dataDropdown={provinces}
                            titleEN={"State/Province"}
                            titleAR={""}
                            purpose={"province"}
                            type={provinces?.length == 0 ? "txtinp" : "dropdown"}
                            defaultSelected={Object.keys(addressDefault).length == 0 ? "" : provinceDefault}
                            isModalOpen={provinceDD}
                            openDropDown={() => openDropDowns("province")}
                            selectItem={(val) => selectItem(val, "province")}
                        />

                        <View style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}>
                            {shipping == "" ?
                                <>
                                    <Text style={styles.ship_tax_text}>FlatRate</Text>
                                    <View style={styles.small_container}>
                                        <AntDesign name="checkcircle" size={24} color="black" />
                                        <Text style={styles.ship_tax_text}>   AED {flatrate}</Text>
                                    </View>
                                </>
                                :
                                <>
                                    <Text style={styles.ship_tax_text}> Free Shipping</Text>
                                    <View style={styles.small_container}>
                                        <Entypo name="circle" size={24} color="black" />
                                        <Text style={styles.ship_tax_text}>   AED {flatrate}</Text>
                                    </View>
                                </>
                            }



                        </View>


                    </View>
                }

            </View>

            <View style={[styles.line, { marginTop: 5 }]} />
        </View>
    )
}

export default Shipping_Tax

const styles = StyleSheet.create({
    mainContainer: {
        width: width - 30,
        justifyContent: "center",
        alignItems: "flex-start",
        alignSelf: "center",
    },
    modal_mainContainer: {
        width: "95%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    small_container: {
        width: "95%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10
    },
    line: {
        width: width - 30,
        alignSelf: "center",
        height: 1.5,
        backgroundColor: "#bbb",
    },
    touchable: {
        width: "95%",
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor:"red",
        alignSelf: "center"
    },
    ship_tax_text: {
        fontSize: 16,
        fontWeight: "700",
        color: "#313131"
    }
})