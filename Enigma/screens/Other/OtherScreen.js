import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Image,
	Pressable,
	Platform,
	TouchableOpacity,
} from "react-native";
import { colors } from "../../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import CustomButton from "../../components/CustomButton";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	collection,
	doc,
	onSnapshot,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db, uploadImageToFirebase } from "../../services/firebase";
import { saveUserData } from "../../redux/actions/userActions";
import * as ImagePicker from "expo-image-picker";

const OtherScreen = ({ userData, saveUserData }) => {
	const navigation = useNavigation();
	const [orders, setOrders] = useState([]);

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const handleImagePicker = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Sorry, we need camera roll permissions to make this work!");
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const userImage = await uploadImageToFirebase(
				result.assets[0].uri,
				"user_" + userData.id
			);
			console.log("Image from devices: ", result.assets[0].uri);

			const updatedUserData = { ...userData, userImage: userImage };
			saveUserData(updatedUserData);
			const userDocRef = doc(db, "users", userData.id);
			await updateDoc(userDocRef, {
				userImage: userImage,
			});
		}
	};

	useEffect(() => {
		const fetchOrders = async () => {
			if (userData?.id) {
				const ordersQuery = query(
					collection(db, "orders"),
					where("userId", "==", userData.id)
				);

				const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
					let totalCount = 0;
					let pendingCount = 0;
					let deliveredCount = 0;
					let successCount = 0;

					querySnapshot.forEach((doc) => {
						const orderDoc = doc.data();
						totalCount++;

						switch (orderDoc.orderState) {
							case "1":
								pendingCount++;
								break;
							case "2":
								deliveredCount++;
								break;
							case "3":
								successCount++;
								break;
						}
					});

					setOrders({
						total: totalCount,
						pending: pendingCount,
						delivered: deliveredCount,
						success: successCount,
					});
				});

				return () => unsubscribe();
			}
		};

		fetchOrders();
	}, [userData?.id]);

	const { total, pending, delivered, success } = orders;

	const formatName = (name) => {
		let nameParts = name.split(" ");
		let firstName = nameParts.pop();
		return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
	};

	const menuItems = [
		{
			label: "Tài khoản của tôi",
			icon: "person-outline",
			routes: "AccountStack",
		},
		{ label: "Đã thích", icon: "heart-outline", routes: "FavoriteScreen" },
		{
			label: "Chính sách",
			icon: "newspaper-outline",
			routes: "PolicyScreen",
		},
	];

	const renderMenuItem = () => {
		return menuItems.map((item, index) => (
			<Pressable
				key={index}
				style={styles.menuItem}
				onPress={() => handleNavigation(item.routes)}
			>
				<Ionicons name={item.icon} size={24} />
				<Text style={styles.menuText}>{item.label}</Text>
				<Ionicons
					name="chevron-forward"
					size={16}
					color={colors.accent.lightGrey_100}
				/>
			</Pressable>
		));
	};

	const handleNavigation = (routes) => {
		navigation.navigate(routes);
	};

	const goToAllOrderScreen = () => {
		navigation.navigate("OrderScreen");
	};

	const goToPendingOrdersTab = () => {
		navigation.navigate("OrderScreen", { tabs: "Chờ xác nhận" });
	};

	const goToDeliveredOrdersTab = () => {
		navigation.navigate("OrderScreen", { tabs: "Đang giao hàng" });
	};

	const goToSuccessOrdersTab = () => {
		navigation.navigate("OrderScreen", { tabs: "Hoàn thành" });
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => handleImagePicker()}
					style={styles.imageContainer}
				>
					<Image
						source={{ uri: userData.userImage }}
						style={styles.userImage}
						resizeMode="stretch"
					/>
				</TouchableOpacity>
				<View style={styles.headerContent}>
					<Text style={styles.usernameText} numberOfLines={1}>
						Hi! {formatName(userData.name)} 👋
					</Text>
					<View style={styles.coinContainer}>
						<Ionicons name="wallet" size={14} color={colors.accent.coin} />
						<Text style={styles.coinText}>
							{formatCurrency(userData.credit)}
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.main}>
				<View style={styles.mainHeaderContainer}>
					<Text style={[styles.headerLabel, styles.blackText]}>Đơn hàng</Text>
					<Pressable style={styles.headerLink} onPress={goToAllOrderScreen}>
						{total > 0 && (
							<Text style={styles.headerLabel}>Xem tất cả ({total})</Text>
						)}
						{total == 0 && <Text style={styles.headerLabel}>Xem tất cả</Text>}
						<Ionicons
							name="chevron-forward"
							size={16}
							color={colors.accent.lightGrey_100}
						/>
					</Pressable>
				</View>
				<View style={styles.orderStatusRow}>
					<Pressable
						style={styles.iconContainer}
						onPress={goToPendingOrdersTab}
					>
						<View>
							{pending > 0 && (
								<View style={styles.circle}>
									<Text style={styles.amountText}>{pending}</Text>
								</View>
							)}
							<Ionicons name="wallet" size={24} />
						</View>
						<Text style={styles.iconText}>Chờ xác nhận</Text>
					</Pressable>
					<Pressable
						style={styles.iconContainer}
						onPress={goToDeliveredOrdersTab}
					>
						<View>
							{delivered > 0 && (
								<View style={styles.circle}>
									<Text style={styles.amountText}>{delivered}</Text>
								</View>
							)}
							<Ionicons name="car" size={24} />
						</View>
						<Text style={styles.iconText}>Đang giao hàng</Text>
					</Pressable>
					<Pressable
						style={styles.iconContainer}
						onPress={goToSuccessOrdersTab}
					>
						<View>
							{success > 0 && (
								<View style={styles.circle}>
									<Text style={styles.amountText}>{success}</Text>
								</View>
							)}
							<Ionicons name="bag-check" size={24} />
						</View>
						<Text style={styles.iconText}>Hoàn thành</Text>
					</Pressable>
				</View>
				<View style={styles.menu}>{renderMenuItem()}</View>
				<View style={{ marginHorizontal: "5%" }}>
					<CustomButton
						text="Đăng xuất"
						onPress={() => {
							AsyncStorage.removeItem("email");
							AsyncStorage.removeItem("password");
							AsyncStorage.removeItem("isRemembered");
							Updates.reloadAsync();
						}}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.lightGrey_10,
	},
	header: {
		backgroundColor: colors.background.white_100,
		marginHorizontal: "4%",
		flexDirection: "row",
		marginTop: Platform.select({
			android: "12%",
		}),
		marginBottom: "4%",
		paddingHorizontal: "5%",
		paddingVertical: "2%",
		alignItems: "center",
		borderRadius: 20,
		borderColor: colors.background.black_20,
		borderWidth: 0.5,
		shadowColor: colors.background.black_100,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 5,
	},
	imageContainer: {
		width: 64,
		height: 64,
		justifyContent: "center",
		alignItems: "center",
		marginRight: "5%",
	},
	userImage: {
		width: "80%",
		height: "80%",
		borderRadius: 100,
		aspectRatio: 1,
	},
	headerContent: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	usernameText: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
	},
	coinContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: "2%",
		paddingHorizontal: "2%",
		borderRadius: 5,
		backgroundColor: colors.background.coin_10,
	},
	coinText: {
		color: colors.accent.coin,
		fontFamily: "helvetica-neue-medium",
		fontSize: 14,
		marginLeft: "10%",
	},
	main: {
		flex: 1,
		backgroundColor: colors.background.white_100,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	mainHeaderContainer: {
		flexDirection: "row",
		padding: "4%",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: colors.background.black_20,
	},
	headerLabel: {
		fontSize: 12,
		fontFamily: "helvetica-neue-bold",
		textTransform: "uppercase",
	},
	blackText: {
		color: colors.text.black_100,
	},
	headerLink: {
		flexDirection: "row",
		alignItems: "center",
	},
	orderStatusRow: {
		flexDirection: "row",
		borderBottomColor: colors.background.black_20,
	},
	iconContainer: {
		flex: 1,
		alignItems: "center",
		paddingVertical: "4%",
	},
	iconText: {
		fontSize: 12,
		fontFamily: "helvetica-neue-medium",
		marginTop: "5%",
	},
	menu: {
		borderTopWidth: 1,
		borderTopColor: colors.background.black_20,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: "6%",
		borderBottomWidth: 1,
		borderBottomColor: colors.background.black_20,
	},
	menuText: {
		flex: 1,
		color: colors.text.black_100,
		fontSize: 14,
		fontFamily: "helvetica-neue-bold",
		marginLeft: "5%",
	},
	circle: {
		width: 15,
		height: 15,
		borderRadius: 100,
		backgroundColor: colors.background.black_100,
		position: "absolute",
		top: -7,
		right: -10,
		justifyContent: "center",
		alignItems: "center",
	},
	amountText: {
		color: colors.text.white_100,
		fontSize: 10,
		fontFamily: "helvetica-neue-bold",
	},
});

const mapStateToProps = (state) => ({
	userData: state.auth.userData,
});

const mapDispatchToProps = {
	saveUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherScreen);
