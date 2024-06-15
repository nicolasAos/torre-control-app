import {CURRENT_TRIP} from '../actions/types';

const initialState = {
  content: '',
};

export default currenteTripReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_TRIP:
      return {
        content: action.payload,
      };
    default:
      return state;
  }
};
