import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import OrderDetails from "./OrderDetails";
import { colors } from "../assets/colors";
import { useNavigation } from "@react-navigation/native";

const OrderItem = ({ orders, userData, onOrderStateChange, users }) => {
	const navigation = useNavigation();
	const [orderState, setOrderState] = useState(parseInt(orders.orderState));

	const getUserImage = (userId) => {
		const user = users.find((user) => user.id === userId);
		return user.userImage;
	};

	const renderOrderDetails = () => {
		return orders.productOrders.map((item, index) => (
			<Pressable
				key={index}
				onLongPress={() => handleLongPress(index)}
				style={styles.orderItem}
			>
				<OrderDetails
					name={item.name}
					price={formatCurrency(item.totalPrice)}
					quantity={item.productQuantity}
					image={item.front}
				/>
			</Pressable>
		));
	};

	const handleLongPress = (index) => {
		if (parseInt(orderState) === 3) {
			return;
		}

		const updatedState = Math.min(parseInt(orderState) + 1, 3);
		setOrderState(updatedState.toString());

		onOrderStateChange(orders.orderId, updatedState.toString());
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const renderOrderStatusIcon = () => {
		if (orderState === 3) {
			return (
				<Ionicons
					name="checkmark-circle-outline"
					size={24}
					color={colors.text.black_100}
				/>
			);
		}
		if (orderState === 2) {
			return (
				<Ionicons name="car-outline" size={24} color={colors.text.black_100} />
			);
		}
		if (orderState === 1) {
			return (
				<Ionicons
					name="infinite-outline"
					size={24}
					color={colors.text.black_100}
				/>
			);
		}
	};

	const renderOrderStatusLabel = () => {
		if (orderState === 3) {
			return "Hoàn thành";
		}
		if (orderState === 2) {
			return "Đang giao";
		}
		if (orderState === 1) {
			return "Chờ xác nhận";
		}
	};

	const handleBuyAgain = () => {
		const cartOrders = orders.productOrders.map((item) => ({
			productId: item.productId,
			name: item.productName,
			totalPrice: item.totalPrice,
			price: item.productPrice,
			description: "",
			size: item.productSize,
			color: item.productColor,
			front: item.productImageFront,
			back: item.productImageBack,
			productMaterial: item.productMaterial,
			productPrint: item.productPrint,
			quantity: item.productQuantity,
			userId: "",
			isUploadToStorage: false,
		}));
		console.log("cartOrders: ", cartOrders);
		navigation.navigate("OrderConfirmationScreen", {
			cartOrders: cartOrders,
		});
	};

	return (
		<View style={styles.orderContainer}>
			<View style={styles.header}>
				<View style={styles.userInfo}>
					<View style={styles.imageContainer}>
						<Image source={{ uri: userData.userImage }} style={styles.image} />
					</View>
					<Text style={styles.infoText}>{userData?.name}</Text>
				</View>
				<View style={styles.orderStatus}>
					{renderOrderStatusIcon()}
					<Text style={styles.infoText}>{renderOrderStatusLabel()}</Text>
				</View>
			</View>
			<View style={styles.main}>{renderOrderDetails()}</View>
			<View style={styles.totalAmountContainer}>
				<View style={{ flexDirection: "row" }}>
					<Text style={styles.totalAmountLabel}>Tổng tiền:</Text>
					<Text style={styles.totalAmountValue}>
						{orders.totalAmount.toLocaleString("vi-VN", {
							style: "currency",
							currency: "VND",
						})}
					</Text>
				</View>
				{/* <Pressable
                    style={styles.buyAgainButton}
                    onPress={handleBuyAgain}
                >
                    <Text style={styles.buyAgainButtonText}>Mua lại</Text>
                </Pressable> */}
			</View>
		</View>
	);
};

const mapStateToProps = (state) => ({
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(OrderItem);

const styles = StyleSheet.create({
	orderContainer: {
		borderWidth: 1,
		borderColor: colors.background.black_20,
		padding: "4%",
		marginHorizontal: "5%",
		marginVertical: "3%",
		borderRadius: 8,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	userInfo: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	imageContainer: {
		width: 24,
		height: 24,
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
		aspectRatio: 1,
		borderRadius: 100,
	},
	infoText: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
		marginLeft: "5%",
	},
	orderStatus: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	main: {
		flexDirection: "column",
		marginTop: "5%",
	},
	totalAmountContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "5%",
	},
	totalAmountLabel: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
		marginRight: "5%",
	},
	totalAmountValue: {
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
	},
	buyAgainButton: {
		backgroundColor: colors.background.black_100,
		padding: "2%",
		borderRadius: 5,
	},
	buyAgainButtonText: {
		color: colors.text.white_100,
		fontSize: 12,
		fontFamily: "helvetica-neue-bold",
	},
});
