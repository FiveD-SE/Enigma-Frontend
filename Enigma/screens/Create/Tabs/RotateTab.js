import React, { useState } from "react";
import { Image, View, Dimensions, StyleSheet } from "react-native";
import ViewShot from "react-native-view-shot";
import { colors } from "../../../assets/colors";
import CropOptions from "../../../components/CropOptions";
const windowHeight = Dimensions.get("window").height;

const RotateTab = ({ route, viewShotRef, setCurrentImageUri }) => {
	const [selectedTools, setSelectedTools] = useState(null);
	const [rotation, setRotation] = useState(0);
	const [flippedHorizontally, setFlippedHorizontally] = useState(false);
	const [flippedVertically, setFlippedVertically] = useState(false);

	const { imageUri } = route?.params;

	const handleRotate = async (direction) => {
		setSelectedTools(direction);
		if (direction === "RotateLeft") {
			setRotation((prevRotation) => prevRotation - 90);
		} else if (direction === "RotateRight") {
			setRotation((prevRotation) => prevRotation + 90);
		}
		const uri = await viewShotRef?.current.capture();
		setCurrentImageUri(uri);
	};

	const handleFlip = async (direction) => {
		setSelectedTools(direction);
		if (direction === "FlipHorizontal") {
			setFlippedHorizontally((prev) => !prev);
		} else if (direction === "FlipVertical") {
			setFlippedVertically((prev) => !prev);
		}
		const uri = viewShotRef?.current.capture();
		setCurrentImageUri(uri);
	};

	return (
		<View style={styles.container}>
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1, padding: "5%" }}>
					<View
						style={[styles.imageContainer, { height: windowHeight * 0.55 }]}
					>
						<ViewShot ref={viewShotRef}>
							<Image
								source={{ uri: imageUri }}
								style={[
									styles.image,
									{
										transform: [
											{ rotate: `${rotation}deg` },
											{ scaleX: flippedHorizontally ? -1 : 1 },
											{ scaleY: flippedVertically ? -1 : 1 },
										],
									},
								]}
								resizeMode="contain"
							/>
						</ViewShot>
					</View>
				</View>
				<View style={styles.toolsContainer}>
					<CropOptions
						iconName="rotate-left"
						label="Xoay trái"
						selected={selectedTools === "RotateLeft"}
						onPress={() => handleRotate("RotateLeft")}
					/>
					<CropOptions
						iconName="rotate-right"
						label="Xoay phải"
						selected={selectedTools === "RotateRight"}
						onPress={() => handleRotate("RotateRight")}
					/>
					<CropOptions
						iconName="flip-horizontal"
						label="Lật ngang"
						selected={selectedTools === "FlipHorizontal"}
						onPress={() => handleFlip("FlipHorizontal")}
					/>
					<CropOptions
						iconName="flip-vertical"
						label="Lật dọc"
						selected={selectedTools === "FlipVertical"}
						onPress={() => handleFlip("FlipVertical")}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: "2%",
		borderRadius: 8,
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
		aspectRatio: 1,
	},
	controlsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: "10%",
	},
	navigationButtons: {
		flexDirection: "row",
		alignItems: "center",
	},
	navButton: {
		borderColor: colors.background.black_20,
		borderWidth: 1,
		padding: "5%",
		marginRight: "5%",
		borderRadius: 30,
		backgroundColor: colors.background.white_100,
		shadowColor: colors.background.black_100,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	toolsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		borderTopColor: colors.background.black_20,
		borderTopWidth: 1,
		paddingVertical: "2%",
	},
});

export default RotateTab;
