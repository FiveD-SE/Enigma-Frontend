import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const Chevron = ({ open }) => {
	const iconStyle = {
		transform: [{ rotate: open ? "90deg" : "0deg" }],
	};

	return (
		<View style={styles.container}>
			<Ionicons
				name="chevron-forward"
				size={24}
				style={[iconStyle, open && styles.openIcon]}
			/>
		</View>
	);
};

export default Chevron;

const styles = StyleSheet.create({
	container: {},
	openIcon: {
		color: colors.background.white_100,
	},
});
