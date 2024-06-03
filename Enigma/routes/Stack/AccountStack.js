import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import HeaderBack from "../HeaderBack";
import AccountScreen from "../../screens/Other/AccountScreen";
import ChangeAddressScreen from "../../screens/Other/ChangeAddressScreen";
import AddNewAddressScreen from "../../screens/Other/AddNewAddressScreen";
import SignInScreen from "../../screens/Auth/SignInScreen";
const Stack = createStackNavigator();

const AccountStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="AccountScreen"
                component={AccountScreen}
                options={{
                    headerTitle: "Tài khoản của tôi",
                    headerLeft: () => <HeaderBack />,
                    headerLeftContainerStyle: {
                        paddingLeft: "5%",
                    },
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
                name="LoginScreen"
                component={SignInScreen}
                options={{
                    headerTitle: "Đăng nhập",
                    headerLeft: () => <HeaderBack />,
                    headerLeftContainerStyle: {
                        paddingLeft: "5%",
                    },
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default AccountStack;
