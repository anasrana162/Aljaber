import {
    LANGUAGE, TOKEN, USER, ADMINTOKEN, DEFAULTCAT
    //  MISSING_DATA, SELECTED_PROGRAM,
    // SHOPS, ORDER_ADDRESS, ITEM_DETAILS, ORDER_DETAILS, SELECTED_VARIENT, PLAN_DETAILS, MENU_DETAILS, PRICE_DETAILS, SUBSCRIPTIONS
} from '../constants';

const initialState = {
    user: {},
    token: null,
    language: null,
    admintoken: null,
    defaultcategory: null,
    // missing_data: false,
    // selected_program: {},
    // selected_varient: {},
    // shops: null,
    // order_address: null,
    // item_details: null,
    // order_details: null,
    // plan_details: null,
    // menu_details: null,
    // price_details: null,
    // subscriptions: null,
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
        // case MISSING_DATA:
        //     return {
        //         ...state,
        //         missing_data: action.payload
        //     };
        // case SELECTED_PROGRAM:
        //     return {
        //         ...state,
        //         selected_program: action.payload
        //     };
        // case SELECTED_VARIENT:
        //     return {
        //         ...state,
        //         selected_varient: action.payload
        //     };
        // case SHOPS:
        //     return {
        //         ...state,
        //         shops: action.payload
        //     };
        // case ORDER_ADDRESS:
        //     return {
        //         ...state,
        //         order_address: action.payload
        //     };
        // case ORDER_DETAILS:
        //     return {
        //         ...state,
        //         order_details: action.payload
        //     };
        // case ITEM_DETAILS:
        //     return {
        //         ...state,
        //         item_details: action.payload
        //     };
        // case PLAN_DETAILS:
        //     return {
        //         ...state,
        //         plan_details: action.payload
        //     };
        // case PRICE_DETAILS:
        //     return {
        //         ...state,
        //         price_details: action.payload
        //     };
        // case MENU_DETAILS:
        //     return {
        //         ...state,
        //         menu_details: action.payload
        //     };
        // case SUBSCRIPTIONS:
        //     return {
        //         ...state,
        //         subscriptions: action.payload
        //     };

        default:
            return state;
    }
}
export default userReducer;