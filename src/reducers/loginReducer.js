import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    FORGOT_SUCCESS,
    FORGOT_TOKEN_SUCCESS,
    ALTER_LOGIN_SUCCESS,
    LOGIN_HOMOLOG_SUCCESS
} from '../actions/types';

const initialState = {
    content: {}
};

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                content: action.payload
            }
        case LOGOUT_SUCCESS:
            return {
                content: action.payload
            }
        case ALTER_LOGIN_SUCCESS:
            return {
                content: action.payload
            }
        default:
            return state;
    }
}

export const forgotReducer = (state = initialState, action) => {
    switch (action.type) {
        case FORGOT_SUCCESS:
            return {
                content: action.payload
            }
        case FORGOT_TOKEN_SUCCESS:
            return {
                content: action.payload
            }
        default:
            return state;
    }
}

export const loginHomologReducer = (state = false, action) => {
    switch (action.type) {
        case LOGIN_HOMOLOG_SUCCESS:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}
