import { ON_LOAD_FUEL_TYPES } from '../actions/types';

const initialState = {
    content: []
};

export default fuelTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_FUEL_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}