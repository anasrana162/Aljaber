import {
    LANGUAGE, TOKEN, USER, ADMINTOKEN, DEFAULTCAT, CREATEDDEFAULTCAT, ALLPRODUCTS, RANDOMPRODUCTS, SEARCHPRODUCTS,
    // SUb Categories
    CLEARPRES, COLOR, TORIC, PRESBYOPIA, LENSSOL, CGADULTS, CGKIDS, EGMEN, EGWOMEN, EGKIDS,
    SGMEN, SGWOMEN, SGKIDS, CORDS, SPRAYCLEANER, CASES, GIFTCARDS, SAFETYGLASSES, SWIMMIMINGGOGGLES,
    // Cart
    CARTITEMS,
} from '../constants';

const initialState = {
    user: {},
    token: null,
    language: null,
    admintoken: null,
    defaultcategory: null,
    createddefaultcategory: null,
    allproducts: null,
    cartitems: null,
    searchproducts: null,
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
        case CREATEDDEFAULTCAT:
            return {
                ...state,
                createddefaultcategory: action.payload
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
        case CARTITEMS:
            return {
                ...state,
                cartitems: action.payload
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

        default:
            return state;
    }
}
export default userReducer;