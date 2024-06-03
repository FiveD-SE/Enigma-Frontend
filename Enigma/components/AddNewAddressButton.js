import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const AddNewAddressButton = ({ onPress }) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<Ionicons
				name="add-circle-outline"
				size={14}
				color={colors.text.white_100}
			/>
			<Text style={styles.title}>Thêm địa chỉ mới</Text>
		</Pressable>
	);
};

export default AddNewAddressButton;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background.black_100,
		borderRadius: 5,
		padding: "2%",
		alignSelf: "flex-start",
		shadowColor: colors.background.black_100,
		shadowOffset: {
			width: -5,
			height: 5,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 2,
	},
	title: {
		marginLeft: "2%",
		color: colors.text.white_100,
		fontSize: 12,
		fontFamily: "helvetica-neue-medium",
	},
});
