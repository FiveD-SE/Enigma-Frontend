import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../assets/colors";
import CropIcon from "../assets/svgs/CropIcon";
import RemoveBackgroundIcon from "../assets/svgs/RemoveBackgroundIcon";

const ToolButton = ({ iconName, label, selected, onPress }) => {

	const handleIcon = (iconName) => {
		if (iconName === "crop") {
			return <CropIcon width={40} height={40} />;
		} else {
			return <RemoveBackgroundIcon width={40} height={40} />
		}
	}
	return (
		<View style={styles.toolsButtonContainer}>
			<Pressable style={styles.toolsButton} onPress={onPress}>
				{handleIcon(iconName)}
				<Text
					style={styles.toolsText}
				>
					{label}
				</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	toolsButtonContainer: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: "5%"
	},
	toolsButton: {
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: "10%",
		marginBottom: "5%",
		borderWidth: 1,
		borderRadius: 8,
		borderColor: colors.background.black_20,
	},
	toolsText: {
		marginTop: "7%",
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-medium",
		textAlign: "center",
	},
	selectedToolsButton: {
		backgroundColor: colors.background.black_100,
		marginTop: "10%",
		padding: "2%",
		borderRadius: 5,
	},
	selectedToolsText: {
		color: colors.text.white_100,
	},
});

export default ToolButton;
