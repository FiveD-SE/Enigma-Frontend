import React, { useLayoutEffect } from "react";
import { colors } from "../../assets/colors";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import EditItemDetail from "../../components/EditItemDetail";

import HeaderBack from "../HeaderBack";
import ShopScreen from "../../screens/Shop/ShopScreen";

const Stack = createStackNavigator();

const isIOS = Platform.OS === "ios";

const ShopStack = ({ navigation, route }) => {
	useLayoutEffect(() => {
		const routeName = getFocusedRouteNameFromRoute(route);
		if (routeName === "EditItemDetail") {
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
				name="ShopScreen"
				component={ShopScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="EditItemDetail"
				component={EditItemDetail}
				options={{
					headerTitle: "Chỉnh sửa chi tiết",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
				}}
			/>
		</Stack.Navigator>
	);
};

export default ShopStack;
