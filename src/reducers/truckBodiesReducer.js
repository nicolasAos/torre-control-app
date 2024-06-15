import {
    GET_TRUCK_BODIES_SUCCESS
} from '../actions/types';

const initialState = {
    content: []
};

export default truckBodiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TRUCK_BODIES_SUCCESS:
            return {
                content: action.payload
            }
        default:
            return state;
    }
}