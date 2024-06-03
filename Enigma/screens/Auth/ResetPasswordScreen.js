import { StyleSheet, Text, View, ImageBackground } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import * as SVG from "../../assets/svgs";
import { colors } from "../../assets/colors";

import PasswordInput from "../../components/PasswordInput";
import CustomButton from "../../components/CustomButton";

const ENIGMA_BACKGROUND = require("../../assets/images/enigma-background.jpg");

const ResetPasswordScreen = () => {
	const navigation = useNavigation();
	const [password, setPassword] = useState("");

	const handleConfirm = () => {
		navigation.navigate("SuccessScreen", { isResetPassword: true });
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<SVG.ResetPasswordSVG />
			</View>
			<ImageBackground
				source={ENIGMA_BACKGROUND}
				style={styles.main}
				imageStyle={styles.imageStyle}
			>
				<Text style={styles.title}>Đặt lại mật khẩu</Text>
				<PasswordInput placeholder="Mật khẩu" onChangeText={setPassword} />
				<PasswordInput
					placeholder="Nhập lại mật khẩu"
					onChangeText={setPassword}
				/>
				<CustomButton text="Xác nhận thay đổi" onPress={handleConfirm} />
			</ImageBackground>
		</View>
	);
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	header: {
		justifyContent: "center",
		alignItems: "center",
		flex: 0.5,
		marginTop: "5%",
	},
	main: {
		flex: 1,
		alignItems: "center",
		paddingHorizontal: "5%",
		paddingVertical: "10%",
	},
	title: {
		color: colors.text.black_100,
		textAlign: "center",
		fontFamily: "helvetica-neue-bold",
		fontSize: 28,
		lineHeight: 40,
	},
	imageStyle: {
		opacity: 0.5,
		borderWidth: 3,
		borderColor: colors.accent.lightGrey_100,
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
	},
});
