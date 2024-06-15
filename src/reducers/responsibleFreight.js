import {
    RESPONSIBLE_FREIGHT_SUCCESS
} from '../actions/types';

const initialState = {
    content: {}
};

export default responsibleFreight = (state = initialState, action) => {
    switch (action.type) {
        case RESPONSIBLE_FREIGHT_SUCCESS:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}