import React, { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect } from "react-redux";

import SelectScreen from "../../screens/Create/SelectScreen";
import CreateScreen from "../../screens/Create/CreateScreen";
import EditImageScreen from "../../screens/Create/EditImageScreen";
import MockupScreen from "../../screens/Create/MockupScreen";
import ShirtMockupScreen from "../../screens/Create/ShirtMockupScreen";
import BagMockupScreen from "../../screens/Create/BagMockupScreen";
import SelectOptionsScreen from "../../screens/Create/SelectOptionsScreen";
import OrderScreen from "../../screens/Create/OrderScreen";
import OrderConfirmationScreen from "../../screens/Create/OrderConfirmationScreen";
import UploadPostScreen from "../../screens/Create/UploadPostScreen";
import SuccessScreen from "../../screens/Auth/SuccessScreen";
import AddNewAddressScreen from "../../screens/Other/AddNewAddressScreen";

import CropScreen from "../../screens/Create/CropScreen";


import { updateImageUri } from "../../redux/actions/userActions";

import HeaderBack from "../HeaderBack";

const Stack = createStackNavigator();

const CreateStack = () => {
	const navigation = useNavigation();
	const route = useRoute();

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			if (route.name === "‎") {
				navigation.reset({
					index: 0,
					routes: [{ name: "SelectScreen" }],
				});
			}
		});

		return unsubscribe;
	}, [navigation, route]);

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="SelectScreen"
				component={SelectScreen}
				options={{
					headerTitle: "",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="CreateScreen"
				component={CreateScreen}
				options={{
					headerTitle: "Tạo thiết kế",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
					cardStyle: {
						backgroundColor: "transparent",
					},
					cardStyleInterpolator: () => ({
						cardStyle: {},
						containerStyle: {},
						overlayStyle: {},
					}),
				}}
			/>
			<Stack.Screen
				name="EditImageScreen"
				component={EditImageScreen}
				options={{
					headerTitle: "Chỉnh sửa",
					headerLeft: null,
					cardStyleInterpolator: () => ({
						cardStyle: {},
						containerStyle: {},
						overlayStyle: {},
					}),
				}}
			/>
			<Stack.Screen
				name="CropScreen"
				component={CropScreen}
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="MockupScreen"
				component={MockupScreen}
				options={{
					headerTitle: "Mockup",
					headerLeft: null,
					cardStyleInterpolator: () => ({
						cardStyle: {},
						containerStyle: {},
						overlayStyle: {},
					}),
				}}
			/>
			<Stack.Screen
				name="ShirtMockupScreen"
				component={ShirtMockupScreen}
				options={{
					headerTitle: "Mockup",
					headerLeft: null,
					cardStyleInterpolator: () => ({
						cardStyle: {},
						containerStyle: {},
						overlayStyle: {},
					}),
				}}
			/>
			<Stack.Screen
				name="BagMockupScreen"
				component={BagMockupScreen}
				options={{
					headerTitle: "Mockup",
					headerLeft: () => <HeaderBack isCreateScreen />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
					cardStyleInterpolator: () => ({
						cardStyle: {},
						containerStyle: {},
						overlayStyle: {},
					}),
				}}
			/>
			<Stack.Screen
				name="SelectOptionsScreen"
				component={SelectOptionsScreen}
				options={{
					headerTitle: "Tuỳ chọn",
					headerLeft: () => <HeaderBack isCreateScreen />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
					cardStyleInterpolator: () => ({
						cardStyle: {},
						containerStyle: {},
						overlayStyle: {},
					}),
				}}
			/>
			<Stack.Screen
				name="OrderScreen"
				component={OrderScreen}
				options={{
					headerTitle: "",
					headerLeft: () => <HeaderBack isCreateScreen />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
					cardStyleInterpolator: () => ({
						cardStyle: {},
						containerStyle: {},
						overlayStyle: {},
					}),
				}}
			/>
			<Stack.Screen
				name="UploadPostScreen"
				component={UploadPostScreen}
				options={{
					headerTitle: "Đăng lên Enigma",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="OrderConfirmationScreen"
				component={OrderConfirmationScreen}
				options={{
					headerTitle: "Xác nhận đơn hàng",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="AddNewAddressScreen"
				component={AddNewAddressScreen}
				options={{
					headerTitle: "Thêm địa chỉ",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="SuccessScreen"
				component={SuccessScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

const mapDispatchToProps = {
	updateImageUri,
};

export default connect(null, mapDispatchToProps)(CreateStack);
