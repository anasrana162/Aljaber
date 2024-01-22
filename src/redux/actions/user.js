import {
    LANGUAGE, TOKEN, ADMINTOKEN, USER, DEFAULTCAT, CREATEDDEFAULTCAT,TOPCATDATA, ALLPRODUCTS, RANDOMPRODUCTS, SEARCHPRODUCTS,
    // SUb Categories
    CLEARPRES, COLOR, TORIC, PRESBYOPIA, LENSSOL, CGADULTS, CGKIDS, EGMEN, EGWOMEN, EGKIDS,
    SGMEN, SGWOMEN, SGKIDS, CORDS, SPRAYCLEANER, CASES, GIFTCARDS, SAFETYGLASSES, SWIMMIMINGGOGGLES,
    // Cart
    CARTITEMS,
    //Orders
    ORDERS,
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
export function topCatData(topcatdata) {
    return {
        type: TOPCATDATA,
        payload: topcatdata
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
export function searchProducts(searchproducts) {
    return {
        type: SEARCHPRODUCTS,
        payload: searchproducts
    }
}
export function randomProducts(randomproducts) {
    return {
        type: RANDOMPRODUCTS,
        payload: randomproducts
    }
}
export function cartItems(cartitems) {
    return {
        type: CARTITEMS,
        payload: cartitems
    }
}
export function myOrders(orders) {
    return {
        type: ORDERS,
        payload: orders
    }
}

export function savedProducts(category_id, savedproducts) {
    switch (category_id) {

        // Category Contact Lenses
        case "29":
            return {
                type: CLEARPRES,
                payload: savedproducts,
            }
        case "30":
            return {
                type: COLOR,
                payload: savedproducts
            }
        case "31":
            return {
                type: TORIC,
                payload: savedproducts
            }
        case "32":
            return {
                type: PRESBYOPIA,
                payload: savedproducts
            }
        case "33":
            return {
                type: LENSSOL,
                payload: savedproducts
            }

        // Category Computer Glasses
        case "27":
            return {
                type: CGADULTS,
                payload: savedproducts
            }
        case "28":
            return {
                type: CGKIDS,
                payload: savedproducts
            }
        // case "81":
        //     return {
        //         type: LENSSOL,
        //         payload: savedproducts
        //     }

        // Category Eyeglasses
        case "34":
            return {
                type: EGMEN,
                payload: savedproducts
            }
        case "103":
            return {
                type: EGWOMEN,
                payload: savedproducts
            }
        case "104":
            return {
                type: EGKIDS,
                payload: savedproducts
            }

        // Category Sunglasses
        case "42":
            return {
                type: SGMEN,
                payload: savedproducts
            }
        case "43":
            return {
                type: SGWOMEN,
                payload: savedproducts
            }
        case "44":
            return {
                type: SGKIDS,
                payload: savedproducts
            }
        // Category Accessories
        case "122":
            return {
                type: CORDS,
                payload: savedproducts
            }
        case "123":
            return {
                type: SPRAYCLEANER,
                payload: savedproducts
            }
        case "124":
            return {
                type: CASES,
                payload: savedproducts
            }
        case "125":
            return {
                type: GIFTCARDS,
                payload: savedproducts
            }
        case "126":
            return {
                type: SAFETYGLASSES,
                payload: savedproducts
            }
        case "127":
            return {
                type: SWIMMIMINGGOGGLES,
                payload: savedproducts
            }

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