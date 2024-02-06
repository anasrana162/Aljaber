import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Platform, Image, Modal, Pressable, ScrollView } from 'react-native'
import React, { Component } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderComp from '../../components_reusable/headerComp';
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import CustomTextInp from '../checkout/components/CustomTextInp';

class ChangeUserData extends Component {

    constructor(props) {
        super(props);
        var { userData: { user } } = this.props
        this.state = {
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            currentpassword: "",
            newpassword: "",
            confirmpassword: "",
            check_email: false,
            check_password: false,
        };
    }

    onChangeText = (txt, key) => {
        switch (key) {
            case "firstname":
                this.setState({
                    firstname: txt
                })
                break;
            case "lastname":
                this.setState({
                    lastname: txt
                })
                break;
            case "email":
                this.setState({
                    email: txt
                })
                break;
            case "confirmpassword":
                this.setState({
                    confirmpassword: txt
                })
                break;
            case "currentpassword":
                this.setState({
                    currentpassword: txt
                })
                break;
            case "newpassword":
                this.setState({
                    newpassword: txt
                })
                break;
        }
    }

    onPress = (key) => {
        switch (key) {
            case "check_email":
                this.setState({
                    check_email: !this.state.check_email,
                    check_password: false,
                })
                break;
            case "check_password":
                this.setState({
                    check_password: !this.state.check_password,
                    check_email: false
                })
                break;
        }
    }

    onSave = async () => {
        var { userData: { user }, actions } = this.props
        var { check_email, check_password, firstname, lastname, email, newpassword, confirmpassword, currentpassword } = this.state
        var obj = {}
        // if (user?.lastname == lastname &&
        //     user?.firstname == firstname &&
        //     newpassword == "" &&
        //     confirmpassword == ""
        // ) {
        //     return
        // }

        console.log("check", lastname, "  ", firstname);

        // if user hasn't checked email box and changed only first or last name
        if (check_email == false &&
            (lastname !== user?.lastname || lastname == "") ||
            (firstname !== user?.firstname || firstname == "")

        ) {
            obj = {
                customer: {

                    firstname: firstname,
                    lastname: lastname
                }
            }
            var result = await this.updateProfile(obj)
            actions.user(result)
            console.log("Result", result);

        }

        if (check_email == true &&
            email !== user?.email
        ) {
            obj = {
                customer: {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                }
            }
            var result = await this.updateProfile(obj)
            actions.user(result)
            console.log("Result", result);

        }

        if (check_password == true && email == user?.email) {
            // if user changes lastname or firstname
            if ((lastname !== user?.lastname || lastname == "") ||
                (firstname !== user?.firstname || firstname == "")) {
                obj = {
                    customer: {

                        firstname: firstname,
                        lastname: lastname
                    }
                }
                var resultProfile = await this.updateProfile(obj)
                actions.user(resultProfile)
                console.log("Result", resultProfile);
            }

            var fetchToken = await this.passwordResetToken()
            alert("Reset Password Link sent to your email Address")
            console.log("fetchToken", fetchToken);

        }
        if (check_password == true && email !== user?.email) {
            alert("Enter Correct Email")
        }


    }

    passwordResetToken = async () => {

        var fetchData = await api.put('customers/password', {
            "email": this.state.email,
            "template": "email_reset"
        }).then((res) => {
            console.log("password reset Token Api Result", res?.data);
            return res?.data
        }).catch((err) => {
            console.log("Password reset Token Api Result ", err?.response?.data?.message);
            // return await undefined;
        });
        return fetchData

    }

    updateProfile = async (obj) => {
        var { userData: { user, admintoken, token } } = this.props;
        console.log("admintoken", admintoken);
        console.log("obj in updateprofile func", obj);
        console.log("user?.id in updateprofile func", user?.id);

        var fetchData = await api.put(`customers/${user?.id}`, obj, {
            headers: {
                Authorization: `Bearer ${admintoken}`,
            },
        })
            .then((res) => {
                console.log("Profile update api Success", res?.data);
                return res?.data;
            })
            .catch((err) => {
                console.log("Profile update api Error: ", err?.response?.data?.message);
                // return await undefined;
            });

        return fetchData
    };

