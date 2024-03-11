import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native'
import React, { useState } from 'react'
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

import Entypo from "react-native-vector-icons/Entypo"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import CustomTextInp from './CustomTextInp'
import TextInput_Dropdown from '../../cart/components/textInput_Dropdown'

const Add_NewAddress = ({
    openModal,
    closeModal,
    onChangeText,
    addressToEdit,
    countries,
    check,
    onPressCheck,
    provinces,
    selectItem,
    props,
    addNewAddress,
    editAddress,
    saveAddress,
    // data
    firstName,
    lastName,
    street1,
    street2,
    city,
    region,
    country,
    telephone,
    zipCode,
}) => {

    var { userData: { user } } = props

    var addressDefault = {}
    var countryDefault = ""
    var provinceDefault = ""

    const [countryDD, setCountryDD] = useState(false)
    const [provinceDD, setProvinceDD] = useState(false)

    // const [firstName, setFirstName] = useState(addressToEdit?.firstName == undefined ? "" : addressToEdit?.firstName)
    // const [lastName, setLastName] = useState(addressToEdit?.lastName == undefined ? "" : addressToEdit?.lastName)
    // const [street1, setStreet1] = useState(addressToEdit?.street == undefined ? "" : addressToEdit?.street[0])
    // const [street2, setStreet2] = useState(addressToEdit?.street == undefined ? "" : addressToEdit?.street[1])
    // const [country, setCountry] = useState(addressToEdit?.country == undefined ? "" : addressToEdit?.country?.country)
    // const [region, setRegion] = useState(addressToEdit?.region == undefined ? "" : addressToEdit?.region)
    // const [city, setCity] = useState(addressToEdit?.city == undefined ? "" : addressToEdit?.city)
    // const [zipCode, setZipCode] = useState(addressToEdit?.city == undefined ? "" : addressToEdit?.zipCode)
    // const [telephone, setTelephone] = useState(addressToEdit?.telephone == undefined ? "" : addressToEdit?.telephone)


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

    // if (Object.keys(user).length !== 0) {

    //     if (user?.addresses?.length !== 0) {
    //         addressDefault = user?.addresses[0]
    //         provinceDefault = user?.addresses[0]?.region?.region
    //         if (countries.length !== 0) {
    //             var filtered = countries.filter((val) => val?.country_id == user?.addresses[0]?.country_id)[0]
    //             // console.log("Filterd", filtered)
    //             countryDefault = filtered?.country
    //         }
    //     }
    // }
    return (
        <>
            {openModal ?
                <View style={styles.mainContainer}>
                    <View style={styles.subContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Shipping Address</Text>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={{ position: "absolute", right: 0, zIndex: 350, padding: 10, }}>
                                <Entypo name="cross" size={28} color="black" />
                            </TouchableOpacity>
                        </View>
                        {/* TextInputs */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ width: "100%" }}>
                            {/* First Name */}
                            <CustomTextInp
                                value={firstName}
                                style={{ marginTop: 30, }}
                                titleEN={"First Name *"}
                                onChangeText={(txt) => onChangeText(txt, "first_name")}
                            />
                            {/* Last Name */}
                            <CustomTextInp
                                value={lastName}
                                titleEN={"Last Name *"}
                                onChangeText={(txt) => onChangeText(txt, "last_name")}
                            />
                            {/* Street Address Title */}
                            <Text style={styles.title}>Street Address*</Text>
                            {/* Street Address Line1 */}
                            <CustomTextInp
                                value={street1}
                                titleEN={"Street Address: Line 1 *"}
                                onChangeText={(txt) => onChangeText(txt, "street_address_line1")}
                            />
                            {/* Street Address Line2 */}
                            <CustomTextInp
                                // titleEN={"Street Address: Line 1 *"}
                                value={street2}
                                style={{ marginTop: -3 }}
                                onChangeText={(txt) => onChangeText(txt, "street_address_line2")}
                            />
                            {/* Country */}
                            <TextInput_Dropdown
                                dataDropdown={countries}
                                titleEN={"Country"}
                                titleAR={""}
                                type={"dropdown"}
                                defaultSelected={country?.country}//Object.keys(addressDefault).length == 0 ? "" : countryDefault
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
                                defaultSelected={region} //Object.keys(addressDefault).length == 0 ? "" : provinceDefault
                                isModalOpen={provinceDD}
                                onChangeText={(txt) => onChangeText(txt, "region")}
                                openDropDown={() => openDropDowns("province")}
                                selectItem={(val) => selectItem(val, "province")}
                            />
                            {/* City */}
                            <CustomTextInp
                                value={city}
                                titleEN={"City *"}
                                onChangeText={(txt) => onChangeText(txt, "city")}
                            />
                            {/* ZIP/POSTAL CODE */}
                            <CustomTextInp
                                value={zipCode}
                                titleEN={"Zip / Postal Code *"}
                                onChangeText={(txt) => onChangeText(txt, "zip_code")}
                            />
                            {/* Phone Number */}
                            <CustomTextInp
                                value={telephone}
                                keyboardType={"numeric"}
                                titleEN={"Phone Number *"}
                                onChangeText={(txt) => onChangeText(txt, "phone")}
                            />
                            {/* CheckBox */}
                            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start" }}>
                                {check ?
                                    <TouchableOpacity onPress={onPressCheck}>
                                        <MaterialCommunityIcons name="checkbox-intermediate" size={24} color="black" />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={onPressCheck}>
                                        <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="black" />
                                    </TouchableOpacity>}
                                <Text style={styles.save_to_addressbook}>Save in Address Book</Text>
                            </View>


                        </ScrollView>
                        {/* Footer */}
                        <View style={styles.footer}>
                            {/* Cancel Button */}
                            <TouchableOpacity
                                onPress={closeModal}
                                style={styles.cancel_Btn}>
                                <Text style={styles.cancel_Btn_text}>Cancel</Text>
                            </TouchableOpacity>

                            {editAddress ?
                                <>
                                    {/* Save Button */}
                                    <TouchableOpacity
                                        onPress={saveAddress}
                                        style={styles.shipHere_Btn}>
                                        <Text style={styles.shipHere_Btn_text}>Save</Text>
                                    </TouchableOpacity>
                                </> :
                                <>
                                    {/* Ship Here Button */}
                                    <TouchableOpacity
                                        onPress={addNewAddress}
                                        style={styles.shipHere_Btn}>
                                        <Text style={styles.shipHere_Btn_text}>Ship Here</Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>
                    </View>
                </View>
                :
                null

            }
        </>
    )
}

export default Add_NewAddress

const styles = StyleSheet.create({
    mainContainer: {
        width: width - 40,
        height: height / 1.6,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        position: "absolute",
        top: height / 7,
        zIndex: 300,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    subContainer: {
        width: "90%",
        height: "100%",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    header: {
        width: "100%",
        height: 60,
        borderBottomWidth: 0.3,
        borderColor: "#777",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "black",
        alignSelf: "center",
    },
    footer: {
        width: "100%",
        height: 60,
        borderTopWidth: 0.3,
        borderColor: "#777",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    footer_BtnCombo: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
    },
    shipHere_Btn: {
        width: 100,
        height: 40,
        borderRadius: 5,
        backgroundColor: "#08c",
        justifyContent: "center",
        alignItems: "center",
    },
    shipHere_Btn_text: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        alignSelf: "center",
    },
    cancel_Btn: {
        width: 100,
        height: 40,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    cancel_Btn_text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#08c",
        alignSelf: "center",
    },
    title: {
        fontSize: 14,
        fontWeight: "400",
        color: "#777",
        marginTop: 10,
        marginBottom: 5,
    },
    save_to_addressbook: {
        fontSize: 14,
        fontWeight: "500",
        color: "black",
        marginLeft: 5,
    },
})