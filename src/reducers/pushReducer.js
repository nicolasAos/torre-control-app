import {
    PREVENTIVE_MONITORING_SUCCESS
} from '../actions/types';

const initialState = {
    content: {}
};

export default pushPreventiveMonitoringReducer = (state = initialState, action) => {
    switch (action.type) {
        case PREVENTIVE_MONITORING_SUCCESS:
            return {
                content: action.payload
            };
        default:
            return state;
    }
}
