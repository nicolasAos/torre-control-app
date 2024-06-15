import { ON_LOAD_VEHICLE_TYPES } from '../actions/types';

const initialState = {
    content: []
};

export default vehicleTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_VEHICLE_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}