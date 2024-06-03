import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
	collection,
	doc,
	getDocs,
	updateDoc,
	query,
	where,
} from "firebase/firestore";

import CustomButton from "../../components/CustomButton";
import Checkbox from "expo-checkbox";
import CartItemCard from "../../components/CartItemCard";
import { colors } from "../../assets/colors";
import { connect } from "react-redux";
import { db } from "../../services/firebase";
import { useNavigation } from "@react-navigation/native";

const CartScreen = ({ userData }) => {
	const navigation = useNavigation();
	const [totalPrice, setTotalPrice] = useState(0);
	const [isChecked, setChecked] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);

	useEffect(() => {
		const fetchCartItems = async () => {
			if (!userData || !userData.id) {
				console.error("User data is not available.");
				return;
			}

			const q = query(
				collection(db, "carts"),
				where("userId", "==", userData.id)
			);
			const querySnapshot = await getDocs(q);

			const userCartDoc = querySnapshot.docs[0];

			if (userCartDoc) {
				const cartData = userCartDoc.data();
				const cartItems = cartData.cartList;

				setCartItems(cartItems);
				setSelectedItems(Array(cartItems.length).fill(false));
				calculateTotalPrice(cartItems);
			} else {
				console.log("No cart found for the user.");
			}
		};

		fetchCartItems();
	}, [userData]);

	const handleChecked = () => {
		const newChecked = !isChecked;
		setChecked(newChecked);
		setSelectedItems(selectedItems.map(() => newChecked));
		calculateTotalPrice(
			cartItems,
			selectedItems.map(() => newChecked)
		);
	};

	const handleItemChecked = (index) => {
		const updatedSelectedItems = [...selectedItems];
		updatedSelectedItems[index] = !updatedSelectedItems[index];
		setChecked(updatedSelectedItems.every((item) => item));
		setSelectedItems(updatedSelectedItems);
		calculateTotalPrice(cartItems, updatedSelectedItems);
	};

	const handleDecrease = async (item) => {
		const updatedCartItems = [...cartItems];
		const index = updatedCartItems.findIndex(
			(cartItem) => cartItem.itemDetailId === item.itemDetailId
		);
		if (updatedCartItems[index].productQuantity === 1) {
			Alert.alert(
				"Xác nhận",
				"Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
				[
					{ text: "Không", style: "cancel" },
					{
						text: "Có",
						onPress: async () => {
							await removeItemFromFirestore(index);

							updatedCartItems.splice(index, 1);
							setCartItems(updatedCartItems);
							setSelectedItems(selectedItems.filter((_, i) => i !== index));
							calculateTotalPrice(
								updatedCartItems,
								selectedItems.filter((_, i) => i !== index)
							);
						},
					},
				]
			);
		} else {
			updatedCartItems[index].productQuantity -= 1;
			setCartItems(updatedCartItems);
			calculateTotalPrice(updatedCartItems, selectedItems);
			await updateQuantityInFirestore(
				item,
				updatedCartItems[index].productQuantity
			);
		}
	};

	const handleIncrease = async (item) => {
		const updatedCartItems = [...cartItems];
		const index = updatedCartItems.findIndex(
			(cartItem) => cartItem.itemDetailId === item.itemDetailId
		);

		updatedCartItems[index].productQuantity += 1;

		setCartItems(updatedCartItems);

		calculateTotalPrice(updatedCartItems, selectedItems);

		await updateQuantityInFirestore(
			item,
			updatedCartItems[index].productQuantity
		);
	};

	const updateQuantityInFirestore = async (item, newQuantity) => {
		try {
			const q = query(
				collection(db, "carts"),
				where("userId", "==", userData.id)
			);
			const querySnapshot = await getDocs(q);

			const userCartDoc = querySnapshot.docs[0];

			let cartItems = userCartDoc.data().cartList;

			let itemToUpdate = cartItems.find(
				(cartItem) => cartItem.itemDetailId === item.itemDetailId
			);

			if (itemToUpdate) {
				itemToUpdate.productQuantity = newQuantity;

				await updateDoc(doc(db, "carts", userCartDoc.id), {
					cartList: cartItems,
				});
			} else {
				console.error("Item not found in Firestore.");
			}
		} catch (error) {
			console.error("Error updating item quantity:", error);
		}
	};

	const removeItemFromFirestore = async (itemIndex) => {
		try {
			const q = query(
				collection(db, "carts"),
				where("userId", "==", userData.id)
			);
			const querySnapshot = await getDocs(q);

			const userCartDoc = querySnapshot.docs[0];

			const cartData = userCartDoc.data();

			const cartItems = cartData.cartList;

			cartItems.splice(itemIndex, 1);

			await updateDoc(doc(db, "carts", userCartDoc.id), {
				cartList: cartItems,
			});
		} catch (error) {
			console.error("Error removing item from cart in Firestore: ", error);
		}
	};

	const calculateTotalPrice = (items, selectedItemsStatus = selectedItems) => {
		const total = items.reduce(
			(sum, item, index) =>
				sum +
				(selectedItemsStatus[index]
					? item.productPrice * item.productQuantity
					: 0),
			0
		);
		setTotalPrice(total);
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const handleConfirm = () => {
		let checkedItems = cartItems.filter((_, index) => selectedItems[index]);
		checkedItems = checkedItems.map((item) => {
			const {
				productName,
				productDescription,
				productPrice,
				productSize,
				productColor,
				productQuantity,
				imageFront,
				imageBack,
				...rest
			} = item;
			return {
				name: productName,
				description: productDescription,
				price: productPrice,
				size: productSize,
				color: productColor,
				quantity: productQuantity,
				front: imageFront,
				back: imageBack,
				totalPrice: productPrice * productQuantity,
				...rest,
			};
		});
		navigation.navigate("OrderConfirmationScreen", {
			cartOrders: checkedItems,
			fromCartScreen: true
		});
	};

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: "row", padding: "5%" }}>
				<Checkbox
					style={styles.checkbox}
					value={isChecked}
					color={isChecked ? colors.background.black_100 : undefined}
					onValueChange={handleChecked}
				/>
				<Text
					style={{
						textTransform: "uppercase",
						color: colors.text.grey_100,
						fontFamily: "helvetica-neue-bold",
					}}
				>
					Chọn tất cả
				</Text>
			</View>
			<ScrollView style={styles.main}>
				{cartItems.map((item, index) => (
					<CartItemCard
						key={index}
						isChecked={selectedItems[index]}
						onChecked={() => handleItemChecked(index)}
						item={item}
						handleDecrease={() => handleDecrease(item)}
						handleIncrease={() => handleIncrease(item)}
					/>
				))}
			</ScrollView>
			<View style={styles.footer}>
				<View style={styles.totalPriceContainer}>
					<Text style={styles.labelText}>Tổng cộng:</Text>
					<Text style={styles.totalPriceText}>
						{formatCurrency(totalPrice)}
					</Text>
				</View>
				<CustomButton text="Xác nhận" onPress={handleConfirm} />
			</View>
		</View>
	);
};

const mapStateToProps = (state) => ({
	userData: state.auth.userData,
});

export default connect(mapStateToProps)(CartScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	checkbox: {
		borderColor: colors.background.black_100,
		borderRadius: 4,
		marginRight: "5%",
	},
	main: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	footer: {
		padding: "6%",
		backgroundColor: colors.background.white_100,
		borderColor: colors.background.black_20,
		borderTopWidth: 1,
	},
	totalPriceContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	labelText: {
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-bold",
		fontSize: 16,
		lineHeight: 20,
	},
	totalPriceText: {
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-bold",
		fontSize: 20,
		lineHeight: 24,
	},
});
