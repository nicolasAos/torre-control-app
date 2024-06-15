import { ON_LOAD_CNH_TYPES } from '../actions/types';

const initialState = {
    content: []
};

export default cnhTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_CNH_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}