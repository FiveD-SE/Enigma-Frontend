import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { Linking } from "react-native";
import { colors } from "../assets/colors";

const Hyperlink = ({ url, children }) => {
	const handlePress = () => {
		Linking.openURL(url);
	};

	return (
		<Pressable onPress={handlePress} style={{ flex: 1 }}>
			<Text>
				<Text style={styles.helperText}>Tôi đồng ý với tất cả {"  "}</Text>
				<Text style={styles.link}>{children}</Text>
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	link: {
		color: colors.text.main,
		fontSize: 16,
		lineHeight: 24,
		fontFamily: "helvetica-neue-medium",
		textDecorationLine: "underline",
	},
	helperText: {
		color: colors.text.main,
		fontFamily: "helvetica-neue-regular",
		fontSize: 16,
		lineHeight: 24,
	},
});

export default Hyperlink;
