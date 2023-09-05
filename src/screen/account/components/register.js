import { Text, StyleSheet, View, Dimensions, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform, Image, LogBox } from 'react-native'
import React, { Component } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import AuthTxtInp from '../../../components_reusable/authTxtInp'
import FooterIcons from './footerIcons'
const width = Dimensions.get("screen").width
import api, { adminPassword, adminUsername } from '../../../api/api'

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            emailFlag: false,
            passwordFlag: false,
            first_nameFlag: false,
            last_nameFlag: false,
            secureTextEntry: false,
            loader: false,
        };
    }

    onChangeText = (txt, key) => {
        switch (key) {

            case "first_name":
                setImmediate(() => {
                    this.setState({
                        first_name: txt
                    })
                    this.checkValidations(txt, "first_name")
                })
                break;

            case "last_name":
                setImmediate(() => {
                    this.setState({
                        last_name: txt
                    })
                    this.checkValidations(txt, "last_name")
                })
                break;

            case "email":
                setImmediate(() => {
                    this.setState({
                        email: txt
                    })
                    this.checkValidations(txt, "email")
                })
                break;

            case "password":
                setImmediate(() => {
                    this.setState({
                        password: txt
                    })
                    this.checkValidations(txt, "password")
                })
                break;
        }
    }


    registerFunction = () => {
        var { email, emailFlag, password, passwordFlag, last_name, last_nameFlag, first_name, first_nameFlag } = this.state
        var { props } = this.props
        // set loader to true to show loader
        setImmediate(() => {
            this.setState({
                loader: true
            })
        })

        //checiking if validation flags for error are false ?
        console.log("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(txt)", /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        console.log("emailFlag", email)
        if (emailFlag == false && passwordFlag == false && last_nameFlag == false && first_nameFlag == false) {
            // api.post()
            // eyJraWQiOiIxIiwiYWxnIjoiSFMyNTYifQ.eyJ1aWQiOjEwLCJ1dHlwaWQiOjIsImlhdCI6MTY3NjYzMjQxOSwiZXhwIjoxNjc2NjM2MDE5fQ.yTPF8rMpw7cElgklrfQ4NJ26OfvBpYfalvy-WJpvfYk
          

            api.post('customers',

                {
                    "customer": {
                        "email": email,
                        "firstname": first_name,
                        "lastname": last_name,
                        "addresses": [{
                            "defaultShipping": true,
                            "defaultBilling": true,
                            "firstname": first_name,
                            "lastname": last_name,
                            "region": {
                                "regionCode": "KHI",
                                "region": "Sindh",
                                "regionId": 43
                            },
                            "postcode": "10755",
                            "street": ["123 Oak Ave"],
                            "city": "Purchase",
                            "telephone": "512-555-1111",
                            "countryId": "US"
                        }]
                    },
                    "password": password
                }).then((res) => {
                    console.log(res?.data)
                    if (res?.data) {
                        //alert("Login Successful!")
                        // this.props.modal()
                        console.log("Register success response:", res?.data)
                        setImmediate(() => {
                            this.setState({
                                loader: false,
                            })
                        })
                        props.navigation.navigate("HomeScreen")

                    }
                }).catch((err) => {
                    alert("Network Error Code: (APR1)")
                    alert(err.response?.data?.message)
                    console.log("Register Api error: ", err.response?.data?.message)
                    setImmediate(() => {
                        this.setState({
                            loader: false
                        })
                    })
                })
        } else {
            emailFlag == true && alert("Enter Correct Email")
            passwordFlag == true && alert("Enter correct password")
            last_nameFlag == true && alert("Enter correct last name")
            first_nameFlag == true && alert("Enter correct first name")
            setImmediate(() => {
                this.setState({
                    loader: false
                })
            })
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

            case "first_name":
                txt.lenght >= 2 ?
                    setImmediate(() => {
                        this.setState({
                            first_nameFlag: false
                        })
                    })
                    :
                    setImmediate(() => {
                        this.setState({
                            first_nameFlag: false
                        })
                    })
                break;
            case "last_name":
                txt.lenght >= 2 ?
                    setImmediate(() => {
                        this.setState({
                            last_nameFlag: false
                        })
                    })
                    :
                    setImmediate(() => {
                        this.setState({
                            last_nameFlag: false
                        })
                    })
                break;
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
                {/** First Name */}
                <AuthTxtInp
                    value={this.state.first_name}
                    placeHolderTextAR={""}
                    placeHolderTextEN={"First name"}
                    placeholderTextColor={"#c7cdf0"}
                    onChangeText={(txt) => this.onChangeText(txt, 'first_name')}
                // keyboardType={}
                />
                {/** Last Name */}
                <AuthTxtInp
                    value={this.state.last_name}
                    placeHolderTextAR={""}
                    placeHolderTextEN={"Last name"}
                    placeholderTextColor={"#c7cdf0"}
                    onChangeText={(txt) => this.onChangeText(txt, 'last_name')}
                // keyboardType={}
                />

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


                {/**egister button */}
                <TouchableOpacity
                    onPress={() => this.registerFunction()}
                    style={styles.login_btn_cont}>
                    <>
                        {this.state.loader == true ? <ActivityIndicator size={"small"} color="white" />
                            :
                            <Text style={styles.btn_text}>Register</Text>
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