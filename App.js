import React, { Component } from 'react'
import RNRestart from 'react-native-restart';
import { ProgressBar } from 'react-native-paper';
// Command Appcenter Push: appcenter codepush release-react -a a2zcreatorzz-gmail.com/Al-Jaber_Android -d Staging
// COmmand Appcenter Push IOS:appcenter codepush release-react -a a2zcreatorzz-gmail.com/Al-Jaber_IOS -d Staging

import AsyncStorage from '@react-native-async-storage/async-storage';

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
import api, { custom_api_url } from './src/api/api';
import NetInfo from "@react-native-community/netinfo";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Loading from './src/components_reusable/loading';

const width = Dimensions.get("screen").width

var topCategory = [
  {
    "id": 42,
    "parent_id": 26,
    "name": "Men",
    "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/man-cat.jpg",
    "is_active": true,
    "position": 1,
    "level": 3,
    "product_count": 175,
    "children_data": []
  },
  {
    "id": 43,
    "parent_id": 26,
    "name": "Women",
    "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/women-cat.jpg",
    "is_active": true,
    "position": 2,
    "level": 3,
    "product_count": 209,
    "children_data": []
  },
  {
    "id": 44,
    "parent_id": 26,
    "name": "Kids",
    "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/kid-cat.jpg",
    "is_active": true,
    "position": 3,
    "level": 3,
    "product_count": 97,
    "children_data": []
  },
  {
    "id": 122,
    "parent_id": 102,
    "name": "Acessories",
    "main_menu_image": "https://aljaberoptical.com/media/wysiwyg/smartwave/porto/theme_assets/images/resource/sunglasses-cat.jpg",
    "is_active": true,
    "image": "/pub/media/wysiwyg/smartwave/porto/theme_assets/images/banner2.jpg",
    "position": 1,
    "level": 3,
    "product_count": 41,
    "children_data": []
  },
]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      adminToken: null,
      loader: false,
      adminTokenCounter: 0,
      categoryApiCounter: 0,
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
  componentDidMount = () => {
    this.adminApi()
    this.loginUser()
    this.fetchAllProductsForSearch()
  }

  // ---------Code Push Start-----------//
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
  // ---------Code Push END-----------//

  adminApi = async () => {

    // console.log(this.props)
    const { actions } = this.props
    var { adminTokenCounter } = this.state
    setImmediate(() => {
      this.setState({ loader: true })
    })
    await api.post('integration/admin/token', {
      "username": "apiuser",
      "password": "Pakistani2023"
    }).then((res) => {
      console.log("Admin Api res: ||||| App.js ", res?.data)
      if (res?.data) {

        actions.adminToken(res?.data)
        this.setState({ adminToken: res?.data })
        this.getDefaultCategories()
      }
    })
      .catch((err) => {
        console.log("Admin Api Error", err)
        console.log("Admin Api Error", err?.response)


        // this.checkAdminToken()
      })
  }
  loginUser = async () => {

    var { actions } = this.props

    var LoginData = await AsyncStorage.getItem("@aljaber_userLoginData")
    var objLoginData = JSON.parse(LoginData)
    console.log("LoginData", objLoginData)
    if (objLoginData !== null) {

      var customerToken = await api.post('integration/customer/token', {
        username: objLoginData?.username,
        password: objLoginData?.password,
      })

      // console.log("customerToken", customerToken?.data)
      if (customerToken?.data !== "") {
        const res = await api.post(
          "carts/mine",
          {},
          {
            headers: {
              Authorization: `Bearer ${customerToken?.data}`,
              "Content-Type": "application/json",
            },
          }
        ).then((result) => {


          // console.log("========Success ALJEBER============ Home", result?.data);

          api.get('customers/me', {
            headers: {
              Authorization: `Bearer ${customerToken?.data}`,
            },
          }).then((user_data) => {


            if (user_data?.data) {
              // console.log("TOKEN GENERATED============Home",)
              actions.userToken(customerToken?.data)
              user_data.data.cartID = result?.data
              actions.user(user_data?.data)
              this.fetchUserOrders()

            }
          }).catch((err) => {
            alert("Network Error Code: (cd1)")
            console.log("customer data Api error HOme: ", err?.response)

          })
        }).catch((err) => {
          console.log("Error AddtoCart ID API Home:", err?.message)

        })
      }
    }
    else {
      console.log("No credentials found for login")
    }
  }
  fetchUserOrders = () => {
    var { userData: { user }, actions } = this.props
    // console.log("customer?.id", user?.id)
    api.get("orders?searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bfield%5d=" + "customer_id"
      + "&searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bvalue%5d=" + user?.id
      + "searchCriteria%5bfilterGroups%5d%5b0%5d%5bfilters%5d%5b0%5d%5bconditionType%5d=eq",
      {
        headers: {
          Authorization: `Bearer ${this.state.adminToken}`,
        },
      })
      .then((res) => {
        // console.log("Orders of Coustomer are:", res?.data)
        actions.myOrders(res?.data?.items)
      }).catch((err) => {
        console.log("Err get customer orders api:  ", err?.response?.data?.message)
      })
  }

  fetchAllProductsForSearch = async () => {
    var { actions } = this.props
    var fetchProducts = await api.get(custom_api_url + "func=get_all_products")
    let products = []
    for (let i = 0; i < fetchProducts?.data.length; i++) {
      if (fetchProducts?.data[i].type == "configurable" || fetchProducts?.data[i].type == "simple" && fetchProducts?.data[i].visibility == 4) {
        products.push(fetchProducts?.data[i])
      }
    }

    actions?.searchProducts(products)
    // console.log("Fetched products final:", products)

  }
  getDefaultCategories = async () => {

    const { actions } = this.props
    var { categoryApiCounter, adminToken } = this.state

    if (this.state.network == true) {

      await api.get('categories', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }).then((res) => {
        //console.log("User Data:", res?.data)

        actions.defaultCategories(res?.data)
        // this.loginUser()
        this.defaultCategories()
        this.topCategoryData()
        // this.fetchAllProductsForSearch()
        // this.randomProducts()

      }).catch((err) => {
        //alert("Network Error Code: (CAT#1)")
        console.log("categories Api error: ", err)
        setTimeout(() => {

          if (categoryApiCounter == 3) {
            RNRestart.restart();
          } else {

            categoryApiCounter = categoryApiCounter + 1
            this.setState({ categoryApiCounter })
            this.adminApi()
          }
        }, 3000);

      })
    }
    // }
  }
  defaultCategories = () => {
    const { actions, userData: { defaultcategory, admintoken } } = this.props

    var { children_data } = defaultcategory
    // console.log("tempArray1", children_data)
    actions?.createdDefaultCategories(children_data)

    // this to to hide some categories ID's are specified in switch
    // var tempArr = []
    // for (let i = 0; i < children_data?.length; i++) {
    //     switch (children_data[i].id) {
    //         case 50:
    //             children_data[i].is_active = false
    //             break;
    //         case 72:
    //             children_data[i].is_active = false
    //             break;
    //         case 89:
    //             children_data[i].is_active = false
    //             break;
    //         case 128:
    //             children_data[i].is_active = false
    //             break;

    //         default:
    //             // /children_data[i].is_active = true
    //             tempArr.push(children_data[i])
    //             break;
    //     }
    // }
    // this.setState({
    //     defaultCategories1: tempArr,
    //     firstSubItem: tempArr[0]
    // });
    // this.topCatData(tempArr)
    // this.topCategoryData()
  }
  topCategoryData = async () => {
    var { userData: { admintoken }, actions } = this.props
    var { adminToken } = this.state
    var topCategoryData = []
    for (let i = 0; i < topCategory.length; i++) {
      // this api is being used for taking out image link for product screen top image
      await api.get("categories/" + topCategory[i]?.id, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        }
      }).then((res) => {
        for (let r = 0; r < res?.data?.custom_attributes.length; r++) {

          // this cndition is for Acessories because it doenst have a attribute code "image" so there is no image link and
          // thats why in the array imagelink is manually given so it is also pushed in the array
          // as it is without any modification like above rest which have attribute code image
          if (topCategory[i]?.id == 122) {
            topCategoryData.push(topCategory[i])
            break;
          }

          if (res?.data?.custom_attributes[r].attribute_code == "image") {
            topCategory[i].image = res?.data?.custom_attributes[r].value
            topCategoryData.push(topCategory[i])
            break;
          }
        }
      }).catch((err) => {
        console.log("fetching Image link api error Homescreen ", err)
      })
    }
    actions.topCatData(topCategoryData)
    setImmediate(() => {
      this.setState({
        loader: false,
      })
    })
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
          {this.state.loader == true ?
            <>
              <Loading />
            </>
            :
            <Navigation />
          }




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
