import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import WebView from "react-native-webview";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const PaymentWebView = ({
  source,
  flagforwebview,
  buttomButton,
  navigation,
}) => {
  return flagforwebview == true ? (
    <View
      style={{
        backgroundColor: "white",
        width: width,
        height: height,
        paddingBottom: "30%",
      }}
    >
      <WebView source={source} />
      {buttomButton == true && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("HomeScreen");
          }}
          style={{
            backgroundColor: "#020621",
            padding: 15,
            marginHorizontal: 20,
            marginBottom: 30,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Go to Dashboard
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};

export default PaymentWebView;

const styles = StyleSheet.create({});
