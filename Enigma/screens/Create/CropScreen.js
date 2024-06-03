import React, { useCallback, useEffect, useRef, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CropTab from "./Tabs/CropTab";
import RotateTab from "./Tabs/RotateTab";
import CropTabBar from "../../components/CropTabBar";
import HeaderControl from "../../components/HeaderControl";
import { saveEditImage, updateCurrentEditImage, updateImageUri } from "../../redux/actions/userActions";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const CropScreen = ({ imageUri, updateImageUri, editImage, saveEditImage, currentEditImage, updateCurrentEditImage }) => {
	const [currentImageUri, setCurrentImageUri] = useState(imageUri);
	const navigation = useNavigation();
	const viewShotRef = useRef();

	const handleCapture = useCallback(async () => {
		const uri = await viewShotRef.current.capture();
		updateImageUri(uri);
		saveEditImage([...editImage.slice(0, currentEditImage + 1), uri]);
		updateCurrentEditImage(currentEditImage + 1);
		navigation.navigate("EditImageScreen");
	}, []);

	return (
		<Tab.Navigator tabBar={(props) => <CropTabBar {...props} />}>
			<Tab.Screen
				name="Cắt"
				options={{
					headerTitle: "Cắt",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
					headerRight: () => <HeaderControl onCapture={handleCapture} />,
					headerRightContainerStyle: {
						paddingRight: "5%",
					},
				}}
				initialParams={{ imageUri: currentImageUri }}
				children={(props) => <CropTab
					viewShotRef={viewShotRef}
					setCurrentImageUri={setCurrentImageUri}
					{...props} />}
			>
			</Tab.Screen>
			<Tab.Screen
				name="Xoay/Lật"
				options={{
					headerTitle: "Cắt",
					headerLeft: () => <HeaderBack />,
					headerLeftContainerStyle: {
						paddingLeft: "5%",
					},
					headerRight: () => <HeaderControl onCapture={handleCapture} />,
					headerRightContainerStyle: {
						paddingRight: "5%",
					},
				}}
				initialParams={{ imageUri: currentImageUri }}
				children={(props) => <RotateTab
					viewShotRef={viewShotRef}
					setCurrentImageUri={setCurrentImageUri}
					{...props} />}
			>
			</Tab.Screen>
		</Tab.Navigator>
	);
};

const mapStateToProps = (state) => ({
	imageUri: state.user.imageUri,
	editImage: state.user.editImage,
	currentEditImage: state.user.currentEditImage
});

const mapDispatchToProps = {
	updateImageUri,
	saveEditImage,
	updateCurrentEditImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(CropScreen);
