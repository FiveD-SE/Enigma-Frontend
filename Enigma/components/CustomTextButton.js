import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import { colors } from "../assets/colors";

const CustomTextButton = ({ text, onPress }) => {
	return (
		<Pressable onPress={onPress}>
			<Text style={styles.textButton}>{text}</Text>
		</Pressable>
	);
};

export default CustomTextButton;

const styles = StyleSheet.create({
	textButton: {
		color: colors.text.main,
		fontSize: 16,
		fontStyle: "normal",
		fontWeight: "600",
		lineHeight: 24,
	},
});
