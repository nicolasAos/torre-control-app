import { ON_LOAD_TRUCK_BODY_TYPES } from '../actions/types';

const initialState = {
    content: []
};

export default truckBodyTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_TRUCK_BODY_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}