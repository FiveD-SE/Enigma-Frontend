import React, { useRef } from "react";
import {
	Dimensions,
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

const cardWidth = (Dimensions.get("window").width - 20) / 2 - 10;

const PostCard = ({
	userName,
	productName,
	totalLikes,
	onLikePress,
	onBuyPress,
	userImage,
	postImage,
	onItemPress,
	liked,
}) => {
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
			<View style={styles.header}>
				<View style={styles.avatarContainer}>
					<Image
						source={{ uri: userImage }}
						style={styles.userAvatar}
						resizeMode="cover"
					/>
				</View>
				<Text style={styles.userName}>{userName}</Text>
			</View>
			<Pressable style={styles.imageContainer} onPress={onItemPress}>
				<Image
					source={{ uri: postImage }}
					style={styles.postImage}
					resizeMode="cover"
				/>
			</Pressable>
			<View style={styles.actionsRow}>
				<Text numberOfLines={1} style={styles.postName}>
					{productName}
				</Text>
			</View>
			<View style={styles.actionsRow}>
				<View style={styles.likeContainer}>
					<TouchableOpacity
						style={{
							transform: [{ scale: scaleValue }],
						}}
						onPress={onLikePress}
						activeOpacity={0.5}
					>
						<Ionicons
							name={liked ? "heart" : "heart-outline"}
							size={24}
							color={liked ? colors.accent.heart : "black"}
						/>
					</TouchableOpacity>
					<Text style={styles.likesText}>{totalLikes}</Text>
				</View>
				<Animated.View
					style={[
						styles.buyButton,
						{
							transform: [{ scale: scaleValue }],
						},
					]}
				>
					<Pressable
						onPress={onBuyPress}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
					>
						<Text style={styles.buyButtonText}>Mua</Text>
					</Pressable>
				</Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: "2%",
		width: cardWidth,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatarContainer: {
		width: 24,
		height: 24,
		justifyContent: "center",
		alignItems: "center",
		marginRight: "5%",
	},
	userAvatar: {
		width: "100%",
		height: "100%",
		borderRadius: 100,
		aspectRatio: 1,
	},
	userName: {
		fontFamily: "helvetica-neue-bold",
		fontSize: 12,
	},
	imageContainer: {
		marginTop: "5%",
		borderRadius: 10,
		overflow: "hidden",
		maxHeight: 200,
		maxWidth: 200,
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
		paddingVertical: "2%",
		paddingHorizontal: "5%",
		borderRadius: 8,
		flexDirection: "row",
		alignItems: "center",
		marginRight: "5%",
		backgroundColor: colors.background.lightGrey_10,
	},
	likesText: {
		color: colors.text.grey_100,
		fontFamily: "helvetica-neue-medium",
		fontSize: 14,
		lineHeight: 20,
		marginLeft: "10%",
	},
	buyButton: {
		flex: 1,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background.black_100,
		elevation: 2,
	},
	buyButtonText: {
		color: "#FFFFFF",
		fontFamily: "helvetica-neue-bold",
		fontSize: 14,
	},
	postName: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
	postName: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
});

export default PostCard;
