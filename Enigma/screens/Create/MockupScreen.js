import React, { useCallback, useState } from "react";
import {
	View,
	Dimensions,
	Pressable,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import CreateProgress from "../../components/CreateProgress";
import { colors } from "../../assets/colors";
import { useExpandAnimation } from "../../utils/useExpandAnimation";

const windowHeight = Dimensions.get("window").height;

const MockupScreen = () => {
	const navigation = useNavigation();
	const { animatedStyleItem } = useExpandAnimation();
	const [currentPage, setCurrentPage] = useState(0);

	const handleBack = () => {
		navigation.goBack();
	};

	const handleSelectShirtMockup = () => {
		navigation.navigate("ShirtMockupScreen");
	};

	const handleSelectBagMockup = () => {
		navigation.navigate("BagMockupScreen");
	};

	const renderMockupImage = () => {
		return (
			<View style={styles.labelContainer}>
				<Text style={styles.labelText}>Chọn một mẫu để mockup</Text>
			</View>
		);
	};

	useFocusEffect(
		useCallback(() => {
			setCurrentPage(2);
		}, [])
	);

	return (
		<View style={styles.container}>
			<View style={{ flex: 1 }}>
				<View style={{ padding: "5%" }}>
					<CreateProgress
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
					<View style={styles.imageContainer}>{renderMockupImage()}</View>
					<View style={styles.toolsContainer}>
						<View style={[styles.toolsButtonContainer]}>
							<View style={styles.toolsButton}>
								<Ionicons
									name="logo-buffer"
									size={24}
									color={colors.text.black_100}
								/>
							</View>
							<View style={styles.focusedItem}>
								<Text style={[styles.toolsButtonText, styles.focusedItemText]}>
									Mẫu
								</Text>
							</View>
						</View>
						<Animated.View style={[styles.chevronContainer, animatedStyleItem]}>
							<Ionicons
								name="chevron-forward"
								color={colors.accent.lightGrey_10}
								size={32}
								style={{ marginHorizontal: "1%" }}
							/>
						</Animated.View>
						<Animated.View
							style={[styles.toolsButtonContainer, animatedStyleItem]}
						>
							<TouchableOpacity
								style={styles.toolsButton}
								onPress={handleSelectShirtMockup}
							>
								<Ionicons
									name="shirt-outline"
									size={28}
									color={colors.text.black_100}
								/>
							</TouchableOpacity>
							<Text style={styles.toolsButtonText}>Áo thun</Text>
						</Animated.View>
						<Animated.View
							style={[styles.toolsButtonContainer, animatedStyleItem]}
						>
							<TouchableOpacity
								style={styles.toolsButton}
								onPress={handleSelectBagMockup}
							>
								<Ionicons
									name="bag-outline"
									size={28}
									color={colors.text.black_100}
								/>
							</TouchableOpacity>
							<Text style={styles.toolsButtonText}>Túi vải</Text>
						</Animated.View>
						<Animated.View
							style={[styles.toolsButtonContainer, animatedStyleItem]}
						>
							<TouchableOpacity
								style={[styles.toolsButton, { display: "none" }]}
							>
								<Ionicons
									name="bag-outline"
									size={28}
									color={colors.text.black_100}
								/>
							</TouchableOpacity>
							<Text style={styles.toolsButtonText}>‎</Text>
						</Animated.View>
					</View>
				</View>
			</View>
			<View style={styles.footer}>
				<Pressable onPress={handleBack} style={styles.backButton}>
					<Text style={styles.actionsText}>Trở lại</Text>
				</Pressable>
				<Text style={styles.pagingText}>3/5</Text>
			</View>
		</View>
	);
};

export default MockupScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},

	imageContainer: {
		height: windowHeight * 0.45,
		justifyContent: "center",
		alignItems: "center",
		marginTop: "2%",
		borderColor: colors.background.black_20,
		borderWidth: 1,
		borderRadius: 8,
		overflow: "hidden",
	},

	labelContainer: {
		justifyContent: "center",
		alignItems: "center",
	},

	icon: {
		color: colors.text.grey_100,
	},

	labelText: {
		color: colors.text.grey_100,
		fontSize: 16,
		lineHeight: 20,
		fontFamily: "helvetica-neue-medium",
		marginTop: "2%",
	},

	toolsContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: "10%",
		gap: 10,
	},

	toolsButtonContainer: {
		flex: 1,
		justifyContent: "center",
	},

	toolsButton: {
		backgroundColor: colors.background.white_100,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: "5%",
		paddingVertical: "20%",
		borderColor: colors.background.black_20,
		borderWidth: 1,
		marginBottom: "10%",
		borderRadius: 8,
		shadowColor: colors.background.black_20,
		shadowOffset: {
			width: 4,
			height: 5,
		},
		shadowOpacity: 0.5,
		shadowRadius: 2,
	},

	toolsButtonText: {
		color: colors.text.black_100,
		fontSize: 16,
		textAlign: "center",
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
		fontSize: 18,
		lineHeight: 30,
		fontFamily: "helvetica-neue-bold",
	},

	backButton: {
		position: "absolute",
		left: "10%",
		zIndex: 1,
	},

	forwardButton: {
		position: "absolute",
		right: "10%",
		zIndex: 1,
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

	focusedItem: {
		backgroundColor: colors.background.black_100,
		borderRadius: 5,
		paddingVertical: "4%",
	},

	focusedItemText: {
		color: colors.text.white_100,
	},
});
