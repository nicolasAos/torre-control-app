import {
    FREIGHT_WISH_SUCCESS
} from '../actions/types';

const initialState = {
    content: []
};

export default freightWishReducer = (state = initialState, action) => {
    switch (action.type) {
        case FREIGHT_WISH_SUCCESS:
            return {
                content: action.payload
            }
        default:
            return state;
    }
}