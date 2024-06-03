import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { colors } from "../../assets/colors";

const OrderNotification = () => {
	const route = useRoute();
	const { notificationId } = route.params;
	const [notification, setNotification] = useState(null);

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	useEffect(() => {
		const fetchNotification = async () => {
			try {
				const docRef = doc(db, "notifications", notificationId);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setNotification(docSnap.data());
				} else {
					console.log("No such document!");
				}
			} catch (error) {
				console.error("Error fetching notification: ", error);
			}
		};

		if (notificationId) {
			fetchNotification();
		}
	}, [notificationId]);

	const renderProductItem = ({ item }) => (
		<View style={styles.productItem}>
			<Image
				source={{ uri: item.front }}
				style={{ width: 100, height: 100, borderRadius: 8 }}
			/>
			<View style={styles.productContent}>
				<Text style={styles.productTitle}>{item.name}</Text>
				<Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
				<Text style={styles.productPrice}>
					Đơn giá: {formatCurrency(item.price)}
				</Text>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{notification?.notificationTitle}</Text>
			<FlatList
				data={notification?.productOrders}
				keyExtractor={(item) => item.id}
				renderItem={renderProductItem}
			/>
		</View>
	);
};

export default OrderNotification;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
		padding: "5%",
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: "5%",
		color: colors.text.black,
		fontFamily: "helvetica-neue-bold",
		lineHeight: 24,
	},
	productItem: {
		borderWidth: 1,
		borderColor: colors.background.black_20,
		borderRadius: 10,
		marginBottom: "5%",
		padding: 10,
		flexDirection: "row",
	},
	productContent: {
		justifyContent: "space-between",
		marginLeft: "5%",
		padding: "2%",
	},
	productTitle: {
		fontSize: 16,
		lineHeight: 24,
		fontFamily: "helvetica-neue-bold",
	},
	productQuantity: {
		fontSize: 14,
		lineHeight: 20,
		fontFamily: "helvetica-neue-regular",
	},
	productPrice: {
		fontSize: 14,
		lineHeight: 20,
		fontFamily: "helvetica-neue-regular",
	},
});
