import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { colors } from "../assets/colors";

const SearchBar = ({ onFocus, onChangeText }) => {
	const handleTextChange = (text) => {
		onChangeText(text);
	};
	return (
		<View style={styles.inputContainer}>
			<TextInput
				style={styles.input}
				placeholder="Tìm kiếm"
				onChangeText={handleTextChange}
				onFocus={onFocus}
				placeholderTextColor={colors.text.black_50}
			/>
		</View>
	);
};

export default SearchBar;

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 8,
		borderColor: "#CCCCCC",
		paddingHorizontal: "5%",
		paddingVertical: "2%",
		backgroundColor: "#ffffff",
	},
	input: {
		flex: 1,
		color: colors.text.black_100,
		fontSize: 16,
		fontWeight: "400",
	},
});
