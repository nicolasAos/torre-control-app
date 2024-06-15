import {
    FREIGHT_PREFERENCES_SUCCESS
} from '../actions/types';

const initialState = {
    content: {}
};

export default freightPreferencesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FREIGHT_PREFERENCES_SUCCESS:
            return {
                content: action.payload
            }
        default:
            return state;
    }
}