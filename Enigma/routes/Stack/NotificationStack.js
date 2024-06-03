import React, { useLayoutEffect } from "react";
import { colors } from "../../assets/colors";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import NotificationScreen from "../../screens/Notification/NotificationScreen";
import HeaderBack from "../HeaderBack";
import OrderNotificationScreen from "../../screens/Notification/OrderNotificationScreen";
import TourGuideScreen from "../../screens/Notification/TourGuideScreen";
import NotificationCard from "../../components/NotificationCard";

const Stack = createStackNavigator();

const isIOS = Platform.OS === "ios";

const NotificationStack = ({ navigation, route }) => {
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "OrderNotificationScreen" || routeName === "TourGuideScreen") {
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
                    height: isIOS? 100 : 80,
                },
            });
        }
    }, [navigation, route]);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderNotificationScreen"
                component={OrderNotificationScreen}
                options={{
                    headerTitle: "Thông báo đơn hàng",
                    headerLeft: () => <HeaderBack />,
                    headerLeftContainerStyle: {
                        paddingLeft: "5%",
                    },
                }}
            />
            <Stack.Screen
                name="TourGuideScreen"
                component={TourGuideScreen}
                options={{
                    headerTitle: "Hướng dẫn sử dụng Enigma",
                    headerLeft: () => <HeaderBack />,
                    headerLeftContainerStyle: {
                        paddingLeft: "5%",
                    },
                }}
            />
                <Stack.Screen
                    name="NotificationCard"
                    component={NotificationCard}
                    options={{ headerShown: false }}
                />
        </Stack.Navigator>
    );
};

export default NotificationStack;