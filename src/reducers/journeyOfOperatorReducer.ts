import {ON_LOAD_JOURNEYS_OF_OPERATOR} from '../actions/types';

const initialState = {
  content: [],
};

const journeysOfOperatorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ON_LOAD_JOURNEYS_OF_OPERATOR:
      return {
        content: action.payload,
      };
      break;
  }
  return state;
};

export default journeysOfOperatorReducer;
