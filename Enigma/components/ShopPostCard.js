import React, { useRef } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
	Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../assets/colors";

const ShopPostCard = ({
	postName,
	postPrice,
	totalLikes,
	postImage,
	onPress,
}) => {
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const scaleValue = useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleValue, {
			toValue: 0.9,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleValue, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	return (
		<View style={styles.container}>
			<Pressable style={styles.imageContainer} onPress={onPress}>
				<Image
					source={{ uri: postImage }}
					style={styles.postImage}
					resizeMode="stretch"
				/>
			</Pressable>
			<View style={styles.actionsRow}>
				<Text numberOfLines={1} style={styles.postName}>
					{postName}
				</Text>
			</View>
			<View style={styles.actionsRow}>
				<Text style={styles.postPrice}>{formatCurrency(postPrice)}</Text>
			</View>
			<View style={styles.actionsRow}>
				<View style={styles.likeContainer}>
					<Ionicons name="heart" size={24} color={colors.accent.heart} />
					<Text style={styles.likesText}>{totalLikes}</Text>
				</View>
				<Animated.View
					style={[
						styles.editButton,
						{
							transform: [{ scale: scaleValue }],
						},
					]}
				>
					<Pressable
						onPress={onPress}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
					>
						<Text style={styles.editButtonText}>Chỉnh sửa</Text>
					</Pressable>
				</Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		maxWidth: 160,
		margin: "2%",
	},
	imageContainer: {
		marginTop: "5%",
		borderRadius: 10,
		overflow: "hidden",
		maxHeight: 150,
	},
	postName: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
	postPrice: {
		color: colors.text.black_50,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
	postImage: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
	},
	actionsRow: {
		flexDirection: "row",
		marginTop: "5%",
	},
	likeContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: "5%",
		paddingVertical: "2%",
		paddingHorizontal: "5%",
		borderRadius: 8,
	},
	likesText: {
		color: colors.text.grey_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
		lineHeight: 20,
		marginLeft: "10%",
	},
	editButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.black_100,
		borderRadius: 5,
		elevation: 2,
	},
	editButtonText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontFamily: "helvetica-neue-bold",
	},
});

export default ShopPostCard;
