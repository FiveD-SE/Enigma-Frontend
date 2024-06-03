import React, { useCallback, useEffect, useState } from "react";
import {
	Image,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Pressable,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
	Keyboard,
	Animated,
	ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { colors } from "../../assets/colors";
import CreateProgress from "../../components/CreateProgress";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import {
	saveEditImage,
	updateCurrentEditImage,
	updateImageUri,
} from "../../redux/actions/userActions";
import { genImageFromPrompt } from "../../services/stabilityApi";
import { genImageFromPromptAndImage } from "../../services/stabilityApi";

const windowHeight = Dimensions.get("window").height;

const CreateScreen = ({
	imageUri,
	updateImageUri,
	editImage,
	saveEditImage,
	currentEditImage,
	updateCurrentEditImage,
}) => {
	const navigation = useNavigation();
	const [prompt, setPrompt] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [isUploaded, setIsUploaded] = useState(false);
	const [keyboardShown, setKeyboardShown] = useState(false);
	const [deleteButtonScale] = useState(new Animated.Value(1));
	const [generateButtonScale] = useState(new Animated.Value(1));
	const [isLoading, setIsLoading] = useState(false);

	const handleButtonPressIn = (buttonScale) => {
		Animated.spring(buttonScale, {
			toValue: 0.9,
			useNativeDriver: true,
		}).start();
	};

	const handleButtonPressOut = (buttonScale) => {
		Animated.spring(buttonScale, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	const handleCreateButton = async () => {
		setIsLoading(true);
		try {
			let image;
			// if (imageUri) {
			//     image = await genImageFromPromptAndImage(prompt, imageUri);
			// } else {
			//     image = await genImageFromPrompt(prompt);
			// }
			image = await genImageFromPrompt(prompt);
			updateImageUri(image);
			setIsUploaded(true);
		} catch (error) {
			console.log("Error:", error);
			Toast.show({
				type: "error",
				text1: "Lỗi",
				text2: "Không thể tạo ảnh từ ý tưởng của bạn. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.",
				text1Style: {
					fontSize: 16,
					fontFamily: "helvetica-neue-bold",
				},
				text2Style: {
					fontSize: 12,
					fontFamily: "helvetica-neue-bold",
					color: colors.text.black_50,
				},
				visibilityTime: 1000,
				autoHide: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		navigation.goBack();
	};

	const handleForward = () => {
		if (!imageUri) {
			Toast.show({
				type: "error",
				text1: "Lỗi",
				text2: "Vui lòng tải ảnh hoặc tạo ảnh trước khi tiếp tục.",
				text1Style: {
					fontSize: 16,
					fontFamily: "helvetica-neue-bold",
				},
				text2Style: {
					fontSize: 12,
					fontFamily: "helvetica-neue-bold",
					color: colors.text.black_50,
				},
				visibilityTime: 1000,
				autoHide: true,
			});
			return;
		}
		updateImageUri(imageUri);
		if (editImage) {
			saveEditImage([...editImage, imageUri]);
			updateCurrentEditImage(0);
		} else {
			saveEditImage([imageUri]);
			updateCurrentEditImage(0);
		}
		navigation.navigate("EditImageScreen");
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
			console.log("Image from devices: ", result.assets[0].uri);
			updateImageUri(result.assets[0].uri);
			setIsUploaded(true);
		}
	};

	const handleRemoveImage = () => {
		if (imageUri) {
			updateImageUri(null);
			setIsUploaded(false);
			Toast.show({
				type: "success",
				text1: "Thành công",
				text2: "Xóa ảnh thành công",
				text1Style: {
					fontSize: 16,
					fontFamily: "helvetica-neue-bold",
				},
				text2Style: {
					fontSize: 12,
					fontFamily: "helvetica-neue-bold",
					color: colors.text.black_50,
				},
				visibilityTime: 1000,
				autoHide: true,
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Lỗi",
				text2: "Không có ảnh để xóa",
				text1Style: {
					fontSize: 16,
					fontFamily: "helvetica-neue-bold",
				},
				text2Style: {
					fontSize: 12,
					fontFamily: "helvetica-neue-bold",
					color: colors.text.black_50,
				},
				visibilityTime: 1000,
				autoHide: true,
			});
		}
	};

	const renderImage = () => {
		if (imageUri) {
			return (
				<Image
					source={{ uri: imageUri }}
					style={styles.image}
					resizeMode="contain"
				/>
			);
		} else {
			return (
				<Pressable style={styles.uploadContainer} onPress={handleImagePicker}>
					<Ionicons
						name="cloud-upload-outline"
						size={50}
						color="black"
						style={styles.icon}
					/>
					<Text style={styles.uploadText}>Tải ảnh lên</Text>
				</Pressable>
			);
		}
	};

	useFocusEffect(
		useCallback(() => {
			renderImage();
		}, [imageUri, isUploaded])
	);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				setKeyboardShown(true);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardShown(false);
			}
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
				>
					<ScrollView
						style={{ padding: "5%" }}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ flexGrow: 1 }}
						bounces={false}
					>
						<CreateProgress
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						<View
							style={[
								styles.imageContainer,
								{ borderWidth: imageUri ? 0 : 1 },
							]}
						>
							{renderImage()}
						</View>
						<View style={styles.promptContainer}>
							<View style={styles.promptHeader}>
								<Text style={styles.promptHeaderTitle}>
									Sáng tạo theo cách của bạn
								</Text>
							</View>
							<View style={styles.promptInputContainer}>
								<TextInput
									placeholder="Nhập ý tưởng bạn muốn thiết kế"
									style={styles.promptInput}
									multiline={true}
									numberOfLines={6}
									textAlignVertical="top"
									onChangeText={setPrompt}
								/>
							</View>
						</View>
						<View style={{ flexDirection: "row", marginTop: "4%" }}>
							<Animated.View
								style={[
									styles.generateButton,
									{
										transform: [
											{ scale: generateButtonScale },
										],
									},
									isLoading && {
										backgroundColor: colors.accent.grey_50,
									},
								]}
							>
								<Pressable
									onPressIn={() =>
										handleButtonPressIn(generateButtonScale)
									}
									onPressOut={() =>
										handleButtonPressOut(generateButtonScale)
									}
									onPress={() => handleCreateButton()}
									disabled={isLoading}
								>
									{isLoading ? (
										<ActivityIndicator
											size="small"
											color={colors.text.white_100}
										/>
									) : (
										<Text style={styles.generateText}>
											Tạo ảnh
										</Text>
									)}
								</Pressable>
							</Animated.View>
							<Animated.View
								style={[
									styles.deleteButton,
									{
										transform: [
											{ scale: deleteButtonScale },
										],
									},
								]}
							>
								<Pressable
									onPress={handleRemoveImage}
									onPressIn={() =>
										handleButtonPressIn(deleteButtonScale)
									}
									onPressOut={() =>
										handleButtonPressOut(deleteButtonScale)
									}
								>
									<Ionicons
										name="trash-outline"
										size={24}
										color={colors.accent.lightGrey_100}
									/>
								</Pressable>
							</Animated.View>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
				{!keyboardShown && (
					<View style={styles.footer}>
						<Pressable
							onPress={handleBack}
							style={styles.backButton}
						>
							<Text style={styles.actionsText}>‎</Text>
						</Pressable>
						<Text style={styles.pagingText}>1/5</Text>
						<Pressable
							onPress={handleForward}
							style={styles.forwardButton}
						>
							<Text style={styles.actionsText}>Tiếp tục</Text>
						</Pressable>
					</View>
				)}
				{isLoading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator
							size="large"
							color={colors.text.black_100}
						/>
					</View>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const mapStateToProps = (state) => ({
	imageUri: state.user.imageUri,
	currentEditImage: state.user.currentEditImage,
});

const mapDispatchToProps = {
	updateImageUri,
	saveEditImage,
	updateCurrentEditImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	imageContainer: {
		height: windowHeight * 0.4,
		borderColor: colors.background.black_20,
		borderRadius: 8,
		overflow: "hidden",
		marginTop: "2%",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	uploadContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		color: colors.text.grey_100,
	},
	uploadText: {
		color: colors.text.grey_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-medium",
		lineHeight: 20,
		marginTop: "2%",
	},
	promptContainer: {
		marginTop: "5%",
	},
	promptHeader: {
		backgroundColor: colors.background.black_100,
		padding: "3%",
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	promptHeaderTitle: {
		color: colors.text.white_100,
		fontSize: 14,
		lineHeight: 20,
		fontFamily: "helvetica-neue-bold",
	},
	promptInputContainer: {
		flex: 1,
		height: 100,
		paddingVertical: "2%",
		paddingHorizontal: "5%",
		borderWidth: 1,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		borderColor: colors.background.black_20,
	},
	promptInput: {
		fontSize: 14,
		fontFamily: "helvetica-neue-medium",
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
		fontFamily: "helvetica-neue-bold",
		lineHeight: 30,
		fontSize: 18,
	},
	forwardButton: {
		position: "absolute",
		right: "10%",
	},
	pagingText: {
		flex: 1,
		color: colors.text.black_100,
		fontSize: 20,
		lineHeight: 30,
		fontFamily: "helvetica-neue-bold",
		textAlign: "center",
		letterSpacing: 2,
	},
	generateButton: {
		flex: 1,
		backgroundColor: colors.background.black_100,
		padding: "4%",
		marginRight: "2%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		shadowColor: colors.background.black_100,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 2,
	},
	generateText: {
		color: colors.text.white_100,
		fontSize: 16,
		lineHeight: 20,
		fontFamily: "helvetica-neue-bold",
	},
	deleteButton: {
		flex: 0.2,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.lightGrey_10,
		borderRadius: 8,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.background.black_20,
	},
});