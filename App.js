import React, { Component } from 'react'
import RNRestart from 'react-native-restart';
import { ProgressBar } from 'react-native-paper';
// Command Appcenter Push: appcenter codepush release-react -a a2zcreatorzz-gmail.com/Al-Jaber_Android -d Staging
// COmmand Appcenter Push IOS:appcenter codepush release-react -a a2zcreatorzz-gmail.com/Al-Jaber_IOS -d Staging



{/* {---------------Code Push----------------} */ }
import codePush from 'react-native-code-push';

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
  Modal,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
const { StatusBarManager } = NativeModules;
import Navigation from './src/navigation/navigation';
import api from './src/api/api';
import NetInfo from "@react-native-community/netinfo";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const width = Dimensions.get("screen").width

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      adminToken: null,
      adminTokenCounter: 0,
      network: true,
      syncMessage: 'Loading',
      progress: null,
      updateProcess: true,
      downloaded: 0,
      progressListner: new Animated.Value(0),
      downloading: true,
      update: false,
    };
  }

  syncImmediate() {
    this.setState({ updateProcess: true });
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          appendReleaseDescription: false,
          optionalIgnoreButtonLabel: 'Close',
          optionalInstallButtonLabel: 'Install',
          optionalUpdateMessage: 'New update available. Install update',
          title: 'Update Required',
        },
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  }

  codePushDownloadDidProgress(progress) {
    const downloaded = Math.round(
      (progress?.receivedBytes / progress?.totalBytes) * 100,
    );
    console.log('downloaded', downloaded);
    this.setState({ progress, downloading: true, downloaded: downloaded });
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('==================CHECKING_FOR_UPDATE==================');
        console.log(codePush.SyncStatus.CHECKING_FOR_UPDATE);
        console.log('====================================');

        setTimeout(() => {
          this.setState({ syncMessage: 'Checking For Update' });
        }, 100);
        break;

      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        // alert("Please wait few minutes while the update is installed")

        setTimeout(() => {
          this.setState({
            update: true,
            syncMessage: 'Downloading updates',
            downloading: true,
          });
        }, 100);
        break;

      case codePush.SyncStatus.AWAITING_USER_ACTION:
        setTimeout(() => {
          this.setState({
            syncMessage: 'Waiting for user action to accept',
            downloading: false,
          });
        }, 100);
        break;

      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('================INSTALLING_UPDATE====================');
        console.log(codePush.SyncStatus.INSTALLING_UPDATE);
        console.log('====================================');
        setTimeout(() => {
          this.setState({
            syncMessage: 'Kindly wait, update is being install',
            downloading: true,
          });
        }, 100);
        break;

      case codePush.SyncStatus.UP_TO_DATE:
        console.log('=================UP_TO_DATE===================');
        console.log(codePush.SyncStatus.UP_TO_DATE);
        console.log('====================================');
        setTimeout(() => {
          this.setState({
            syncMessage: 'Your app is upto-date',
            updateProcess: false,
            downloading: false,
          });
        }, 100);
        break;

      case codePush.SyncStatus.UPDATE_IGNORED:
        setTimeout(() => {
          this.setState({ syncMessage: 'User ignored the update' }, () => {
            BackHandler.exitApp();
          });
        }, 100);
        break;

      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log('==================UPDATE_INSTALLED==================');
        console.log(codePush.SyncStatus.UPDATE_INSTALLED);
        console.log('====================================');
        setTimeout(() => {
          this.setState(
            {
              update: false,
              syncMessage: 'Your application is updated now',
              updateProcess: false,
            },
            () => {
              codePush.restartApp();
            },
          );
        }, 100);
        break;

      case codePush.SyncStatus.UNKNOWN_ERROR:
        console.log(codePush.SyncStatus.UNKNOWN_ERROR)
        // setTimeout(() => {
        //   this.setState({ syncMessage: "There is an unknown error" });
        // }, 100);
        break;
    }
  }


  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#020621", }}>

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

          {/* Code Push Update Modal */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.update} //this.state.update
          >
            <View
              style={styles.modalOuterCont}>
              <View
                style={styles.modalInnerCont}>
                <Image
                  source={require('./assets/aljabirlogo.png')}
                  style={styles.imageModal}
                />
                <Text
                  style={styles.titleModalEN}>
                  App is updating, please wait.
                </Text>
                <Text
                  style={styles.titleModalAR}>
                  التطبيق قيد التحديث، فضلاً الإنتظار.
                </Text>
                <Text
                  style={styles.downloaded}>
                  {this.state.downloaded}%
                </Text>
                <ProgressBar
                  progress={0.01 * this.state.downloaded}
                  color="#61CE70"
                  style={styles.progressBar}
                />
              </View>
            </View>
          </Modal>

        </View>
      </GestureHandlerRootView>
    );

  }

}

const styles = StyleSheet.create({

  image: {
    width: 330,
    height: 150,
    // marginTop: 60,
    marginBottom: 60,
    marginLeft: 20
  },
  modalOuterCont: {
    width: width,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52,52,52,0.3)',
  },
  modalInnerCont: {
    width: width,
    height: 270,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  titleModalEN: {
    // fontFamily: 'Careem-Bold',
    fontWeight: "500",
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    marginBottom: 10,
  },
  titleModalAR: {
    // fontFamily: 'Careem-Bold',
    fontSize: 14,
    color: 'black',
    alignSelf: 'center',
    marginBottom: 20,
  },
  downloaded: {
    // fontFamily: 'Careem-Bold',
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    marginVertical: 10,
    position: 'absolute',
    bottom: 29,
    left: 35,
    zIndex: 50,
  },
  progressBar: {
    height: 30,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#EBECED',
  },
  imageModal: {
    width: 120,
    height: 90,
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(codePush(codePush.CheckFrequency.ON_APP_START)(App));
