import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const OptionsCard = ({ title, description, price, isChecked, onPress }) => {
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	return (
		<View style={[styles.container, isChecked && styles.checkedContainer]}>
			<View style={styles.main}>
				<View style={styles.contentContainer}>
					<Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
						{title}
					</Text>
					<Text style={styles.description}>{description}</Text>
					<Text style={styles.price}>{formatCurrency(price)}</Text>
				</View>
			</View>
			<Pressable onPress={onPress}>
				<MaterialIcons
					name={isChecked ? "radio-button-checked" : "radio-button-unchecked"}
					size={24}
					color={[styles.icon, isChecked && styles.checkedIcon]}
				/>
			</Pressable>
		</View>
	);
};

export default OptionsCard;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.background.white_100,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.background.black_20,
		borderRadius: 10,
		padding: "4%",
		marginVertical: "2%",
	},
	contentContainer: {
		flex: 1,
		marginLeft: "2%",
		marginRight: "10%",
	},
	main: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
	},
	description: {
		color: colors.text.black_50,
		fontSize: 14,
		lineHeight: 20,
		fontFamily: "helvetica-neue-medium",
		marginTop: "2%",
		textAlign: "justify",
	},
	price: {
		color: colors.text.black_1000,
		fontSize: 16,
		fontFamily: "helvetica-neue-medium",
		marginTop: "2%",
		textAlign: "justify",
	},
	checkbox: {
		borderColor: "#3a3a3a",
		borderRadius: 100,
	},
	checkedContainer: {
		backgroundColor: colors.background.lightGrey_10,
	},
	icon: {
		color: colors.background.black_20,
	},
	checkedIcon: {
		color: colors.background.black_100,
	},
});
