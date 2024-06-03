import { StyleSheet, Text, View } from "react-native";
import React from "react";
import OrderTabs from "../../routes/TopTabs/OrderTabs";
import { colors } from "../../assets/colors";
const OrderScreen = ({ route }) => {
	const initialRouteName = route.params?.tabs || "Tất cả";
	return (
		<View style={styles.container}>
			<OrderTabs initialRouteName={initialRouteName} />
		</View>
	);
};

export default OrderScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
});
