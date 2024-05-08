import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  NativeModules,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { Component } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const navigateT0 = (key, navProps) => {
  navProps?.navigate(key);
};

const TabNavigator = ({ navProps, screenName }) => {
//   console.log("height",height);
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => navigateT0("HomeScreen", navProps)}
        disabled={screenName == "home" ? true : false}
        activeOpacity={0.4}
        style={styles.iconContainer}
      >
        {screenName == "home" && (
          <View
            style={[
              styles.activeBar,
              { backgroundColor: screenName == "home" ? "#020621" : "#98999c" },
            ]}
          />
        )}
        <Ionicons
          name="home"
          size={25}
          color={screenName == "home" ? "#020621" : "#98999c"}
        />
        <Text
          style={[
            styles.iconText,
            { color: screenName == "home" ? "#020621" : "#98999c" },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigateT0("Categories", navProps)}
        activeOpacity={0.4}
        disabled={screenName == "category" ? true : false}
        style={styles.iconContainer}
      >
        {screenName == "category" && (
          <View
            style={[
              styles.activeBar,
              {
                backgroundColor:
                  screenName == "category" ? "#020621" : "#98999c",
              },
            ]}
          />
        )}
        <Ionicons
          name="grid-outline"
          size={25}
          color={screenName == "category" ? "#020621" : "#98999c"}
        />
        <Text
          style={[
            styles.iconText,
            { color: screenName == "category" ? "#020621" : "#98999c" },
          ]}
        >
          Categories
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigateT0("Cart", navProps)}
        activeOpacity={0.4}
        disabled={screenName == "Cart" ? true : false}
        style={styles.iconContainer}
      >
        {screenName == "Cart" && (
          <View
            style={[
              styles.activeBar,
              { backgroundColor: screenName == "Cart" ? "#020621" : "#98999c" },
            ]}
          />
        )}
        {/* <View
          style={{
            backgroundColor: "#020621",
            borderRadius: 100,
            left:10,
            padding: 5,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 9,
            }}
          >
            2
          </Text>
        </View> */}
        <Ionicons
          name="cart-outline"
          size={25}
          color={screenName == "Cart" ? "#020621" : "#98999c"}
        />
        <Text
          style={[
            styles.iconText,
            { color: screenName == "Cart" ? "#020621" : "#98999c" },
          ]}
        >
          Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigateT0("Account", navProps)}
        activeOpacity={0.4}
        disabled={screenName == "account" ? true : false}
        style={styles.iconContainer}
      >
        {screenName == "account" && (
          <View
            style={[
              styles.activeBar,
              {
                backgroundColor:
                  screenName == "account" ? "#020621" : "#98999c",
              },
            ]}
          />
        )}
        <Ionicons
          name="person-sharp"
          size={25}
          color={screenName == "account" ? "#020621" : "#98999c"}
        />
        <Text
          style={[
            styles.iconText,
            { color: screenName == "account" ? "#020621" : "#98999c" },
          ]}
        >
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  mainContainer: {
    width: width,
    borderWidth: 0.2,
    borderColor: "#98999c",
    height: Platform.OS == "ios" ? (height <= 675 ? 55 : 80) : 55,
    backgroundColor: "white",
    paddingBottom: Platform.OS == "ios" ? (height <= 675 ? 0 : 15) : 0,
    // borderRadius: 15,
    position: "absolute",
    bottom: 0,
    zIndex: 150,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#98999c",
    fontSize: 11,
    fontWeight: "600",
  },
  activeBar: {
    width: "100%",
    height: 2,
    backgroundColor: "#98999c",
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 3,
  },
});
