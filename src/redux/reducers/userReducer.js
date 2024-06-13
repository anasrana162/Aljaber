import {
    LANGUAGE, TOKEN, USER, GUESTCARTKEY, GUESTCARTID, ADMINTOKEN, DEFAULTCAT, CREATEDDEFAULTCAT, TOPCATDATA, ALLPRODUCTS, RANDOMPRODUCTS, SEARCHPRODUCTS,
    // Main Categories
    SUNGLASSES, CONTACTLENSES, EYEGLASSES, ACCESSEORIES, COMPUTERGLASSES, READINGGLASSES, OFFERS,
    // SUb Categories
    CLEARPRES, COLOR, TORIC, PRESBYOPIA, LENSSOL, CGADULTS, CGKIDS, EGMEN, EGWOMEN, EGKIDS,
    SGMEN, SGWOMEN, SGKIDS, CORDS, SPRAYCLEANER, CASES, GIFTCARDS, SAFETYGLASSES, SWIMMIMINGGOGGLES, OFFERSOBJ,
    // Cart
    CARTITEMS,
    //Orders
    ORDERS,
    //Wishlist
    WISHLIST,
    //Countries
    COUNTRIES,
} from '../constants';

const initialState = {
    user: {},
    token: null,
    guestcartkey: null,
    guestcartid: null,
    language: null,
    countries: [],
    offersobj: {},
    admintoken: null,
    defaultcategory: null,
    createddefaultcategory: null,
    topcatdata: null,
    allproducts: null,
    cartitems: null,
    searchproducts: null,
    orders: null,
    wishlist: [],
    // Main Categories
    sunglasses: [],
    contactlenses: [],
    eyeglasses: [],
    accessories: [],
    computerglasses: [],
    readinglasses: [],
    offers: [],
    //Sub Categories
    clearpres: [],
    color: [],
    toric: [],
    pres: [],
    lenssol: [],
    cgadults: [],
    cgkids: [],
    egmen: [],
    egwomen: [],
    egkids: [],
    sgmen: [],
    sgwomen: [],
    sgkids: [],
    cords: [],
    spraycleaner: [],
    cases: [],
    giftcards: [],
    safetyglasses: [],
    swimgoggles: [],
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN:
            return {
                ...state,
                token: action.payload
            };
        case USER:
            return {
                ...state,
                user: action.payload
            };
        case GUESTCARTKEY:
            return {
                ...state,
                guestcartkey: action.payload
            };
        case GUESTCARTID:
            return {
                ...state,
                guestcartid: action.payload
            };
        case LANGUAGE:
            return {
                ...state,
                language: action.payload
            };

        case ADMINTOKEN:
            return {
                ...state,
                admintoken: action.payload
            }
        case DEFAULTCAT:
            return {
                ...state,
                defaultcategory: action.payload
            }
        case OFFERSOBJ:
            return {
                ...state,
                offersobj: action.payload
            }

        case CREATEDDEFAULTCAT:
            return {
                ...state,
                createddefaultcategory: action.payload
            }
        case TOPCATDATA:
            return {
                ...state,
                topcatdata: action.payload
            }
        case ALLPRODUCTS:
            return {
                ...state,
                allproducts: action.payload
            }
        case SEARCHPRODUCTS:
            return {
                ...state,
                searchproducts: action.payload
            }
        case RANDOMPRODUCTS:
            return {
                ...state,
                randomproducts: action.payload
            }
        case ORDERS:
            return {
                ...state,
                orders: action.payload
            }
        case WISHLIST:
            return {
                ...state,
                wishlist: action.payload
            }
        case CARTITEMS:
            return {
                ...state,
                cartitems: action.payload
            }
        case COUNTRIES:
            return {
                ...state,
                countries: action.payload
            }

        // MAIN CATEGORIES
        case CONTACTLENSES:
            return {
                ...state,
                contactlenses: action.payload
            };
        case SUNGLASSES:
            return {
                ...state,
                sunglasses: action.payload
            };
        case EYEGLASSES:
            return {
                ...state,
                eyeglasses: action.payload
            };

        case COMPUTERGLASSES:
            return {
                ...state,
                computerglasses: action.payload
            }
        case READINGGLASSES:
            return {
                ...state,
                readinglasses: action.payload
            }
        case ACCESSEORIES:
            return {
                ...state,
                accessories: action.payload
            }
        case OFFERS:
            return {
                ...state,
                offers: action.payload
            }


        // SUB CATEGORIES

        case CLEARPRES:
            return {
                ...state,
                clearpres: action.payload
            };
        case COLOR:
            return {
                ...state,
                color: action.payload
            };
        case TORIC:
            return {
                ...state,
                toric: action.payload
            };

        case PRESBYOPIA:
            return {
                ...state,
                pres: action.payload
            }
        case LENSSOL:
            return {
                ...state,
                lenssol: action.payload
            }
        case CGADULTS:
            return {
                ...state,
                cgadults: action.payload
            }
        case CGKIDS:
            return {
                ...state,
                cgkids: action.payload
            }
        case EGMEN:
            return {
                ...state,
                egmen: action.payload
            }
        case EGWOMEN:
            return {
                ...state,
                egwomen: action.payload
            }
        case EGKIDS:
            return {
                ...state,
                egkids: action.payload
            }
        case SGMEN:
            return {
                ...state,
                sgmen: action.payload
            }
        case SGWOMEN:
            return {
                ...state,
                sgwomen: action.payload
            }
        case SGKIDS:
            return {
                ...state,
                sgkids: action.payload
            }
        case CORDS:
            return {
                ...state,
                cords: action.payload
            }
        case SPRAYCLEANER:
            return {
                ...state,
                spraycleaner: action.payload
            }
        case CASES:
            return {
                ...state,
                cases: action.payload
            }
        case GIFTCARDS:
            return {
                ...state,
                giftcards: action.payload
            }
        case SAFETYGLASSES:
            return {
                ...state,
                safetyglasses: action.payload
            }
        case SWIMMIMINGGOGGLES:
            return {
                ...state,
                swimgoggles: action.payload
            }

        case "":
            return state

        default:
            return state;
    }
}
export default userReducer;