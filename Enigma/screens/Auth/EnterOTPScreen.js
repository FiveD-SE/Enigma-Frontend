import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	TextInput,
	Platform,
	Pressable,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import * as SVG from "../../assets/svgs";
import { colors } from "../../assets/colors";

import CustomButton from "../../components/CustomButton";

const ENIGMA_BACKGROUND = require("../../assets/images/enigma-background.jpg");

const EnterOTPScreen = ({ route }) => {
	const { isSignUp } = route.params;
	const navigation = useNavigation();
	const [otp, setOTP] = useState(["", "", "", "", "", ""]);
	const [email, setEmail] = useState(route.params.email);
	const handleConfirm = () => {
		if (isSignUp) {
			navigation.navigate("SuccessScreen", { isSignUp: isSignUp });
		} else {
			navigation.navigate("ResetPasswordScreen");
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<SVG.ForgotPasswordSVG />
			</View>
			<ImageBackground
				source={ENIGMA_BACKGROUND}
				style={styles.main}
				imageStyle={styles.imageStyle}
			>
				<Text style={styles.title}>Nhập mã xác thực</Text>
				<View style={styles.helperContainer}>
					<Text style={styles.helperText}>
						Mã xác thực đã được gửi đến {email}. Vui lòng kiểm tra email
					</Text>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					{otp.map((value, index) => (
						<View style={styles.otpContainer} key={index}>
							<TextInput
								style={styles.input}
								maxLength={1}
								keyboardType="numeric"
							/>
						</View>
					))}
				</View>
				<Pressable style={styles.resendCodeContainer}>
					<Text style={styles.resendCodeText}>Gửi lại mã</Text>
				</Pressable>
				<CustomButton text="Xác nhận" onPress={handleConfirm} />
			</ImageBackground>
		</View>
	);
};

export default EnterOTPScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	header: {
		flex: 0.5,
		marginTop: "10%",
		justifyContent: "center",
		alignItems: "center",
	},
	main: {
		flex: 1,
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
	helperContainer: {
		flexDirection: "row",
		marginTop: "5%",
	},
	helperText: {
		color: colors.text.black_100,
		fontFamily: "helvetica-neue-medium",
		fontSize: 14,
		lineHeight: 20,
	},
	imageStyle: {
		opacity: 0.5,
		borderWidth: 3,
		borderColor: colors.accent.lightGrey_100,
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
	},
	otpContainer: {
		backgroundColor: colors.background.white_100,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: colors.accent.lightGrey_100,
		paddingVertical: Platform.select({
			ios: "4%",
			android: "4%",
		}),
		paddingHorizontal: Platform.select({
			ios: "6%",
			android: "4%",
		}),
		marginTop: "5%",
	},
	input: {
		textAlign: "center",
		color: colors.text.black_100,
		fontWeight: "500",
		fontSize: Platform.select({
			ios: 24,
			android: 20,
		}),
	},
	resendCodeContainer: {
		marginTop: "5%",
	},
	resendCodeText: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-medium",
	},
});
