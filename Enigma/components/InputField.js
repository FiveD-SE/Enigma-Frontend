import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const InputField = (props) => {
	const [isFocused, setIsFocused] = useState(false);
	return (
		<View
			style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}
		>
			<TextInput
				style={styles.input}
				{...props}
				placeholderTextColor={colors.text.grey_100}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
			<Ionicons name={props.iconName} size={24} />
		</View>
	);
};

export default InputField;

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 8,
		borderColor: "rgba(58, 58, 58, 0.5)",
		paddingHorizontal: "5%",
		paddingVertical: "4%",
		marginTop: "5%",
		backgroundColor: colors.background.white_100,
	},
	input: {
		flex: 1,
		color: colors.text.main,
		fontSize: 16,
		lineHeight: 20,
		fontFamily: "helvetica-neue-medium",
	},
	inputContainerFocused: {
		borderWidth: 2,
		borderColor: colors.background.black_100,
	},
});
