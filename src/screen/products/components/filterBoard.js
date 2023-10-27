import { Text, StyleSheet, Image, View, Dimensions, NativeModules, ScrollView, TouchableOpacity } from 'react-native'
import React, { } from 'react'

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../../redux/actions/user"
import { bindActionCreators } from 'redux';
import PositiveY from '../../../animations/LinearY';
import LinearX from '../../../animations/LinearX';


const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

const FilterBoard = ({ onDismiss }) => {
    return (
        <TouchableOpacity
            onPress={onDismiss}
            style={styles.mainContainer}>
            <LinearX>

                <View style={styles.inner_main}>

                </View>
            </LinearX>


            <Text>filterBoard</Text>
        </TouchableOpacity>
    )
}

export default FilterBoard

const styles = StyleSheet.create({
    mainContainer: {
        width: width,
        height: height,
        alignItems: "flex-start",
        backgroundColor: "rgba(52,52,52,0.05)",
        position: "absolute",
        zIndex: 400
    },
    inner_main: {
        width: width / 2.1,
        height: "100%",
        backgroundColor: "white"
    }
})