import { Text, StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import LinearGradient from 'react-native-linear-gradient'

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

class GetStarted extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    goHome = () => {
        this.props?.navigation?.navigate("HomeScreen")
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <Image
                    style={styles.image}
                    source={require('../../../assets/glasses-2.png')}
                />

                <LinearGradient colors={['#ffffff', '#e3e3e6', '#ffffff']} style={styles.linearGradient}>
                    <Image
                        style={styles.logo}
                        source={require('../../../assets/aljabirlogo.png')}
                    />
                    <Text lineBreakMode='middle' style={styles.GetStartedText}>Let's Get Started</Text>
                    <Text style={styles.paragrapghText}>See the world in a whole new way with Eyelens - the ultimate eye glasses app that combines style, convevience and cutting-edge technology</Text>
                    <TouchableOpacity
                        onPress={() => this.goHome()}
                        style={styles.btn}>
                        <Text style={styles.btnText}>Join Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.goHome()}
                        style={{ position: "absolute", bottom: 90, zIndex: 150 }}>
                        <Text style={styles.already_have_account}>Already have an account? Login</Text>
                    </TouchableOpacity>

                </LinearGradient>
            </View>
        )
    }
}
export default GetStarted;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: width,
        height: height
    },
    image: {
        width: 330,
        height: 150,
       // marginTop: 60,
       marginBottom:60,
        marginLeft: 20
    },
    logo: {
        width: 250,
        height: 200,
        position: "absolute",
        zIndex: 150,
        top: 80
    },
    linearGradient: {
        width: width,
        height: height,
        position: "absolute",
        zIndex: 100,
        opacity: 0.95,
        justifyContent: "center",
        alignItems: "center"
    },
    GetStartedText: {
        color: "#233468",
        fontSize: 34,
        fontWeight: "bold",
        marginTop: 130,
        alignSelf: "flex-start",
        marginLeft: 50,
        width: 160
    },
    paragrapghText: {
        fontSize: 16,
        color: "#233468",
        fontWeight: "500",
        width: width - 80,
        marginLeft: 20,
        marginTop: 10
        // alignSelf:"center"
    },
    btn: {
        width: width - 100,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#233468",
        borderRadius: 30,
        position: "absolute",
        bottom: 120,
        zIndex: 150
    },
    btnText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    already_have_account: {
        fontSize: 16,
        color: "#233468",
        fontWeight: "500",
    }
})