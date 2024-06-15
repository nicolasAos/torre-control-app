import {ETA_CALCULATION} from '../actions/types';

const initialState = {
  content: [],
};

export default etaCalculation = (state = initialState, action) => {
  switch (action.type) {
    case ETA_CALCULATION:
      return {
        content: action.payload,
      };
    default:
      return state;
  }
};
