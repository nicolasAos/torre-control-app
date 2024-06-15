import { SET_SHIPPING_COMPANIE, SET_SHIPPING_COMPANIES } from '../actions/types'

const initialState = {
	data: [],
	selected: null
}

export default shippingCompaniesReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_SHIPPING_COMPANIES:
			return {
				...state,
				data: action.payload
			}
		case SET_SHIPPING_COMPANIE:
			return {
				...state,
				selected: action.payload
			}
		default:
			return state
	}
}
