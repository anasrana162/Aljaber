import { Text, StyleSheet, View, Dimensions, ScrollView, TextInput, TouchableOpacity, Platform, Image, LogBox, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import AuthTxtInp from '../../../components_reusable/authTxtInp'
import FooterIcons from './footerIcons'
import api from '../../../api/api'
{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../../redux/actions/user"
import { bindActionCreators } from 'redux';
const width = Dimensions.get("screen").width

 class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailFlag: false,
            passwordFlag: false,
            password: '',
            secureTextEntry: false,
            loader: false,
            token: ''
        };
    }

    onChangeText = (txt, key) => {
        switch (key) {
            case "email":
                setImmediate(() => {
                    this.setState({
                        email: txt
                    })
                    this.checkValidations(txt, key)
                })
                break;

            case "password":
                setImmediate(() => {
                    this.setState({
                        password: txt
                    })
                    this.checkValidations(txt, key)
                })
                break;
        }
    }

    checkValidations = (txt, key) => {
        switch (key) {
            case "email":
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(txt) == true ?
                    setImmediate(() => {
                        this.setState({
                            emailFlag: false
                        })
                    })
                    :
                    setImmediate(() => {
                        this.setState({
                            emailFlag: true
                        })
                    })
                break;

            case "password":
                /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(txt) == true ?
                    setImmediate(() => {
                        this.setState({
                            passwordFlag: false
                        })
                    })
                    :
                    setImmediate(() => {
                        this.setState({
                            passwordFlag: false
                        })
                    })
                break;
        }
    }


    loginFunction = () => {
        var { email, emailFlag, password, passwordFlag, } = this.state
        var { props,actions } = this.props
      
        // set loader to true to show loader
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })
       
        //checiking if validation flags for error are false ?
        console.log("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(txt)", /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        console.log("emailFlag", email)
        if (emailFlag == false && passwordFlag == false) {
            // api.post()
            api.post('integration/customer/token', {
                username: email.toLowerCase(),
                password: password,
            }).then((res) => {
                console.log(res?.data)
                if (res?.data) {
                    //alert("Login Successful!")
                    // this.props.modal()


                    api.get('customers/me', {
                        headers: {
                            Authorization: `Bearer ${res?.data}`,
                        },
                    }).then((res) => {
                        console.log("User Data:", res?.data)
                        actions.userToken(res?.data)
                        setImmediate(() => {
                            this.setState({
                                loader: false,
                            })
                        })
                        props.navigation.navigate("HomeScreen")
                        
                    }).catch((err) => {
                        alert("Network Error Code: (cd1)")
                        console.log("customer sata Api error: ", err)
                        setImmediate(() => {
                            this.setState({
                                loader: false
                            })
                        })
                    })
                }
            }).catch((err) => {
                alert("Network Error Code: (APL1)")
                console.log("Login Api error: ", err)
                setImmediate(() => {
                    this.setState({
                        loader: false
                    })
                })
            })
        } else {
            emailFlag == true && alert("Enter Correct Email")
            passwordFlag == true && alert("Enter correct password")
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
        }
    }

    changeIcon = () => {
        setImmediate(() => {
            this.setState({
                secureTextEntry: !this.state.secureTextEntry
            })
        })
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {/** Email */}
                <AuthTxtInp
                    value={this.state.email}
                    placeHolderTextAR={""}
                    placeHolderTextEN={"Email"}
                    placeholderTextColor={"#c7cdf0"}
                    onChangeText={(txt) => this.onChangeText(txt.toLowerCase(), 'email')}
                // keyboardType={}
                />
                {/** password */}
                <AuthTxtInp
                    value={this.state.password}
                    placeHolderTextAR={""}
                    placeHolderTextEN={"Password"}
                    placeholderTextColor={"#c7cdf0"} onChangeText={(txt) => this.onChangeText(txt, 'password')}
                    icon={this.state.secureTextEntry == true ? require('../../../../assets/eyepasswordon.png') : require('../../../../assets/eyepassword.png')}
                    secureTextEntry={this.state.secureTextEntry}
                    changeIcon={() => this.changeIcon()}
                // keyboardType={}
                />

                {/** forgot pasword button */}
                <TouchableOpacity
                    //onPress={() => this.goHome()}
                    style={{ alignSelf: "flex-start", marginLeft: 35 }}>
                    <Text style={styles.forgot_password}>Forgot password?</Text>
                </TouchableOpacity>

                {/**Login button */}
                <TouchableOpacity
                    disabled={this.state.loader}
                    onPress={() => this.loginFunction()}
                    style={styles.login_btn_cont}>
                    <>
                        {this.state.loader == true ? <ActivityIndicator size={"small"} color="white" />
                            :
                            <Text style={styles.btn_text}>Login</Text>
                        }
                    </>

                </TouchableOpacity>


                {/** Footer Icons  */}
                <FooterIcons />


            </View >
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        width: width - 20,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 20
    },
    forgot_password: {
        color: "#3F51B5",
        fontSize: 14,
    },
    login_btn_cont: {
        width: width - 120,
        height: 40,
        backgroundColor: "#020621",
        borderRadius: 20,
        justifyContent: "center",
        marginTop: 30,
        alignItems: "center",
    },

    btn_text: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
    },

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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Login);