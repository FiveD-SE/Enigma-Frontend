import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../assets/colors";

const RequestDeleteButton = ({ text, onPress }) => {
	return (
		<TouchableOpacity
			activeOpacity={0.6}
			style={styles.container}
			onPress={onPress}
		>
			<Text style={styles.title}>{text}</Text>
		</TouchableOpacity>
	);
};

export default RequestDeleteButton;

const styles = StyleSheet.create({
	container: {
		padding: "5%",
		backgroundColor: colors.background.white_100,
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		borderColor: colors.background.black_20,
		borderRadius: 5,
		shadowColor: colors.background.black_100,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	title: {
		color: colors.error,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
});
