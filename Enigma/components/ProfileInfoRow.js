import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import React from "react";
import { colors } from "../assets/colors";

const ProfileInfoRow = ({
	label,
	value,
	enableEdit,
	editMode,
	keyboardNumber,
	onChangeText
}) => (
	<View style={styles.infoRow}>
		<Text style={styles.label}>{label}</Text>
		{editMode ? (
			<View style={styles.inputContainer}>
				<TextInput
					placeholder={value}
					placeholderTextColor={{ color: label === "Email:" ? colors.text.grey_100 : colors.text.black_100 }}
					readOnly={!enableEdit}
					keyboardType={keyboardNumber ? "phone-pad" : "default"}
					onChangeText={onChangeText}
					value={value}
				/>
			</View>
		) : (
			<Text style={styles.value}>{value}</Text>
		)}
	</View>
);

export default ProfileInfoRow;

const styles = StyleSheet.create({
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	label: {
		flex: 0.5,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
	value: {
		flex: 1,
		fontSize: 14,
		fontFamily: "helvetica-neue-regular",
	},
	inputContainer: {
		flex: 1,
		borderWidth: 1,
		borderColor: colors.background.black_20,
		padding: "2%",
		borderRadius: 5,
	},
});
