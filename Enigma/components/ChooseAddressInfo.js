import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const ChooseAddressInfo = ({
	name,
	phoneNumber,
	address,
	isChecked,
	onPress,
}) => {
	return (
		<View style={styles.container}>
			<Pressable onPress={onPress}>
				<MaterialIcons
					name={isChecked ? "radio-button-checked" : "radio-button-unchecked"}
					size={24}
					color={[styles.icon, isChecked && styles.checkedIcon]}
				/>
			</Pressable>
			<View style={styles.contentContainer}>
				<View style={styles.header}>
					<View style={styles.profileInfoContainer}>
						<Text style={styles.profileInfo}>{name}</Text>
						<Text style={styles.divider}>|</Text>
						<Text style={[styles.profileInfo, { letterSpacing: 1 }]}>
							{phoneNumber}
						</Text>
					</View>
				</View>
				<View style={styles.addressInfoContainer}>
					<Text style={styles.addressInfo}>{address}</Text>
				</View>
			</View>
		</View>
	);
};

export default ChooseAddressInfo;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: "5%",
	},
	contentContainer: {
		flexDirection: "column",
		marginHorizontal: "5%",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	profileInfoContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	profileInfo: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
	},
	divider: {
		color: colors.text.grey_100,
		opacity: 0.5,
		marginHorizontal: "2%",
	},
	addressInfoContainer: {
		marginTop: "2%",
	},
	addressInfo: {
		color: colors.text.black_50,
		fontSize: 12,
		lineHeight: 16,
		fontFamily: "helvetica-neue-medium",
	},
	defaultButton: {
		backgroundColor: colors.background.black_100,
		padding: "2%",
		alignSelf: "flex-start",
		borderRadius: 5,
		marginTop: "4%",
		alignItems: "center",
	},
	defaultText: {
		color: colors.text.white_100,
		fontSize: 12,
		fontFamily: "helvetica-neue-medium",
	},
	setDefaultButton: {
		backgroundColor: colors.background.white_100,
		borderColor: colors.background.black_20,
		borderWidth: 1,
		padding: "2%",
		alignSelf: "flex-start",
		borderRadius: 5,
		marginTop: "4%",
		alignItems: "center",
	},
	setDefaultText: {
		color: colors.text.black_100,
		fontSize: 12,
		fontFamily: "helvetica-neue-medium",
	},
	icon: {
		color: colors.background.black_20,
	},
	checkedIcon: {
		color: colors.background.black_100,
	},
});
