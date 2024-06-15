import { ADD_OCCURRENCED_NOTE, CLEAR_OCCURRENCED_NOTES } from '../actions/types';

const initialState = {
    content: []
};

export default occurrencedNotesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_OCCURRENCED_NOTE:
            return {
                ...state,
				content: [ ...state.content, ...action.payload]
            };
        case CLEAR_OCCURRENCED_NOTES:
            return {
                ...state,
                content: []
            }
        default:
            return state;
    }
}