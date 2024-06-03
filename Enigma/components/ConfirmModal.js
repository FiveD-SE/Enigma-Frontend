import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const ConfirmModal = ({ visible, onClose, renderMissingOption }) => {
	return (
		<Modal
			animationType="none"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.title}>Vui lòng chọn đầy đủ các tuỳ chọn</Text>

					<View style={styles.infoContainer}>
						<Ionicons
							name="alert-circle-outline"
							size={20}
							color={colors.error}
						/>
						<Text style={styles.infoText}>{renderMissingOption()}</Text>
					</View>
					<View style={styles.modalConfirmButtonContainer}>
						<Pressable onPress={onClose} style={styles.modalConfirmButton}>
							<Text style={styles.buttonText}>Xác nhận</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default ConfirmModal;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.text.black_50,
		padding: "5%",
	},
	modalContent: {
		backgroundColor: colors.background.white_100,
		padding: "5%",
		borderRadius: 10,
	},
	title: {
		fontSize: 14,
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-bold",
		lineHeight: 20,
		textTransform: "uppercase",
	},
	infoContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: "5%",
	},
	infoText: {
		marginLeft: "5%",
		fontSize: 14,
		lineHeight: 20,
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-medium",
	},
	modalConfirmButtonContainer: {
		flexDirection: "row",
		marginTop: "5%",
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
	modalConfirmButton: {
		backgroundColor: colors.background.black_100,
		padding: "4%",
		borderRadius: 5,
		marginLeft: "2%",
	},
	buttonText: {
		color: colors.text.white_100,
		fontSize: 12,
		fontFamily: "helvetica-neue-bold",
	},
});
