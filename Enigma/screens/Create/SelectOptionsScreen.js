import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { connect } from "react-redux";

import CreateProgress from "../../components/CreateProgress";
import Accordion from "../../components/Accordion";
import OptionsCard from "../../components/OptionsCard";
import ConfirmModal from "../../components/ConfirmModal";
import { colors } from "../../assets/colors";
import {
	saveMaterialOption,
	savePrintOption,
	saveProductBack,
	saveProductFront,
	saveProductPrice,
} from "../../redux/actions/userActions";

const shirtOptionList = {
	materials: [
		{
			title: "Vải 100% Cotton",
			description:
				"Sợi tự nhiên không gây kích ứng với da mang lại cảm giác dễ chịu, thoải mái.",
			price: 140000,
		},
		{
			title: "Vải thun cotton 65/35 CVC",
			description:
				"Sợi tự nhiên không gây kích ứng với da mang lại cảm giác dễ chịu, thoải mái.",
			price: 120000,
		},
		{
			title: "Vải thun cotton 4 chiều",
			description:
				"Sợi tự nhiên không gây kích ứng với da mang lại cảm giác dễ chịu, thoải mái.",
			price: 165000,
		},
	],
	prints: [
		{
			title: "In lụa (In lưới)",
			description: "Hình in nổi trên bề mặt vải. Không in được màu chuyển sắc",
			price: 15000,
		},
		{
			title: "In Decal (DTF)",
			description: "Hình in nổi bật trên bề mặt vải. In được màu chuyển sắc",
			price: 25000,
		},
	],
};

const bagOptionList = {
	materials: [
		{
			title: "Vải canvas",
			description: "Chắc chắn, bền bỉ, thích hợp cho túi đeo hàng ngày.",
			price: 140000,
		},
		{
			title: "Vải cotton",
			description: "Mềm mại, thoáng khí, phù hợp cho túi sử dụng hàng ngày.",
			price: 145000,
		},
		{
			title: "Vải linen",
			description: "Mềm mại vừa đủ, độ bền khá cao, dễ in màu nhuộm",
			price: 150000,
		},
	],
	prints: [
		{
			title: "In lụa (In lưới)",
			description: "Hình in nổi trên bề mặt vải. Không in được màu chuyển sắc",
			price: 15000,
		},
		{
			title: "In Decal (DTF)",
			description: "Hình in nổi bật trên bề mặt vải. In được màu chuyển sắc",
			price: 25000,
		},
	],
};

const SelectOptionsScreen = ({
	route,
	product,
	saveMaterialOption,
	savePrintOption,
	saveProductPrice,
	saveProductFront,
	saveProductBack,
}) => {
	const { productType } = route.params;
	const navigation = useNavigation();
	const [optionList, setOptionList] = useState(shirtOptionList);
	const [currentPage, setCurrentPage] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [selectedMaterials, setSelectedMaterials] = useState({
		index: 0,
		item: optionList.materials[0],
	});
	const [selectedPrints, setSelectedPrints] = useState({
		index: 0,
		item: optionList.prints[0],
	});

	const handleBack = () => {
		navigation.goBack();
	};

	const renderOptionList = () => {
		if (productType === "shirt") {
			setOptionList(shirtOptionList);
		} else if (productType === "bag") {
			setOptionList(bagOptionList);
		}
	};

	const handleForward = () => {
		if (selectedMaterials === null || selectedPrints === null) {
			setShowModal(true);
		} else {
			saveMaterialOption({
				materialName: selectedMaterials.item.title,
				materialPrice: selectedMaterials.item.price,
			});
			savePrintOption({
				printName: selectedPrints.item.title,
				printPrice: selectedPrints.item.price,
			});
			// saveProductPrice(
			// 	selectedMaterials.item.price + selectedPrints.item.price
			// );
			navigation.navigate("OrderScreen");
		}
	};

	const handleConfirmModal = () => {
		setShowModal(false);
	};

	const renderMissingOption = () => {
		if (selectedMaterials === null && selectedPrints === null) {
			return "Bạn chưa chọn Chất liệu và Cách thức in cho sản phẩm";
		}
		if (selectedMaterials === null) {
			return "Bạn chưa chọn Chất liệu cho sản phẩm";
		}

		if (selectedPrints === null) {
			return "Bạn chưa chọn Cách thức in cho sản phẩm";
		}
	};

	const handleSelectedMaterialsChange = (index) => {
		setSelectedMaterials({
			index: index,
			item: optionList.materials[index],
		});
	};

	const handleSelectedPrintsChange = (index) => {
		setSelectedPrints({
			index: index,
			item: optionList.prints[index],
		});
	};

	const renderMaterials = () => {
		const material = optionList.materials;
		return material.map((item, index) => {
			const isChecked = selectedMaterials && selectedMaterials.index === index;
			return (
				<OptionsCard
					key={index}
					title={item.title}
					description={item.description}
					price={item.price}
					isChecked={isChecked}
					onPress={() => handleSelectedMaterialsChange(index)}
				/>
			);
		});
	};

	const renderPrints = () => {
		const print = optionList.prints;
		return print.map((item, index) => {
			const isChecked = selectedPrints && selectedPrints.index === index;
			return (
				<OptionsCard
					key={index}
					title={item.title}
					description={item.description}
					price={item.price}
					isChecked={isChecked}
					onPress={() => handleSelectedPrintsChange(index)}
				/>
			);
		});
	};

	useFocusEffect(
		useCallback(() => {
			setCurrentPage(3);
			renderOptionList();
		}, [])
	);

	return (
		<View style={styles.container}>
			<ScrollView style={{ flex: 1 }}>
				<View style={{ padding: "5%" }}>
					<CreateProgress
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				</View>
				<View style={{ paddingHorizontal: "5%" }}>
					<Accordion value={"Chất liệu"}>
						<View style={styles.contentContainer}>{renderMaterials()}</View>
					</Accordion>
					<Accordion value={"Cách thức in"}>
						<View style={styles.contentContainer}>{renderPrints()}</View>
					</Accordion>
				</View>
			</ScrollView>
			<View style={styles.footer}>
				<Pressable onPress={handleBack} style={styles.backButton}>
					<Text style={styles.actionsText}>Trở lại</Text>
				</Pressable>
				<Text style={styles.pagingText}>4/5</Text>
				<Pressable onPress={handleForward} style={styles.forwardButton}>
					<Text style={styles.actionsText}>Tiếp tục</Text>
				</Pressable>
			</View>
			<ConfirmModal
				visible={showModal}
				onClose={handleConfirmModal}
				renderMissingOption={renderMissingOption}
			/>
		</View>
	);
};

const mapStateToProps = (state) => ({
	product: state.user.product,
	userData: state.auth.userData,
});

const mapDispatchToProps = {
	saveMaterialOption,
	savePrintOption,
	saveProductPrice,
	saveProductFront,
	saveProductBack,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SelectOptionsScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	contentContainer: {
		padding: "4%",
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
	forwardButton: {
		position: "absolute",
		right: "10%",
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
