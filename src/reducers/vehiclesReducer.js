import {
    GET_VEHICLES_SUCCESS
} from '../actions/types';

const initialState = {
    content: []
};

export default vehiclesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VEHICLES_SUCCESS:
            return {
                content: action.payload
            }
        default:
            return state;
    }
}