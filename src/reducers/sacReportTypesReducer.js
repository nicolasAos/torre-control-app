import {
    ON_LOAD_SACREPORT_TYPES
} from '../actions/types';

const initialState = {
    content: []
};

export default sacReportTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_SACREPORT_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}