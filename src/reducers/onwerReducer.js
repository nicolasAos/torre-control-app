import {
    OWNERS_VEHICLES
} from '../actions/types';

const initialState = {
    content: []
};

export default ownerReducer = (state = initialState, action) => {
    switch (action.type) {
        case OWNERS_VEHICLES:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}