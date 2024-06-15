import {
    CNH_SUCCESS
} from '../actions/types';

const initialState = {
    content: {}
};

export default cnhReducer = (state = initialState, action) => {
    switch (action.type) {
        case CNH_SUCCESS:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}