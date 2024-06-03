import React, { useCallback, useState, useRef, useEffect } from "react";
import {
	Image,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Pressable,
	ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

import CreateProgress from "../../components/CreateProgress";
import CustomButton from "../../components/CustomButton";
import OrderItemBottomSheet from "../../components/OrderItemBottomSheet";
import { colors } from "../../assets/colors";
import { IsOpenProvider } from "../../utils/IsOpenContext";
import { uploadImageToFirebase } from "../../services/firebase";

const windowHeight = Dimensions.get("window").height;

const OrderScreen = ({ createType, product }) => {
	const navigation = useNavigation();
	const [currentPage, setCurrentPage] = useState(0);
	const orderItemBottomSheetRef = useRef(null);
	const [selectedItem, setSelectedItem] = useState(null);
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

	const handleOpenBottomSheet = (item) => {
		setSelectedItem(item);
		setIsBottomSheetVisible(true);
	};

	const handleCloseBottomSheet = () => setIsBottomSheetVisible(false);

	const handleBack = () => {
		navigation.goBack();
	};

	const goToUploadPostScreen = () => {
		navigation.navigate("UploadPostScreen");
	};

	const renderActionButton = () => {
		if (createType === "SELL") {
			return (
				<CustomButton
					text="Đăng lên Enigma"
					arrow={true}
					onPress={goToUploadPostScreen}
				/>
			);
		} else if (createType === "ORDER") {
			return <CustomButton text="Đặt hàng" onPress={handleOpenBottomSheet} />;
		}
	};

	// const renderImageFront = () => {
	// 	const imageUrl = `data:image/png;base64,${product.front}`;
	// 	return imageUrl;
	// };
	// const renderImageBack = () => {
	// 	const imageUrl = `data:image/png;base64,${product.front}`;
	// 	return imageUrl;
	// };

	useFocusEffect(
		useCallback(() => {
			setCurrentPage(4);
		}, [])
	);

	useEffect(() => {
		if (isBottomSheetVisible) {
			orderItemBottomSheetRef.current?.present();
		}
	}, [isBottomSheetVisible]);

	return (
		<IsOpenProvider>
			<View style={styles.container}>
				<View style={{ flex: 1, padding: "5%" }}>
					<CreateProgress
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ marginVertical: "5%" }}
					>
						<View
							style={[styles.imageContainer, { height: windowHeight * 0.4 }]}
						>
							<Image
								source={{ uri: product.front }}
								style={styles.image}
								resizeMode="cover"
							/>
						</View>
						<View
							style={[styles.imageContainer, { height: windowHeight * 0.4 }]}
						>
							<Image
								source={{ uri: product.back }}
								style={styles.image}
								resizeMode="cover"
							/>
						</View>
					</ScrollView>
					{renderActionButton()}
				</View>
				<View style={styles.footer}>
					<Pressable onPress={handleBack} style={styles.backButton}>
						<Text style={styles.actionsText}>Trở lại</Text>
					</Pressable>
					<Text style={styles.pagingText}>5/5</Text>
				</View>
			</View>
			{isBottomSheetVisible && (
				<OrderItemBottomSheet
					bottomSheetRef={orderItemBottomSheetRef}
					snapPoints={["55%"]}
					product={{ ...product, isUploadToStorage: true }}
					isVisible={isBottomSheetVisible}
					onClose={handleCloseBottomSheet}
				/>
			)}
		</IsOpenProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	imageContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: "1%",
		borderColor: colors.background.black_20,
		borderWidth: 1,
		borderRadius: 8,
		overflow: "hidden",
		marginBottom: "4%",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	footer: {
		backgroundColor: colors.background.white_100,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "6%",
		borderTopColor: colors.background.black_20,
		borderWidth: 1,
	},
	actionsText: {
		color: colors.text.black_100,
		fontSize: 18,
		lineHeight: 30,
		fontFamily: "helvetica-neue-bold",
	},
	backButton: {
		position: "absolute",
		left: "5%",
		zIndex: 1,
	},
	pagingText: {
		flex: 1,
		textAlign: "center",
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-bold",
		fontSize: 20,
		lineHeight: 30,
		letterSpacing: 2,
	},
});

const mapStateToProps = (state) => ({
	createType: state.user.createType,
	mockupImageUri: state.user.mockupImageUri,
	product: state.user.product,
});

export default connect(mapStateToProps)(OrderScreen);
