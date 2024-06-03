import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { colors } from "../../assets/colors";
import AnimatedButton from "../../components/AnimatedButton";
import { connect } from "react-redux";
import { selectCreateType } from "../../redux/actions/userActions";
import store from "../../redux/stores/store";
const SelectScreen = ({ createType, selectCreateType }) => {
	const navigation = useNavigation();

	const goToCreateScreen = (types) => {
		store.dispatch(selectCreateType(types));
		navigation.navigate("CreateScreen");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Chọn hình thức thiết kế</Text>
			<Text style={styles.subtitle}>
				Vui lòng chọn hình thức bạn muốn thực hiện
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					marginTop: "10%",
				}}
			>
				<AnimatedButton
					iconName="cart-outline"
					buttonText="Đặt hàng"
					buttonStyle={styles.actionsButton}
					textStyle={styles.actionsText}
					onPress={() => goToCreateScreen("ORDER")}
				/>
				<AnimatedButton
					iconName="storefront-outline"
					buttonText="Bán hàng"
					buttonStyle={styles.actionsButton}
					textStyle={styles.actionsText}
					onPress={() => goToCreateScreen("SELL")}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		paddingHorizontal: "5%",
		backgroundColor: colors.background.white_100,
		borderTopWidth: 1,
		borderTopColor: colors.background.black_20,
	},
	title: {
		color: colors.text.black_100,
		fontSize: 28,
		fontFamily: "helvetica-neue-bold",
		marginTop: "10%",
	},
	subtitle: {
		color: colors.text.black_50,
		fontSize: 16,
		fontFamily: "helvetica-neue-medium",
		textAlign: "center",
		marginTop: "5%",
	},
	actionsButton: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: "12%",
		paddingVertical: "21%",
		marginHorizontal: "4%",
		marginTop: "20%",
		borderWidth: 1,
		borderRadius: 10,
		backgroundColor: colors.background.white_100,
		borderColor: colors.background.black_20,
		shadowColor: colors.text.black_50,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 8,
	},
	actionsText: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
		marginTop: "10%",
	},
});

const mapStateToProps = (state) => ({
	createType: state.user.createType,
});

const mapDispatchToProps = (dispatch) => ({
	selectCreateType: (type) => dispatch(selectCreateType(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectScreen);
