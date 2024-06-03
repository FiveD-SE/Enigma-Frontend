import React, { useLayoutEffect } from "react";
import { colors } from "../../assets/colors";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import OtherScreen from "../../screens/Other/OtherScreen";

import HeaderBack from "../HeaderBack";
import AccountScreen from "../../screens/Other/AccountScreen";
import OrderScreen from "../../screens/Other/OrderScreen";
import FavoriteScreen from "../../screens/Other/FavoriteScreen";
import PolicyScreen from "../../screens/Other/PolicyScreen";
import ChangeAddressScreen from "../../screens/Other/ChangeAddressScreen";
import AccountStack from "./AccountStack";
import ItemDetail from "../../components/ItemDetail";
import AddNewAddressButton from "../../components/AddNewAddressButton";
import OrderConfirmationScreen from "../../screens/Create/OrderConfirmationScreen";

const Stack = createStackNavigator();

const isIOS = Platform.OS === "ios";

const OrderStack = ({ navigation, route }) => {
	useLayoutEffect(() => {
		const routeName = getFocusedRouteNameFromRoute(route);
		if (routeName === "AccountStack") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "OrderScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "FavoriteScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "ItemDetail") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "PolicyScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "OrderConfirmationScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else {
			navigation.setOptions({
				tabBarStyle: {
					backgroundColor: colors.background.white_100,
					borderTopColor: colors.accent.lightGrey_10,
					borderTopWidth: 1,
					borderOpacity: 0.5,
					height: isIOS ? 100 : 80,
				},
			});
		}
	}, [navigation, route]);

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="OtherScreen"
				component={OtherScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="AccountStack"
				component={AccountStack}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="ChangeAddressScreen"
				component={ChangeAddressScreen}
				options={{
					headerTitle: "Thay đổi địa chỉ",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="OrderScreen"
				component={OrderScreen}
				options={{
					headerTitle: "Đơn hàng",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="FavoriteScreen"
				component={FavoriteScreen}
				options={{
					headerTitle: "Đã thích",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="ItemDetail"
				component={ItemDetail}
				options={{
					headerTitle: "Chi tiết sản phẩm",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
			<Stack.Screen
				name="PolicyScreen"
				component={PolicyScreen}
				options={{
					headerTitle: "Chính sách",
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
		</Stack.Navigator>
	);
};

export default OrderStack;
