import { Text, StyleSheet, View, Dimensions, NativeModules, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import HomeHeader from '../home/components/homeHeader';
import Drawer from '../../components_reusable/drawer';
import { WebView } from 'react-native-webview';

const { StatusBarManager: { HEIGHT } } = NativeModules;
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height - HEIGHT

{/* {---------------Redux Imports------------} */ }
import { connect } from 'react-redux';
import * as userActions from "../../redux/actions/user"
import { bindActionCreators } from 'redux';
import Loading from '../../components_reusable/loading';

class Eyetest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawer: false,
            loading: false,
        };
    }

    openDrawer = () => {
        // console.log("drawer opened");
        this.setState({
            drawer: !this.state.drawer
        })
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {/** Header for Home Screen */}
                <HomeHeader
                    navProps={this.props.navigation}
                    openDrawer={() => this.openDrawer()}
                />

                {/* Drawer */}
                <Drawer
                    props={this.props}
                    isOpen={this.state.drawer}
                    onDismiss={() => this.openDrawer()}
                />
                {this.state.loading && <Loading />}
                <WebView
                    onLoad={() => {
                        this.setState({
                            loading: true
                        })
                    }}
                    onLoadEnd={() => {
                        this.setState({
                            loading: false
                        })
                    }}
                    source={{ uri: 'https://aljaberoptical.com/pub/book-appointment-iframe/index.php' }} style={{ width: width, height: height - 90 }} />

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

export default connect(mapStateToProps, mapDispatchToProps)(Eyetest);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        width: width,
        height: height,
        backgroundColor: "white"
    },
})