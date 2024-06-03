import { StyleSheet, Text, Pressable, Animated } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const CustomIconButton = ({ text, iconName, onPress }) => {
	const scaleValue = React.useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleValue, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleValue, {
			toValue: 1,
			friction: 3,
			tension: 40,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Pressable
			style={{ width: "100%" }}
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			<Animated.View
				style={[
					styles.customButton,
					{
						transform: [{ scale: scaleValue }],
					},
				]}
			>
				<Text style={styles.customButtonText}>{text}</Text>
				{iconName && (
					<Ionicons
						name={iconName}
						size={24}
						color={colors.accent.lightGrey_100}
					/>
				)}
			</Animated.View>
		</Pressable>
	);
};

export default CustomIconButton;

const styles = StyleSheet.create({
	customButton: {
		backgroundColor: colors.background.lightGrey_10,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 8,
		marginTop: "2%",
		paddingVertical: "4%",
		elevation: 1,
		shadowColor: colors.background.lightGrey_10,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowRadius: 10,
		shadowOpacity: 0.3,
		borderColor: colors.accent.lightGrey_100,
		borderWidth: 1,
	},
	customButtonText: {
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-heavy",
		fontSize: 16,
		lineHeight: 24,
		marginRight: "4%",
	},
});
