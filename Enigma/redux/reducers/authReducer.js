import * as types from "../types/types";

const initialState = {
	userData: {},
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SAVE_USER_DATA:
			return {
				...state,
				userData: action.payload,
			};
		default:
			return state;
	}
};

export default authReducer;
