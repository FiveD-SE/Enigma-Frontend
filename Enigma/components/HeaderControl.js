import { Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default HeaderControl = ({ onCapture }) => {
	const handleConfirm = async () => {
		onCapture();
	};

	return (
		<>
			<Pressable
				hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
				onPress={handleConfirm}
			>
				<Ionicons name="checkmark" size={24} />
			</Pressable>
		</>
	);
};
