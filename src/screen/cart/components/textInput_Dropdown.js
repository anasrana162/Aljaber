import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign';
import Dropdown from './dropdown';

const TextInput_Dropdown = ({ type, titleEN, titleAR, isModalOpen, purpose, openDropDown, defaultSelected, dataDropdown, selectItem, }) => {

    const [countrySelected, setCountrySelected] = useState(defaultSelected)
    const [provinceSelected, setProvinceSelected] = useState(defaultSelected)
    const [modalDropDown, setModalDropDown] = useState(false)


    const selectValue = (val) => {
        switch (purpose) {
            case 'country':
                console.log("Inner selected", val)
                setCountrySelected(val?.country)
                selectItem(val)
                break;
            case 'province':
                console.log("Inner selected", val)
                setProvinceSelected(val?.title)
                selectItem(val)
                break;
        }
    }
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>{titleEN}</Text>
            <View style={styles.boxContainer}>
                {type == 'txtinp' &&
                    <TextInput
                        value={provinceSelected}
                        onChangeText={(txt) => setProvinceSelected(txt)}
                        style={{
                            width: "100%",
                            height: "100%",
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#131313",
                            paddingLeft: 10
                        }}
                    />
                }
                {type == 'dropdown' &&
                    <TouchableOpacity
                        onPress={() => {
                            openDropDown()
                            setModalDropDown(!modalDropDown)
                        }}
                        style={styles.touchable}>
                        {/* {console.log("countrySelected", countrySelected)} */}
                        {purpose == "country" && <Text style={styles.dropdown_text}>{countrySelected == "" ? "Select" : countrySelected}</Text>}
                        {purpose == "province" && <Text style={styles.dropdown_text}>{provinceSelected == "" ? "Select" : provinceSelected}</Text>}
                        {isModalOpen ?
                            <AntDesign name="down" size={18} color="black" />
                            :
                            <AntDesign name="right" size={18} color="black" />}
                    </TouchableOpacity>

                }
            </View>
            {modalDropDown &&
                <Dropdown
                    purpose={purpose}
                    dataDropdown={dataDropdown}
                    selectItem={(val) => {
                        selectValue(val)
                        // 
                    }}
                />
            }

        </View>
    )
}

export default TextInput_Dropdown

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    boxContainer: {
        width: "100%",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#313131"
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
    dropdown_text: {
        fontSize: 16,
        fontWeight: "700",
        color: "#313131"
    }
})