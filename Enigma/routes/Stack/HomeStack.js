import React, { useLayoutEffect } from "react";
import { colors } from "../../assets/colors";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import HomeScreen from "../../screens/Home/HomeScreen";
import SearchScreen from "../../screens/Home/SearchScreen";
import ItemDetail from "../../components/ItemDetail";
import CartScreen from "../../screens/Home/CartScreen";

import HeaderBack from "../HeaderBack";
import OrderConfirmationScreen from "../../screens/Create/OrderConfirmationScreen";
import SuccessScreen from "../../screens/Auth/SuccessScreen";
import AddNewAddressScreen from "../../screens/Other/AddNewAddressScreen";

const Stack = createStackNavigator();

const isIOS = Platform.OS === "ios";

const HomeStack = ({ navigation, route }) => {
	useLayoutEffect(() => {
		const routeName = getFocusedRouteNameFromRoute(route);
		if (routeName === "ItemDetail") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "SearchScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		}  else if (routeName === "CartScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "AddNewAddressScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});
		} else if (routeName === "OrderConfirmationScreen") {
			navigation.setOptions({
				tabBarStyle: { display: "none" },
			});	
		} else if (routeName === "SuccessScreen") {
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
				name="HomeScreen"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="SearchScreen"
				component={SearchScreen}
				options={{ headerShown: false }}
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
				name="CartScreen"
				component={CartScreen}
				options={{
					headerTitle: "Giỏ hàng",
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

export default HomeStack;
