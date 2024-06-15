import { ON_LOAD_JOURNEYS_OF_OPERATOR_TYPES } from '../actions/types';

const initialState = {
    content: []
};

export default journeyOfOperatorTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_JOURNEYS_OF_OPERATOR_TYPES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}