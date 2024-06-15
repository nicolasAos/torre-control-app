import {
    ON_LOAD_OCCURRENCE_TYPES
} from '../actions/types';

const initialState = {
    content: []
};

export default occurrenceTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_OCCURRENCE_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}