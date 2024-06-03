import React, { useRef } from "react";
import {
	View,
	Text,
	Image,
	Pressable,
	StyleSheet,
	Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";

import { colors } from "../assets/colors";

const OrderItemCard = ({
	name,
	price,
	size,
	color,
	quantity,
	image,
	imageFront,
	imageBack,
	handleIncreaseQuantity,
	handleDecreaseQuantity,
}) => {
	const scaleDecrease = useRef(new Animated.Value(1)).current;
	const scaleIncrease = useRef(new Animated.Value(1)).current;

	const handlePressIn = (scale) => {
		Animated.spring(scale, {
			toValue: 0.8,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = (scale) => {
		Animated.spring(scale, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={{ uri: imageFront }} />
				</View>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={{ uri: imageBack }} />
				</View>
				<View style={styles.content}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{name}</Text>
					</View>
					<View style={styles.priceContainer}>
						<Text style={styles.price}>{price}</Text>
					</View>
					<View style={styles.optionsContainer}>
						{size !== "None" && (
							<Text style={styles.optionText}>size {size}, </Text>
						)}
						<Text style={styles.optionText}>màu {color}</Text>
					</View>
				</View>
				<View style={styles.adjustQuantity}>
					<Animated.View style={{ transform: [{ scale: scaleIncrease }] }}>
						<Pressable
							onPressIn={() => handlePressIn(scaleIncrease)}
							onPressOut={() => handlePressOut(scaleIncrease)}
							onPress={handleIncreaseQuantity}
						>
							<Ionicons
								name="add-sharp"
								size={20}
								color={colors.text.black_50}
							/>
						</Pressable>
					</Animated.View>
					<View style={styles.quantityContainer}>
						<Text style={styles.quantityText}>{quantity}</Text>
					</View>
					<Animated.View style={{ transform: [{ scale: scaleDecrease }] }}>
						<Pressable
							onPressIn={() => handlePressIn(scaleDecrease)}
							onPressOut={() => handlePressOut(scaleDecrease)}
							onPress={handleDecreaseQuantity}
						>
							<Ionicons
								name="remove-sharp"
								size={20}
								color={colors.text.black_50}
							/>
						</Pressable>
					</Animated.View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: "4%",
	},
	card: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		padding: "4%",
		backgroundColor: colors.background.white_100,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.background.black_20,
	},
	imageContainer: {
		width: 70,
		height: 70,
		marginHorizontal: "1%",
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
		resizeMode: "stretch",
	},
	content: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		marginLeft: "2%",
	},
	titleContainer: {
		flex: 1,
	},
	title: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
	},
	priceContainer: {
		flex: 1,
	},
	price: {
		color: colors.text.grey_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
		lineHeight: 20,
	},
	optionsContainer: {
		flex: 1,
		flexDirection: "row",
	},
	optionText: {
		color: colors.text.grey_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
	adjustQuantity: {
		height: "100%",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "2%",
		backgroundColor: colors.background.lightGrey_10,
		borderRadius: 5,
		borderColor: colors.background.black_20,
		borderWidth: 1,
	},
	quantityContainer: {},
	quantityText: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
		lineHeight: 20,
	},
});

const mapStateToProps = (state) => ({
	product: state.user.product,
});

export default connect(mapStateToProps)(OrderItemCard);
