import React from "react";
import { StyleSheet, Pressable, View, Platform } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const isIOS = Platform.OS === "ios";

const CustomAddButton = ({ onPress }) => {
	return (
		<Pressable
			onPress={onPress}
			style={styles.button}
			android_ripple={{
				color: colors.background.transparent,
			}}
		>
			<View style={styles.iconContainer}>
				<FontAwesome5 name="plus" size={24} color="#FFF" />
			</View>
		</Pressable>
	);
};

export default CustomAddButton;

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.primary.purple_100,
		justifyContent: "center",
		alignItems: "center",
		width: 72,
		height: 72,
		borderRadius: 36,
		top: isIOS ? -30 : -40,
		shadowColor: colors.background.black_100,
		shadowRadius: 5,
		shadowOffset: {
			height: 10,
		},
		elevation: 5,
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
});
