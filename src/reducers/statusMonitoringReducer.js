import { ON_LOAD_STATUS_MONITORING } from '../actions/types';

const initialState = {
    content: []
};

export default statusMonitoringReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_LOAD_STATUS_MONITORING:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}