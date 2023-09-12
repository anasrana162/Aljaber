import React, { Component } from 'react'
import RNRestart from 'react-native-restart';
{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "./src/redux/actions/user"
import { bindActionCreators } from 'redux';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeModules,
  Platform,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
const { StatusBarManager } = NativeModules;
import Navigation from './src/navigation/navigation';
import api from './src/api/api';
import NetInfo from "@react-native-community/netinfo";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      adminToken: null,
      adminTokenCounter: 0,
      network: true,
    };
  }

  unsubscribe = NetInfo.addEventListener(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
    console.log("isInternetReachable", state.isInternetReachable)
    console.log("details", state.details)
    if (state.isConnected == false || state.isInternetReachable == false) {
      setImmediate(() => {
        this.setState({
          network: false,
        })
      })
    } else {
      setImmediate(() => {
        this.setState({
          network: true,
        })
      })
    }
  });


  adminApi = async () => {

    // console.log(this.props)
    const { actions } = this.props
    var { adminTokenCounter } = this.state

    await api.post('integration/admin/token', {
      "username": "manager",
      "password": "Pakistan2023"
    }).then((res) => {
      console.log("Admin Api res: ||||| ", res?.data)
      if (res?.data) {
        setImmediate(() => {
          actions.adminToken(res?.data)
          this.setState({
            adminToken: res?.data
          })
        })
      }
    })
      .catch((err) => {
        console.log("Admin Api Error", err)
        console.log("Admin Api Error", err?.response)

        if (adminTokenCounter == 3) {
          RNRestart.restart()
        } else {
          setTimeout(() => {
            adminTokenCounter = adminTokenCounter + 1
            this.setState({ adminTokenCounter })
            this.checkAdminToken()
          }, 5000);

        }
        // this.checkAdminToken()
      })
  }

  checkAdminToken = () => {
    const { userData } = this.props
    console.log('')
    console.log("userData?.admintoken", userData?.admintoken)
    console.log('')
    if (this.state.network == true) {

      if (userData?.admintoken == null) {
        this.adminApi()
      } else {
        console.log("")
        console.log("/-----------------------------------/")
        console.log("        Admin Token Generated")
        console.log("/-----------------------------------/")
      }
    } else {
      alert("Network error check your connection")
    }
  }


  componentDidMount = () => {
    this.unsubscribe()
    this.checkAdminToken()
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#020621", }}>

        <View style={{ marginTop: StatusBarManager?.HEIGHT, flex: 1 }} >
          {Platform.OS == "ios" && <StatusBar
            barStyle={'light-content'}
            backgroundColor={"#f5f5f5"}
            translucent
          />}
          {Platform.OS == "android" && <StatusBar
            barStyle={'light-content'}
            backgroundColor={"#020621"}
            translucent
          />}
          <Navigation />

        </View>
      </View>
    );

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

export default connect(mapStateToProps, mapDispatchToProps)(App);
