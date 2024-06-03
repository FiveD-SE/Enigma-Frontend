import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import React from "react";
import { colors } from "../assets/colors";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
const windowHeight = Dimensions.get("window").height;

const TextFontButton = ({ label, fontName, selected, onPress }) => {
	return (
		<Pressable style={[styles.textFontButtonContainer, selected ? {borderWidth: 2}:{borderWidth: 1}]} onPress={onPress}>
			<View
				style={[
					styles.toolsTextContainer,
					selected ? styles.selectedToolsButton : {},
				]}
			>
				<Text
					style={[{fontFamily:fontName},styles.toolsText, selected ? styles.selectedToolsText : {}]}
				>
					{label}
				</Text>
			</View>
		</Pressable>
	);
};

export default TextFontButton;

const styles = StyleSheet.create({
	textFontButtonContainer: {
		justifyContent: "center",
		padding: "4%",
		width: windowHeight * 0.09,
		height: windowHeight * 0.09,
		borderRadius:10,
		borderWidth:1,
		marginHorizontal:"1%",
		borderColor: colors.background.black_50
	},

	toolsText: {
		color: colors.text.black_50,
		fontSize: 14,
		fontFamily: "helvetica-neue-regular",
		textAlign: "center",
	},
	selectedToolsButton: {},
	selectedToolsText: {
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-bold",
	},
});
