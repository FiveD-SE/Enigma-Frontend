import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { colors } from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";

const ItemCard = ({ title, description, canEdit, onSelectSize, onChange }) => {
	const [inputValue, setInputValue] = useState(description);
	const [selectedSize, setSelectedSize] = useState(null);
	const [selectedColor, setSelectedColor] = useState("black");
	const sizeOptions = ["S", "M", "L", "XL"];
	const colorOptions = ["black", "white", "beige"];

	const renderDescriptionByTitle = () => {
		if (title === "Giá") {
			return formatCurrency(inputValue);
		}
		return inputValue;
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const handleSelectSize = (size) => {
		setSelectedSize(size);
		if (onSelectSize) {
			onSelectSize(size);
		}
	};

	const handleSelectColor = (color) => {
		setSelectedColor(color);
	};

	const renderSizeOptionButton = () => {
		return sizeOptions.map((item, index) => (
			<Pressable
				key={index}
				style={[
					styles.sizeOptionButton,
					selectedSize === item && styles.selectedSizeOption,
				]}
				onPress={() => handleSelectSize(item)}
			>
				<Text style={styles.sizeOptionButtonText}>{item}</Text>
			</Pressable>
		));
	};

	const renderColorOptionButton = () => {
		return colorOptions.map((item, index) => (
			<Pressable
				key={index}
				style={[styles.colorOptionButton, { backgroundColor: `${item}` }]}
				onPress={() => handleSelectColor(item)}
			>
				<Ionicons
					name="ellipse-sharp"
					color={selectedColor === item ? "#FFC567" : `${item}`}
					size={10}
				/>
			</Pressable>
		));
	};

	useEffect(() => {
		setInputValue(description);
	}, [description]);

	const handleInputChange = (text) => {
		setInputValue(text);
		if (onChange) {
			onChange(text);
		}
	};

	const renderContentByTitle = () => {
		if (title === "Màu sắc") {
			return (
				<View style={{ flexDirection: "row", marginTop: "2%" }}>
					{renderColorOptionButton()}
				</View>
			);
		} else if (title === "Kích cỡ") {
			return (
				<View style={{ flexDirection: "row", marginTop: "2%" }}>
					{renderSizeOptionButton()}
				</View>
			);
		} else {
			return canEdit ? (
				<TextInput
					style={styles.cardDescription}
					value={inputValue}
					onChangeText={handleInputChange}
					editable={canEdit}
					multiline
					keyboardType={title === "Giá" ? "decimal-pad" : "default"}
				/>
			) : (
				<Text style={styles.cardDescription}>{renderDescriptionByTitle()}</Text>
			);
		}
	};

	return (
		<View style={styles.cardContainer}>
			<Text style={styles.cardTitle}>{title}</Text>
			{renderContentByTitle()}
		</View>
	);
};

const styles = StyleSheet.create({
	cardContainer: {
		borderColor: colors.background.black_20,
		borderWidth: 1,
		backgroundColor: colors.background.white_100,
		paddingHorizontal: "5%",
		paddingVertical: "2%",
		borderRadius: 8,
		marginVertical: "2%",
	},
	cardTitle: {
		textTransform: "uppercase",
		color: colors.text.grey_100,
		fontFamily: "helvetica-neue-bold",
		fontSize: 12,
		lineHeight: 20,
	},
	cardDescription: {
		color: colors.text.black_100,
		marginTop: "2%",
		fontFamily: "helvetica-neue-bold",
		fontSize: 16,
		lineHeight: 28,
	},
	sizeOptionButton: {
		marginRight: "2%",
		paddingVertical: "3%",
		paddingHorizontal: "5%",
		borderColor: colors.background.black_20,
		borderWidth: 1,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.white_100,
	},
	sizeOptionButtonText: {
		fontSize: 14,
	},
	selectedSizeOption: {
		backgroundColor: colors.background.black_20,
	},
	colorOptionButton: {
		marginRight: "4%",
		paddingVertical: "4%",
		paddingHorizontal: "6%",
		borderColor: colors.background.black_20,
		borderWidth: 1,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ItemCard;
