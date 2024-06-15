import { ON_LOAD_REGIONS } from '../actions/types';

const initialState = {
    content: []
};

export default regionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_REGIONS:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}