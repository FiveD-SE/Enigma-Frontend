import * as types from "../types/types";

const initialState = {
	currentEditImage: 0,
	createType: "",
	imageUri: null,
	mockupImageUri: [],
	product: {},
	orders: {
		productOrders: [],
	},
	products: [],
	userLikes: [],
	users: [],
	editImage: [],
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.SELECT_CREATE_TYPE:
			return {
				...state,
				createType: action.payload,
			};
		case types.UPDATE_IMAGE_URI:
			return {
				...state,
				imageUri: action.payload,
			};
		case types.UPDATE_MOCKUP_URI:
			return {
				...state,
				mockupImageUri: action.payload,
			};
		case types.SAVE_MATERIAL_OPTION:
			return {
				...state,
				product: { ...state.product, productMaterial: action.payload },
			};
		case types.SAVE_PRINT_OPTION:
			return {
				...state,
				product: { ...state.product, productPrint: action.payload },
			};
		case types.SAVE_COLOR_OPTION:
			return {
				...state,
				product: { ...state.product, color: action.payload },
			};
		case types.SAVE_SIZE_OPTION:
			return {
				...state,
				product: { ...state.product, size: action.payload },
			};
		case types.SAVE_PRODUCT_FRONT:
			return {
				...state,
				product: { ...state.product, front: action.payload },
			};
		case types.SAVE_PRODUCT_BACK:
			return {
				...state,
				product: { ...state.product, back: action.payload },
			};
		case types.SAVE_PRODUCT_NAME:
			return {
				...state,
				product: { ...state.product, name: action.payload },
			};
		case types.SAVE_PRODUCT_DESCRIPTION:
			return {
				...state,
				product: { ...state.product, description: action.payload },
			};
		case types.SAVE_PRODUCT_PRICE:
			return {
				...state,
				product: { ...state.product, price: action.payload },
			};
		case types.SAVE_PRODUCT_ORDER: {
			return {
				...state,
				orders: {
					...state.orders,
					productOrders: [...state.orders.productOrders, action.payload],
				},
			};
		}
		case types.SAVE_ORDER: {
			return {
				...state,
				orders: { ...state.orders, image: action.payload },
			};
		}
		case types.UPDATE_PRODUCTS: {
			return {
				...state,
				products: action.payload,
			};
		}
		case types.UPDATE_USERS: {
			return {
				...state,
				users: action.payload,
			};
		}
		case types.UPDATE_USER_LIKES: {
			return {
				...state,
				userLikes: action.payload,
			};
		}
		case types.SAVE_EDIT_IMAGE: {
			return {
				...state,
				editImage: action.payload,
			};
		}
		case types.UPDATE_CURRENT_EDIT_IMAGE: {
			return {
				...state,
				currentEditImage: action.payload,
			};
		}
		case types.SAVE_ORIGINAL_FRONT_URI:
			return {
				...state,
				product: { ...state.product, originalFrontUri: action.payload },
			};
		case types.SAVE_ORIGINAL_BACK_URI:
			return {
				...state,
				product: { ...state.product, originalBackUri: action.payload },
			};
		default:
			return state;
	}
};
export default userReducer;
