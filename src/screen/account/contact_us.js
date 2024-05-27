import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from '../home/components/homeHeader';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Drawer from '../../components_reusable/drawer';

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';

export class Contact_us extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: "",
            phone: "",
            message: "",
            loader: false,
            drawer: false,
        };
    }

    onChangeText = (key, txt) => {
        switch (key) {
            case "name":
                setImmediate(() => {
                    this.setState({ name: txt })
                })
                break;
            case "email":
                setImmediate(() => {
                    this.setState({ email: txt })
                })
                break;
            case "phone":
                setImmediate(() => {
                    this.setState({ phone: txt })
                })
                break;
            case "message":
                setImmediate(() => {
                    this.setState({ message: txt })
                })
                break;
        }
    }

    onSubmit = () => {
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })

        if (this.state.name.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return alert("Please Enter Your Name!")
        }
        if (this.state.email.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return alert("Please Enter Your Email!")
        }
        if (this.state.phone.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return alert("Please Enter Your Phone Number!")
        }
        if (this.state.message.length == 0) {
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
            return alert("Please Enter Your Message!")
        }


        setTimeout(() => {
            this.setState({
                loader: false
            })
            this.props.navigation.pop()
        }, 2000)
    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }

    render() {

        const Tiles = ({ text1, text2, text3, iconName, style }) => {
            return (
                <View style={[styles.tile_cont, style]}>

                    <View style={styles.icon_cont}>
                        <FontAwesome5 name={iconName} size={24} color="white" />
                    </View>

                    <View style={styles.tile_text_cont}>
                        {text1 !== undefined && <Text style={styles.para}>{text1}</Text>}
                        {text2 !== undefined && <Text style={styles.para}>{text2}</Text>}
                        {text3 !== undefined && <Text style={styles.para}>{text3}</Text>}
                    </View>

                </View>
            )
        }

        return (
            <View style={styles.mainContainer}>

                <HomeHeader
                    navProps={this.props.navigation}
                    openDrawer={() => this.openDrawer()}
                />

                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />

                <ScrollView style={{ width: "100%" }}>



                    {/* Title */}
                    <Text style={[styles.title, { marginTop: 60 }]}>Send us a  <Text style={[styles.title, { color: "#222529" }]}>message</Text></Text>

                    {/* Name Textinp */}

                    <Text style={styles.textinp_title}>Name *</Text>

                    <TextInput
                        style={styles.textinp_cont}
                        onChangeText={(txt) => this.onChangeText("name", txt)}
                    />

                    {/* Email Textinp */}

                    <Text style={styles.textinp_title}>Email *</Text>

                    <TextInput
                        style={styles.textinp_cont}
                        onChangeText={(txt) => this.onChangeText("email", txt)}
                    />

                    {/* Phone Textinp */}

                    <Text style={styles.textinp_title}>Phone Number *</Text>

                    <TextInput
                        style={styles.textinp_cont}
                        keyboardType='number-pad'
                        onChangeText={(txt) => this.onChangeText("phone", txt)}
                    />

                    {/* Message Textinp */}

                    <Text style={styles.textinp_title}>Message *</Text>

                    <TextInput
                        style={[styles.textinp_cont, { height: 120 }]}
                        multiline={true}
                        onChangeText={(txt) => this.onChangeText("message", txt)}
                    />

                    {/* Submit Button */}

                    <TouchableOpacity
                        onPress={() => this.onSubmit()}
                        style={styles.touchable}>
                        {
                            this.state.loader == false ?
                                <Text style={styles.submit_btn}>SUBMIT</Text>
                                :
                                <ActivityIndicator size={'small'} color="white" />
                        }
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={[styles.title, { marginTop: 60 }]}>Contact  <Text style={[styles.title, { color: "#222529" }]}>Details</Text></Text>

                    <Tiles
                        iconName={"directions"}
                        text1={"Al Jaber Optical"}
                        text2={"DUBAI, UAE"}
                    />
                    <Tiles
                        iconName={"mobile-alt"}
                        text1={"Telephone: +97145220000"}
                        text2={"English: +971556002013"}
                        text3={"Arabic: +971556002116"}
                    />
                    <Tiles
                        style={{ marginBottom: 40 }}
                        iconName={"mobile-alt"}
                        text1={"ajoptic@aljaber.ae"}
                    />


                </ScrollView>
            </View>
        )


    }
}



{/* {---------------redux State ------------} */ }
const mapStateToProps = state => ({
    userData: state.userData
});

{/* {---------------redux Actions ------------} */ }

const ActionCreators = Object.assign(
    {},
    userActions,
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contact_us);
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },

    tile_cont: {
        width: "90%",
        alignSelf: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    tile_text_cont: {
        width: 200,
        height: 50,
        marginLeft: 20,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start"
    },

    icon_cont: {
        width: 50,
        height: 50,
        backgroundColor: "#233468",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },

    title: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 22,
        fontWeight: "600",
        color: "#848484",
        alignSelf: "flex-start"
    },
    textinp_title: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 16,
        fontWeight: "600",
        color: "#777",
        alignSelf: "flex-start"
    },
    submit_btn: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
    },
    textinp_cont: {
        width: "90%",
        height: 40,
        alignSelf: "center",
        borderWidth: 0.5,
        borderColor: "#777",
        borderRadius: 5,
        marginTop: 5,
        padding: 10
    },
    para: {
        fontSize: 14,
        fontWeight: "400",
        color: "black",
    },
    touchable: {
        width: 120,
        height: 40,
        backgroundColor: "#233468",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        alignSelf: "center",
    }

})