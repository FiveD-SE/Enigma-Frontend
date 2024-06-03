import { StyleSheet } from "react-native";
import React from "react";
import StepIndicator from "react-native-step-indicator";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../assets/colors";

const CreateProgress = ({ currentPage, setCurrentPage }) => {
	const getStepIndicatorIconConfig = ({ position, stepStatus }) => {
		const iconConfig = {
			size: 24,
		};
		switch (position) {
			case 0: {
				iconConfig.name = "bulb-outline";
				break;
			}
			case 1: {
				iconConfig.name = "options-outline";
				break;
			}
			case 2: {
				iconConfig.name = "logo-apple-ar";
				break;
			}
			case 3: {
				iconConfig.name = "extension-puzzle-outline";
				break;
			}
			case 4: {
				iconConfig.name = "bag-check-outline";
				break;
			}
			default: {
				break;
			}
		}
		if (stepStatus === "finished") {
			iconConfig.color = "#FFFFFF";
		} else {
			iconConfig.color =
				position === currentPage ? colors.background.black_100 : "#CBCBD4";
		}
		return iconConfig;
	};

	const renderStepIndicator = (params) => (
		<Ionicons {...getStepIndicatorIconConfig(params)} />
	);

	return (
		<StepIndicator
			currentPosition={currentPage}
			stepCount={5}
			customStyles={styles.customStyles}
			renderStepIndicator={renderStepIndicator}
			labels={["Tạo", "Sửa", "Mockup", "Tuỳ chọn", "Hoàn tất"]}
		/>
	);
};

export default CreateProgress;

const styles = StyleSheet.create({
	customStyles: {
		stepIndicatorSize: 40,
		currentStepIndicatorSize: 50,
		separatorStrokeWidth: 2,
		currentStepStrokeWidth: 3,
		stepStrokeCurrentColor: colors.background.black_100,
		stepStrokeWidth: 2,
		separatorStrokeFinishedWidth: 4,
		stepStrokeFinishedColor: colors.background.black_100,
		stepStrokeUnFinishedColor: "#CBCBD4",
		separatorFinishedColor: colors.background.black_100,
		separatorUnFinishedColor: "#CBCBD4",
		stepIndicatorFinishedColor: colors.background.black_100,
		stepIndicatorUnFinishedColor: "#ffffff",
		stepIndicatorCurrentColor: "#ffffff",
		stepIndicatorLabelFontSize: 12,
		currentStepIndicatorLabelFontSize: 12,
		labelColor: "#AAAAAA",
		labelSize: 12,
		currentStepLabelColor: colors.background.black_100,
	},
});
