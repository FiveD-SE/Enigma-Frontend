import React from "react";
import { Pressable, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AnimatedButton = ({
	iconName,
	buttonText,
	buttonStyle,
	textStyle,
	onPress,
}) => {
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
		<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
			<Pressable
				style={buttonStyle}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={onPress}
			>
				<Ionicons name={iconName} size={32} />
				<Text style={textStyle}>{buttonText}</Text>
			</Pressable>
		</Animated.View>
	);
};

export default AnimatedButton;
