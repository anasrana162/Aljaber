import {
    LANGUAGE, TOKEN, ADMINTOKEN, USER, DEFAULTCAT,CREATEDDEFAULTCAT,ALLPRODUCTS
    //  MISSING_DATA, SELECTED_PROGRAM,
    // SHOPS, ORDER_ADDRESS, ITEM_DETAILS, ORDER_DETAILS, SELECTED_VARIENT, PLAN_DETAILS, MENU_DETAILS, PRICE_DETAILS, SUBSCRIPTIONS
} from '../constants';

export function userToken(token) {
    return {
        type: TOKEN,
        payload: token
    }
}
export function adminToken(admintoken) {
    return {
        type: ADMINTOKEN,
        payload: admintoken
    }
}
export function user(userObject) {
    return {
        type: USER,
        payload: userObject
    }
}
export function updateLanguage(language) {
    return {
        type: LANGUAGE,
        payload: language
    }
}
export function defaultCategories(defaultcategory) {
    return {
        type: DEFAULTCAT,
        payload: defaultcategory
    }
}

export function createdDefaultCategories(createddefaultcategory) {
    return {
        type: CREATEDDEFAULTCAT,
        payload: createddefaultcategory
    }
}
export function allProducts(allproducts) {
    return {
        type: ALLPRODUCTS,
        payload: allproducts
    }
}

// export function missingData(flag) {
//     return {
//         type: MISSING_DATA,
//         payload: flag
//     }
// }
// export function selectedProgram(itemObject) {
//     return {
//         type: SELECTED_PROGRAM,
//         payload: itemObject
//     }
// }

// export function saveShops(shops) {
//     return {
//         type: SHOPS,
//         payload: shops
//     }
// }
// export function saveOrderAddress(address) {
//     return {
//         type: ORDER_ADDRESS,
//         payload: address
//     }
// }

// export function itemDetails(item) {
//     return {
//         type: ITEM_DETAILS,
//         payload: item
//     }
// }
// export function orderDetails(item) {
//     return {
//         type: ORDER_DETAILS,
//         payload: item
//     }
// }
// export function selectedVarient(item) {
//     return {
//         type: SELECTED_VARIENT,
//         payload: item
//     }
// }
// export function saveOrderMenuDetails(item) {
//     return {
//         type: MENU_DETAILS,
//         payload: item
//     }
// }
// export function savePlanDetails(item) {
//     return {
//         type: PLAN_DETAILS,
//         payload: item
//     }
// }
// export function savePriceDetails(item) {
//     return {
//         type: PRICE_DETAILS,
//         payload: item
//     }
// }
// export function saveSubscriptions(item) {
//     return {
//         type: SUBSCRIPTIONS,
//         payload: item
//     }
// }