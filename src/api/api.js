import axios from "axios";
import { Platform } from "react-native";
export default axios.create({
  // https://wpstaging51.a2zcreatorz.com/aljaber_newsite/pub/rest/V1/
  // https://aljaberoptical.com/pub/rest/V1/?
  baseURL: "https://aljaberoptical.com/pub/rest/V1/",
  headers: {
    "Accept": "application/json",
    "Content-Type": 'application/json; charset=utf-8; ',
    "User-Agent": Platform.OS
  },

});

export const custom_api_url = "https://aljaberoptical.com/pub/script/custom_api.php?"
export const basis_auth = {
  Username: "apiuser",
  Password: "Pakistani2023"
}

// export const basicAuth = 'Basic ' + btoa("apiuser" + ':' + "Pakistani2023");

// admin credentials
// "username": "manager",
// "password": "Pakistan2023"

export const adminUsername = "manager";
export const adminPassword = "Pakistan2023"