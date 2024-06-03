import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../assets/colors";
import ItemCard from "../../components/ItemCard";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { uploadImageToFirebase, db } from "../../services/firebase"; // Import the uploadImageToFirebase function
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"; // Import the Firestore functions
import {
	saveProductBack,
	saveProductDescription,
	saveProductFront,
	saveProductName,
	saveProductPrice,
	updateImageUri,
} from "../../redux/actions/userActions";
import Toast from "react-native-toast-message";

const UploadPostScreen = ({ product, userData }) => {
	const navigation = useNavigation();

	const [productName, setProductName] = useState("");
	const [productDescription, setProductDescription] = useState("");
	const [productPrice, setProductPrice] = useState(0);
	const [imageFront, setImageFront] = useState(null);
	const [imageBack, setImageBack] = useState(null);
	const [isValidProductName, setIsValidProductName] = useState(true);
	const [isValidProductDescription, setIsValidProductDescription] =
		useState(true);
	const [isValidPrice, setIsValidPrice] = useState(true);
	const [lowerBound, setLowerBound] = useState(0);
	const [upperBound, setUpperBound] = useState(0);
	const [badWords, setBadWords] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const generateRandomString = (length) => {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const fetchBadWords = async () => {
		try {
			const response = await fetch(
				"https://raw.githubusercontent.com/php1301/vn-fuck-words/master/bad_words.json"
			);
			const data = await response.json();
			setBadWords(Object.keys(data));
		} catch (error) {
			console.log("Error fetching bad words:", error);
		}
	};

	const handleNameChange = (value) => {
		if (!containsBadWord(value)) {
			setProductName(value);
			setIsValidProductName(true);
		} else {
			setProductName(value);
			setIsValidProductName(false);
		}
	};

	const handleDescriptionChange = (value) => {
		if (!containsBadWord(value)) {
			setProductDescription(value);
			setIsValidProductDescription(true);
		} else {
			setProductDescription(value);
			setIsValidProductDescription(false);
		}
	};

	const containsBadWord = (text) => {
		const lowerCaseText = text.toLowerCase();
		return badWords.some((word) => lowerCaseText.includes(word));
	};

	const handlePriceChange = (value) => {
		if (!isNaN(value) && value >= lowerBound && value <= upperBound) {
			setProductPrice(value);
			setIsValidPrice(true);
		} else {
			setIsValidPrice(false);
		}
	};

	const handleUploadPost = async () => {
		setIsLoading(true);
		if (!isValidPrice || productPrice === 0) {
			Toast.show({
				type: "error",
				text1: "Vui lòng nhập giá bán hợp lệ",
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
				autoHide: true,
			});
			return;
		}
		if (productName === "") {
			Toast.show({
				type: "error",
				text1: "Tên sản phẩm không được để trống",
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
				autoHide: true,
			});
			return;
		}

		if (
			!isValidProductName ||
			!isValidProductDescription ||
			containsBadWord(productName) ||
			containsBadWord(productDescription)
		) {
			Toast.show({
				type: "error",
				text1: "Vui lòng nhập tên sản phẩm và mô tả hợp lệ",
				text2: "Không chứa từ ngữ phản cảm",
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
				autoHide: true,
			});
			return;
		}
		try {
			const imageFrontUri = await uploadImageToFirebase(
				product.originalFrontUri,
				"front_" + generateRandomString(5)
			);
			const imageBackUri = await uploadImageToFirebase(
				product.originalBackUri,
				"back_" + generateRandomString(5)
			);
			//console.log("Product: ", JSON.stringify(product, null, 2));

			if (!userData) {
				console.log("userData is undefined");
				return;
			}

			const docRef = await addDoc(collection(db, "products"), {
				userId: userData.id,
				productName: productName,
				productColor: product.color,
				productDescription: productDescription,
				productSize: product.size,
				productMaterial: product.productMaterial,
				productPrint: product.productPrint,
				productPrice: productPrice,
				imageFront: imageFrontUri,
				imageBack: imageBackUri,
				likedTotal: 0,
				productQuantity: 1,
				dateCreated: new Date(),
			});
			const productId = docRef.id;

			await updateDoc(doc(db, "products", productId), {
				productId: productId,
			});

			navigation.navigate("SuccessScreen", { isPost: true });
		} catch (error) {
			console.log("Error uploading images:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Calculate and set lower and upper bounds when product changes
		const calculateBounds = () => {
			const lower =
				product.productMaterial.materialPrice + product.productPrint.printPrice;
			setLowerBound(lower);
			setUpperBound(lower * 1.5);
		};

		calculateBounds();
		fetchBadWords();
	}, [product]);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<>
				<ScrollView style={styles.scrollViewContainer}>
					<View style={styles.container}>
						<View style={styles.imageSection}>
							<Image source={{ uri: product.front }} style={styles.image} />
							<View style={{ width: 10 }} />
							<Image source={{ uri: product.back }} style={styles.image} />
						</View>
						<View style={styles.fieldContainer}>
							<ItemCard
								title="Tên sản phẩm"
								canEdit={true}
								description={productName}
								onChange={handleNameChange}
							/>
							<ItemCard
								title="Mô tả"
								canEdit={true}
								description={productDescription}
								onChange={handleDescriptionChange}
							/>
							<ItemCard
								title="Giá"
								description={productPrice}
								onChange={handlePriceChange}
								canEdit={true}
							/>
							<Text style={styles.label}>
								<Text style={[styles.label, { color: colors.error }]}>*</Text>{" "}
								Giá bán dao động từ {formatCurrency(lowerBound)} ~
								{formatCurrency(upperBound)}
							</Text>
						</View>

						<CustomButton text="Đăng bài" onPress={handleUploadPost} />
					</View>
				</ScrollView>
				{isLoading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" color={colors.text.black_100} />
					</View>
				)}
			</>
		</TouchableWithoutFeedback>
	);
};

const mapStateToProps = (state) => ({
	mockupImageUri: state.user.mockupImageUri,
	product: state.user.product,
	userData: state.auth.userData,
});

const mapDispatchToProps = {
	updateImageUri,
	saveProductFront,
	saveProductBack,
	saveProductName,
	saveProductDescription,
	saveProductPrice,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadPostScreen);

const styles = StyleSheet.create({
	scrollViewContainer: {
		height: "100%",
		backgroundColor: colors.background.white_100,
	},
	container: {
		padding: "5%",
	},
	imageSection: {
		height: 200,
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	image: {
		width: 170,
		height: 170,
		resizeMode: "contain",
		borderRadius: 10,
	},
	fieldContainer: {
		marginTop: "5%",
	},
	label: {
		color: colors.text.black_50,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.black_20,
	},
});
