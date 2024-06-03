import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../assets/colors";
import ItemCard from "./ItemCard";
import CustomButton from "./CustomButton";
import { db } from "../services/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import RequestDeleteButton from "./RequestDeleteButton";

const EditItemDetail = ({ route }) => {
	const item = route.params;
	const [updatedItem, setUpdatedItem] = useState(item);
	const navigation = useNavigation();
	const [isValidProductName, setIsValidProductName] = useState(true);
	const [isValidProductDescription, setIsValidProductDescription] =
		useState(true);
	const [isValidPrice, setIsValidPrice] = useState(true);
	const [lowerBound, setLowerBound] = useState(0);
	const [upperBound, setUpperBound] = useState(0);
	const updateItem = async () => {
		if (!isValidPrice || !isValidProductName || !isValidProductDescription) {
			Toast.show({
				type: "error",
				text1: "Vui lòng điền thông tin sản phẩm hợp lệ",
				text2: "",
				text1Style: {
					fontSize: 14,
					fontFamily: "helvetica-neue-bold",
					color: colors.text.black_100,
				},
				text2Style: {
					fontSize: 12,
					fontFamily: "helvetica-neue-bold",
					color: colors.text.black_50,
				},
			});
			return;
		} else {
			const itemRef = doc(db, "products", item.id);
			await updateDoc(itemRef, updatedItem);
			Toast.show({
				type: "success",
				text1: "Thành công",
				text2: "Cập nhật thông tin sản phẩm thành công.",
			});
			navigation.goBack();
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const handleProductNameChange = (value) => {
		if (value.length >= 3) {
			setUpdatedItem((prevItem) => ({ ...prevItem, productName: value }));
			setIsValidProductName(true);
		} else {
			setUpdatedItem((prevItem) => ({ ...prevItem, productName: value }));
			setIsValidProductName(false);
		}
	};

	const handleProductDescriptionChange = (value) => {
		if (value.length >= 10) {
			setUpdatedItem((prevItem) => ({
				...prevItem,
				productDescription: value,
			}));
			setIsValidProductDescription(true);
		} else {
			setUpdatedItem((prevItem) => ({
				...prevItem,
				productDescription: value,
			}));
			setIsValidProductDescription(false);
		}
	};

	const handleProductPriceChange = (value) => {
		if (!isNaN(value) && value >= lowerBound && value <= upperBound) {
			setUpdatedItem((prevItem) => ({ ...prevItem, productPrice: value }));
			setIsValidPrice(true);
		} else {
			setIsValidPrice(false);
		}
	};

	useEffect(() => {
		// Calculate and set lower and upper bounds when product changes
		const calculateBounds = () => {
			const lower =
				updatedItem.productMaterial.materialPrice +
				updatedItem.productPrint.printPrice;
			setLowerBound(lower);
			setUpperBound(lower * 1.5);
		};

		calculateBounds();
	}, [item]);
	console.log("UPDATED ITEM: ", updatedItem);

	const handleDeleteProduct = async () => {
		Alert.alert(
			"Xác nhận xóa sản phẩm",
			"Bạn có chắc chắn muốn xóa sản phẩm này không?",
			[
				{
					text: "Hủy",
					style: "cancel",
				},
				{
					text: "Đồng ý",
					style: "destructive",
					onPress: async () => {
						try {
							await deleteDoc(
								doc(db, "products", item.productId)
							);
							Toast.show({
								type: "success",
								text1: "Thành công",
								text2: "Đã xóa sản phẩm",
							});
							navigation.goBack();
						} catch (error) {
							console.log("Error deleting product:", error);
							Toast.show({
								type: "error",
								text1: "Lỗi",
								text2: "Đã xảy ra lỗi khi xóa sản phẩm",
							});
						}
					},
				},
			],
			{ cancelable: false }
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.scrollViewContent}>
			<View style={styles.container}>
				<View style={styles.imageContainer}>
					<Image
						source={{ uri: updatedItem.imageFront }}
						style={styles.mainImage}
					/>
				</View>
				<View style={styles.mainContentContainer}>
					<ItemCard
						title="Tên sản phẩm"
						description={updatedItem.productName}
						canEdit={true}
						onChange={handleProductNameChange}
					/>
					<ItemCard
						title="Mô tả"
						description={updatedItem.productDescription}
						canEdit={true}
						onChange={handleProductDescriptionChange}
					/>
					<ItemCard
						title="Giá"
						description={updatedItem.productPrice}
						canEdit={true}
						onChange={handleProductPriceChange}
					/>
					<Text style={styles.label}>
						<Text style={[styles.label, { color: colors.error }]}>*</Text> Giá
						bán dao động từ {formatCurrency(lowerBound)} ~{" "}
						{formatCurrency(upperBound)}
					</Text>
				</View>
				<View style={styles.actionsContainer}>
					<View style={{ marginTop: "3%" }}>
						<RequestDeleteButton
							text={"Xoá sản phẩm"}
							onPress={handleDeleteProduct}
						/>
					</View>
					<CustomButton text="Lưu thay đổi" onPress={updateItem} />
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollViewContent: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		flexGrow: 1,
		backgroundColor: "transparent",
	},
	imageContainer: {
		height: 360,
	},
	mainImage: {
		width: "100%",
		height: "100%",
	},
	mainContentContainer: {
		flex: 1,
		backgroundColor: colors.background.white_100,
		padding: "5%",
	},
	actionsContainer: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: colors.background.white_100,
		borderColor: colors.background.black_20,
		borderTopWidth: 1,
		paddingHorizontal: "5%",
		paddingBottom: "10%",
	},
	deleteButtonContainer: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: colors.background.white_100,

		paddingHorizontal: "5%",
		paddingBottom: "10%",
	},
	label: {
		color: colors.text.black_50,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
	},
});

export default EditItemDetail;
