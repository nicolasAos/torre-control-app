import { ON_LOAD_TRACKER_TYPES } from '../actions/types';

const initialState = {
    content: []
};

export default trackerTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_TRACKER_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}