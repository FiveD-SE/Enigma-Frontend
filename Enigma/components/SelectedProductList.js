import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { colors } from "../assets/colors";

const SelectedProductList = ({ orderList }) => {
	//console.log("SelectedProductList: ", orderList);
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

	const renderSelectedProductItem = () => {
		return orderList.map((item, index) => {
			return (
				<View style={styles.itemContainer} key={index}>
					<View style={styles.itemContent}>
						<View>
							<Text style={styles.title}>{item.name}</Text>
						</View>
						<Text
							style={styles.subtitle}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							Size {item.size}, màu {formatColor(item.color)}
						</Text>

						<Text
							style={styles.subtitle}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{item.productMaterial.materialName}, {item.productPrint.printName}
						</Text>
						<Text
							style={styles.subtitle}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							Số lượng: {item.quantity}
						</Text>
					</View>
					<Text style={styles.price}>{formatCurrency(item.totalPrice)}</Text>
				</View>
			);
		});
	};

	return <View style={styles.container}>{renderSelectedProductItem()}</View>;
};

export default SelectedProductList;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.background.lightGrey_10,
		padding: "4%",
		borderRadius: 8,
	},
	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: "2%",
	},
	itemContent: {
		flex: 1,
		flexDirection: "column",
		marginRight: "10%",
		marginLeft: "5%",
	},
	title: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
		lineHeight: 24,
	},
	subtitle: {
		color: colors.text.black_50,
		fontSize: 14,
		lineHeight: 20,
		fontFamily: "helvetica-neue-regular",
		marginTop: "2%",
	},
	price: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
});
