import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { colors } from "../assets/colors";

const TotalOrderList = ({ totalPrice, shippingFee, discount }) => {
	const totalProductList = [
		{
			title: "Thành tiền:",
			price: totalPrice,
		},
		{
			title: "Phí giao hàng:",
			price: shippingFee,
		},
		{
			title: "Chiết khấu:",
			price: discount,
		},
	];

	const renderItem = () => {
		return totalProductList.map((item, index) => (
			<View style={styles.itemContainer} key={index}>
				<Text style={styles.title}>{item.title}</Text>
				<Text style={styles.price}>
					{item.price.toLocaleString("vi-VN", {
						style: "currency",
						currency: "VND",
					})}
				</Text>
			</View>
		));
	};
	return <View style={styles.container}>{renderItem()}</View>;
};

export default TotalOrderList;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.background.lightGrey_10,
		padding: "5%",
		borderRadius: 10,
	},
	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: "2%",
	},
	itemContent: {
		flexDirection: "column",
		flex: 1,
		marginRight: "10%",
	},
	title: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
		lineHeight: 20,
	},
	price: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
});
