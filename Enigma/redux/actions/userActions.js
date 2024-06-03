import * as types from "../types/types";

export const selectCreateType = (createType) => ({
	type: types.SELECT_CREATE_TYPE,
	payload: createType,
});

export const updateImageUri = (uri) => ({
	type: types.UPDATE_IMAGE_URI,
	payload: uri,
});

export const updateMockupUri = (uri) => ({
	type: types.UPDATE_MOCKUP_URI,
	payload: uri,
});

export const saveUserData = (userData) => ({
	type: types.SAVE_USER_DATA,
	payload: userData,
});

export const saveMaterialOption = (material) => ({
	type: types.SAVE_MATERIAL_OPTION,
	payload: material,
});

export const savePrintOption = (print) => ({
	type: types.SAVE_PRINT_OPTION,
	payload: print,
});

export const saveSizeOption = (size) => ({
	type: types.SAVE_SIZE_OPTION,
	payload: size,
});

export const saveColorOption = (color) => ({
	type: types.SAVE_COLOR_OPTION,
	payload: color,
});

export const saveProductFront = (front) => ({
	type: types.SAVE_PRODUCT_FRONT,
	payload: front,
});

export const saveProductBack = (back) => ({
	type: types.SAVE_PRODUCT_BACK,
	payload: back,
});

export const saveProductName = (name) => ({
	type: types.SAVE_PRODUCT_NAME,
	payload: name,
});

export const saveProductDescription = (description) => ({
	type: types.SAVE_PRODUCT_DESCRIPTION,
	payload: description,
});

export const saveProductPrice = (price) => ({
	type: types.SAVE_PRODUCT_PRICE,
	payload: price,
});

export const saveProductOrder = (productOrder) => ({
	type: types.SAVE_PRODUCT_ORDER,
	payload: productOrder,
});

export const saveOrder = (order) => ({
	type: types.SAVE_ORDER,
	payload: order,
});

export const updateProducts = (products) => ({
	type: types.UPDATE_PRODUCTS,
	payload: products,
});

export const updateUsers = (users) => ({
	type: types.UPDATE_USERS,
	payload: users,
});

export const updateUserLikes = (userLikes) => ({
	type: types.UPDATE_USER_LIKES,
	payload: userLikes,
});

export const saveEditImage = (editImage) => ({
	type: types.SAVE_EDIT_IMAGE,
	payload: editImage,
});

export const updateCurrentEditImage = (number) => ({
	type: types.UPDATE_CURRENT_EDIT_IMAGE,
	payload: number,
});

export const saveOriginalFrontUri = (uri) => ({
	type: types.SAVE_ORIGINAL_FRONT_URI,
	payload: uri,
});

export const saveOriginalBackUri = (uri) => ({
	type: types.SAVE_ORIGINAL_BACK_URI,
	payload: uri,
});
