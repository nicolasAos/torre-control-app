import { ON_LOAD_STATUS_REASON_MONITORING } from '../actions/types';

const initialState = {
    content: []
};

export default statusReasonMonitoringReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_STATUS_REASON_MONITORING:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}