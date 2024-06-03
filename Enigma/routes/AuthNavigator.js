import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React from "react";
import SignInScreen from "../screens/Auth/SignInScreen";
import SendOTPScreen from "../screens/Auth/SendOTPScreen";
import EnterOTPScreen from "../screens/Auth/EnterOTPScreen";
import SuccessScreen from "../screens/Auth/SuccessScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";
import AppNavigator from "./AppNavigator";
import PolicyScreen from "../screens/Other/PolicyScreen";

import HeaderBack from "./HeaderBack";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="SignInScreen">
            <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SendOTPScreen"
                component={SendOTPScreen}
                options={{
                    headerTitle: "",
                    headerLeft: () => <HeaderBack />,
                    headerLeftContainerStyle: {
                        paddingLeft: "5%",
                    },
                }}
            />
            <Stack.Screen
                name="EnterOTPScreen"
                component={EnterOTPScreen}
                options={{
                    headerTitle: "",
                    headerLeft: () => <HeaderBack />,
                    headerLeftContainerStyle: {
                        paddingLeft: "5%",
                    },
                }}
            />
            <Stack.Screen
                name="ResetPasswordScreen"
                component={ResetPasswordScreen}
                options={{
                    headerTitle: "",
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
            <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AppNavigator"
                component={AppNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PolicyScreen"
                component={PolicyScreen}
                options={{
                    headerTitle: "",
                    headerLeft: () => <HeaderBack />,
                    headerLeftContainerStyle: {
                        paddingLeft: "5%",
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
