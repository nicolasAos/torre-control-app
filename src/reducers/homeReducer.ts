import {LOCATION_SUCCESS, DEVICE_ID_SUCCESS, IS_TRAVEL} from '../actions/types';

const initialState = {
  content: {},
};

export const homeReducer = (state = initialState, action: any) => {
  return state;
};

export const locationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOCATION_SUCCESS:
      return {
        content: action.payload,
      };
    default:
      return state;
  }
};

export const deviceIdReducer = (state = '', action: any) => {
  switch (action.type) {
    case DEVICE_ID_SUCCESS:
      return {
        content: action.payload,
      };
    default:
      return state;
  }
};

export const isTravelReducer = (state = {}, action: any) => {
  switch (action.type) {
    case IS_TRAVEL:
      return {
        content: action.payload,
      };
    default:
      return state;
  }
};
