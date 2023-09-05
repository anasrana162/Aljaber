import axios from "axios";
import { Platform } from "react-native";
export default axios.create({

  baseURL: "https://wpstaging51.a2zcreatorz.com/aljaber_newsite/pub/rest/V1/",
  headers: {
    "Accept": "application/json",
    "Content-Type": 'application/json; charset=utf-8; ',
    "User-Agent": Platform.OS
  },

});

// admin credentials
// "username": "manager",
// "password": "Pakistan2023"

export const adminUsername = "manager";
export const adminPassword = "Pakistan2023"