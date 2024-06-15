import {
    ON_LOAD_OCCURRENCE_TYPES_GO
} from '../actions/types';

const initialState = {
    content: []
};

export default occurrenceTypesGoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_OCCURRENCE_TYPES_GO:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}