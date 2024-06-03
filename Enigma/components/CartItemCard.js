import React, { useRef } from "react";
import {
	View,
	Text,
	Image,
	Pressable,
	StyleSheet,
	Animated,
} from "react-native";
import Checkbox from "expo-checkbox";
import { colors } from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";

const CartItemCard = ({
	isChecked,
	onChecked,
	item,
	handleDecrease,
	handleIncrease,
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

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const formatColor = (color) => {
		switch (color) {
			case "black":
				return "Đen";
			case "white":
				return "Trắng";
			case "beige":
				return "Be";
		}
	};

	return (
		<View style={styles.container}>
			<Checkbox
				style={styles.checkbox}
				value={isChecked}
				color={isChecked ? colors.background.black_100 : undefined}
				onValueChange={onChecked}
			/>
			<View style={styles.card}>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={{ uri: item.imageFront }} />
				</View>
				<View style={styles.content}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{item.productName}</Text>
					</View>
					<View style={styles.priceContainer}>
						<Text style={styles.price}>
							{formatCurrency(item.productPrice)}
						</Text>
					</View>
					<View style={styles.optionsContainer}>
						<Text style={styles.optionText}>Size {item.productSize}, </Text>
						<Text style={styles.optionText}>
							màu {formatColor(item.productColor)}
						</Text>
					</View>
					<View style={styles.adjustQuantity}>
						<Animated.View style={{ transform: [{ scale: scaleDecrease }] }}>
							<Pressable
								style={styles.decreaseButton}
								onPressIn={() => handlePressIn(scaleDecrease)}
								onPressOut={() => {
									handlePressOut(scaleDecrease);
									handleDecrease();
								}}
							>
								<Ionicons
									name="remove-sharp"
									size={20}
									color={colors.text.black_100}
								/>
							</Pressable>
						</Animated.View>
						<View style={styles.quantityContainer}>
							<Text style={styles.quantityText}>{item.productQuantity}</Text>
						</View>
						<Animated.View style={{ transform: [{ scale: scaleIncrease }] }}>
							<Pressable
								style={styles.increaseButton}
								onPressIn={() => handlePressIn(scaleIncrease)}
								onPressOut={() => {
									handlePressOut(scaleIncrease);
									handleIncrease();
								}}
							>
								<Ionicons
									name="add-sharp"
									size={20}
									color={colors.text.black_100}
								/>
							</Pressable>
						</Animated.View>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: "2%",
		marginHorizontal: "5%"
	},
	card: {
		flex: 1,
		padding: "3%",
		backgroundColor: colors.background.white_100,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.background.black_20,
		flexDirection: "row",
		alignItems: "center",
	},
	imageContainer: {
		width: 100,
		height: 100,
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
	},
	content: {
		flex: 1,
		marginLeft: "5%",
		flexDirection: "column",
		justifyContent: "space-between",
	},
	titleContainer: {
		flex: 1,
	},
	title: {
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-bold",
		fontSize: 16,
		lineHeight: 20,
	},
	priceContainer: {
		flex: 1,
	},
	price: {
		color: colors.text.grey_100,
		fontFamily: "helvetica-neue-medium",
		fontSize: 16,
		lineHeight: 20,
	},
	optionsContainer: {
		flex: 1,
		flexDirection: "row",
	},
	optionText: {
		color: colors.text.grey_100,
		fontFamily: "helvetica-neue-medium",
		fontSize: 12,
		lineHeight: 16,
	},
	adjustQuantity: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
	},
	decreaseButton: {
		padding: "2%",
		backgroundColor: colors.background.lightGrey_10,
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
		borderColor: colors.background.black_20,
		borderWidth: 0.2,
	},
	increaseButton: {
		padding: "2%",
		backgroundColor: colors.background.lightGrey_10,
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
		borderColor: colors.background.black_20,
		borderWidth: 0.2,
	},
	quantityContainer: {
		marginHorizontal: "10%",
	},
	quantityText: {
		color: colors.text.black_100,
		fontSize: 16,
		lineHeight: 20,
		fontFamily: "helvetica-neue-medium",
	},
	checkbox: {
		borderColor: colors.background.black_100,
		borderRadius: 4,
		marginRight: "5%",
	},
});

export default CartItemCard;
