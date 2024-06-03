import React, { useRef } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../assets/colors";

const FavoriteCard = ({
	userName,
	userImage,
	postName,
	postPrice,
	totalLikes,
	postImage,
	onPress,
	onLikedPress,
	liked,
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
					source={{
						uri: postImage,
					}}
					style={styles.postImage}
					resizeMode="cover"
				/>
			</Pressable>
			<View style={[styles.actionsRow, { justifyContent: "space-between" }]}>
				<Text numberOfLines={1} style={styles.postName}>
					{postName}
				</Text>
				<Text style={styles.postPrice}>{formatCurrency(postPrice)}</Text>
			</View>
			<View style={[styles.actionsRow, { alignItems: "center" }]}>
				<View style={{ flexDirection: "row" }}>
					<Text numberOfLines={1} style={styles.userName}>
						Tạo bởi {userName}
					</Text>
				</View>
				<TouchableOpacity
					onPress={onLikedPress}
					style={styles.likeContainer}
					activeOpacity={0.8}
				>
					<View style={{ flex: 1 }}>
						<Ionicons
							name={liked ? "heart" : "heart-outline"}
							size={24}
							color={liked ? colors.accent.heart : "black"}
						/>
					</View>
					<Text style={styles.likesText}>{totalLikes}</Text>
				</TouchableOpacity>
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
						<Text style={styles.editButtonText}>Mua</Text>
					</Pressable>
				</Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		maxWidth: "100%",
		margin: "2%",
	},
	imageContainer: {
		marginTop: "5%",
		borderRadius: 10,
		overflow: "hidden",
		maxHeight: 400,
	},
	postName: {
		color: colors.text.black_100,
		fontSize: 18,
		fontFamily: "helvetica-neue-medium",
	},
	postPrice: {
		color: colors.text.black_50,
		fontSize: 18,
		fontFamily: "helvetica-neue-medium",
	},
	userName: {
		color: colors.text.black_100,
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
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		marginStart: "15%",
		marginEnd: "5%",
		paddingVertical: "2%",
		paddingHorizontal: "5%",
		backgroundColor: colors.background.lightGrey_10,
		borderRadius: 8,
	},
	likesText: {
		color: colors.text.grey_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-medium",
		lineHeight: 20,
	},
	editButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.black_100,
		borderRadius: 5,
		padding: "2%",
		elevation: 2,
	},
	editButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
	},
});

export default FavoriteCard;
