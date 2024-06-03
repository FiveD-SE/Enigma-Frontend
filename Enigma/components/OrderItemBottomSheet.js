import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import { colors } from "../assets/colors";
import { useIsOpen } from "../utils/IsOpenContext";
import {
	saveProductOrder,
	saveProductPrice,
} from "../redux/actions/userActions";
import CustomButton from "./CustomButton";
import OrderItemCard from "./OrderItemCard";
import BottomSheet from "./BottomSheet";

const OrderItemBottomSheet = ({
	bottomSheetRef,
	snapPoints,
	product,
	isVisible,
	onClose,
	saveProductOrder,
	saveProductPrice,
}) => {
	const navigation = useNavigation();
	const { setIsOpen } = useIsOpen();
	const [productOrder, setProductOrder] = useState(product);
	const [quantity, setQuantity] = useState(1);
	const [totalPrice, setTotalPrice] = useState(product.price);
	const [showMaterial, setShowMaterial] = useState(
		product.price ? false : true
	);
	const [showPrint, setShowPrint] = useState(product.price ? false : true);

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

	const handleClose = () => {
		onClose();
	};

	const handleIncreaseQuantity = () => {
		setQuantity(quantity + 1);
	};

	const handleDecreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const handleConfirm = () => {
		const updatedProductOrder = {
			...productOrder,
			price:
				product.productMaterial.materialPrice + product.productPrint.printPrice,
			quantity: quantity,
			totalPrice: totalPrice,
		};
		saveProductOrder(productOrder);
		navigation.navigate("OrderConfirmationScreen", {
			productOrders: updatedProductOrder,
		});
	};

	const renderMaterialPrice = () => {
		if (showMaterial) {
			return (
				<View style={styles.totalPriceContainer}>
					<Text style={styles.optionLabel}>Giá chất liệu:</Text>
					<Text style={styles.optionPrice}>
						+ {formatCurrency(product.productMaterial.materialPrice)}
					</Text>
				</View>
			);
		}
	};

	const renderPrintPrice = () => {
		if (showPrint) {
			return (
				<View style={styles.totalPriceContainer}>
					<Text style={styles.optionLabel}>Giá cách thức in:</Text>
					<Text style={styles.optionPrice}>
						+ {formatCurrency(product.productPrint.printPrice)}
					</Text>
				</View>
			);
		}
	};

	useEffect(() => {
		if (product.price) {
			setTotalPrice(product.price * quantity);
		} else {
			setTotalPrice(
				(product.productMaterial.materialPrice +
					product.productPrint.printPrice) *
					quantity
			);
		}
	}, [product.price, quantity]);

	return (
		<BottomSheet
			bottomSheetRef={bottomSheetRef}
			snapPoints={snapPoints}
			setIsOpen={setIsOpen}
			isVisible={isVisible}
			onClose={handleClose}
		>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Đơn hàng</Text>
			</View>
			<View style={styles.container}>
				<View style={styles.main}>
					<OrderItemCard
						name={product.name}
						price={formatCurrency(
							product.price
								? product.price
								: product.productMaterial.materialPrice +
										product.productPrint.printPrice
						)}
						size={product.size}
						color={formatColor(product.color)}
						imageFront={product.front}
						imageBack={product.back}
						quantity={quantity}
						handleIncreaseQuantity={handleIncreaseQuantity}
						handleDecreaseQuantity={handleDecreaseQuantity}
					/>
				</View>
			</View>
			<View style={styles.footer}>
				{renderMaterialPrice()}
				{renderPrintPrice()}
				<View style={styles.totalPriceContainer}>
					<Text style={styles.label}>Tổng cộng:</Text>
					<Text style={styles.price}>{formatCurrency(totalPrice)}</Text>
				</View>
				<CustomButton text="Xác nhận" onPress={handleConfirm} />
			</View>
		</BottomSheet>
	);
};

const mapDispatchToProps = {
	saveProductOrder,
	saveProductPrice,
};

export default connect(null, mapDispatchToProps)(OrderItemBottomSheet);

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: colors.background.transparent,
	},
	main: {
		flex: 0.5,
		padding: "5%",
	},
	header: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.white_100,
		paddingBottom: "2%",
		borderBottomWidth: 1,
		borderBottomColor: colors.background.black_20,
	},
	headerTitle: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
	},
	footer: {
		backgroundColor: colors.background.white_100,
		borderTopColor: colors.background.black_20,
		borderTopWidth: 1,
		paddingHorizontal: "5%",
		paddingVertical: "5%",
		marginBottom: "5%",
	},
	totalPriceContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
	},
	price: {
		color: colors.text.black_100,
		fontSize: 20,
		fontFamily: "helvetica-neue-bold",
	},
	optionLabel: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
	optionPrice: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
	},
});
