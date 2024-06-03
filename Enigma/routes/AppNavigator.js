import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet } from "react-native";

import HomeStack from "./Stack/HomeStack";
import EditScreen from "../screens/Edit/EditScreen";
import CreateStack from "./Stack/CreateStack";
import ShopScreen from "../screens/Shop/ShopScreen";
import OtherStack from "../routes/Stack/OtherStack";

import TabBarIcon from "./TabBarIcon";
import CustomAddButton from "./CustomAddButton";
import { colors } from "../assets/colors";
import ShopStack from "./Stack/ShopStack";
import NotificationStack  from "./Stack/NotificationStack";

const Tab = createBottomTabNavigator();
const isIOS = Platform.OS === "ios";

const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: colors.background.black_100,
                tabBarInactiveTintColor: colors.accent.lightGrey_100,
                tabBarStyle:
                    route.name === "‎"
                        ? { display: "none" }
                        : styles.bottomTabBar,
                tabBarShowLabel: true,
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: styles.labelStyle,
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    switch (route.name) {
                        case "Trang chủ":
                            iconName = "home";
                            break;
                        case "Thông báo":
                            iconName = "notifications";
                            break;
                        case "Bán hàng":
                            iconName = "storefront";
                            break;
                        case "Khác":
                            iconName = "ellipsis-horizontal";
                            break;
                        default:
                            iconName = "home";
                    }
                    return (
                        <TabBarIcon
                            focused={focused}
                            name={iconName}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Trang chủ" component={HomeStack} />
            <Tab.Screen name="Bán hàng" component={ShopStack} />
            <Tab.Screen
                name="‎"
                component={CreateStack}
                options={{
                    tabBarButton: (props) => <CustomAddButton {...props} />,
                }}
            />
            <Tab.Screen name="Thông báo" component={NotificationStack} />
            <Tab.Screen name="Khác" component={OtherStack} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    bottomTabBar: {
        backgroundColor: colors.background.white_100,
        borderTopColor: colors.accent.lightGrey_10,
        borderTopWidth: 1,
        borderOpacity: 0.5,
        height: isIOS ? 100 : 80,
    },
    labelStyle: {
        fontSize: 12,
        fontFamily: "helvetica-neue-bold",
        marginTop: 0,
        marginBottom: isIOS ? 0 : 15,
    },
});

export default AppNavigator;