    render() {
        return (
            <View style={styles.mainContainer}>

                <HeaderComp titleEN={"Edit Account Information"} navProps={this.props.navigation} />

                <ScrollView>
                    <View style={styles.subMainCont}>

                        {/* Sub Heading */}
                        <Text style={[styles.subHeading, { marginTop: 30, }]}>Account Information</Text>

                        {/* First Name */}
                        <CustomTextInp
                            value={this.state.firstname}
                            titleEN={" First Name*"}
                            onChangeText={(txt) => this.onChangeText(txt, "firstname")}
                            style={{ width: width - 180, alignSelf: "flex-start", marginTop: 20 }}
                        />

                        {/* Last Name */}
                        <CustomTextInp
                            value={this.state.lastname}
                            titleEN={" Last Name*"}
                            onChangeText={(txt) => this.onChangeText(txt, "lastname")}
                            style={{ width: width - 180, alignSelf: "flex-start" }}
                        />

                        {/* CheckBoxes */}

                        {/* Email */}
                        <TouchableOpacity
                            onPress={() => this.onPress("check_email")}
                            style={styles.checkBoxCont}>
                            {this.state.check_email ?
                                <AntDesign name="checkcircle" size={20} color="black" />
                                :
                                <Entypo name="circle" size={20} color="black" />

                            }
                            <Text style={styles.check_text}>Change Email</Text>
                        </TouchableOpacity>

                        {/* Password */}
                        <TouchableOpacity
                            onPress={() => this.onPress("check_password")}
                            style={[styles.checkBoxCont, { marginTop: 10 }]}>
                            {this.state.check_password ?
                                <AntDesign name="checkcircle" size={20} color="black" />
                                :
                                <Entypo name="circle" size={20} color="black" />

                            }
                            <Text style={styles.check_text}>Change Password</Text>
                        </TouchableOpacity>

                        {this.state.check_email &&
                            <>
                                <CustomTextInp
                                    value={this.state.email}
                                    titleEN={"Email*"}
                                    onChangeText={(txt) => this.onChangeText(txt, "email")}
                                    style={{ width: width - 100, alignSelf: "flex-start", marginTop: 20 }}
                                />
                                {/* <CustomTextInp
                                    // value={this.state.lastname}
                                    titleEN={"Current Password*"}
                                    onChangeText={(txt) => this.onChangeText(txt, "currentpassword")}
                                    style={{ width: width - 100, alignSelf: "flex-start" }}
                                /> */}
                            </>
                        }

                        {this.state.check_password &&
                            <>
                                {/* Sub Heading */}
                                <Text style={[styles.subHeading, { marginTop: 30 }]}>Change Password</Text>

                                <CustomTextInp
                                    // value={this.state.email}
                                    placeholder={"Enter email "}
                                    titleEN={"Email*"}
                                    onChangeText={(txt) => this.onChangeText(txt, "email")}
                                    style={{ width: width - 100, alignSelf: "flex-start", marginTop: 10 }}
                                />
                                {/* <CustomTextInp
                                    // value={this.state.email}
                                    titleEN={"New Password*"}
                                    onChangeText={(txt) => this.onChangeText(txt, "newpassword")}
                                    style={{ width: width - 100, alignSelf: "flex-start", marginTop: 20 }}
                                />
                                <CustomTextInp
                                    // value={this.state.lastname}
                                    titleEN={"Confirm New Password*"}
                                    onChangeText={(txt) => this.onChangeText(txt, "confirmpassword")}
                                    style={{ width: width - 100, alignSelf: "flex-start" }}
                                /> */}
                            </>
                        }

                        <TouchableOpacity
                            onPress={() => this.onSave()}
                            style={styles.saveBtn}>
                            <Text style={[styles.heading, { fontSize: 18, marginTop: 0 }]}>Save</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "#f0f0f0"
    },
    subMainCont: {
        justifyContent: "flex-start",
        alignItems: "center",
        width: width - 20,
        height: "100%",
        backgroundColor: "#f0f0f0"
    },
    heading: {
        fontSize: 20,
        color: "white",
        fontWeight: "600",
        marginTop: 10
    },
    subHeading: {
        fontSize: 18,
        color: "#020621",
        fontWeight: "600",
        alignSelf: "flex-start",
        marginTop: 10,
    },
    header_comp: {
        width: width,
        justifyContent: "center",
        backgroundColor: "#020621",
        alignItems: "center",
        paddingTop: 0,
        paddingVertical: 10
    },

    checkBoxCont: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        columnGap: 10,
        marginTop: 20,
    },
    check_text: {
        fontSize: 14,
        color: "#020621",
        fontWeight: "500",
    },
    saveBtn: {
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#08c",
        marginTop: 20
    }
})
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserData);