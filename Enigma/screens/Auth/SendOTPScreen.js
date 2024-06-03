import React, { useState } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { sendPasswordResetEmail } from "firebase/auth";
import * as SVG from "../../assets/svgs";
import { colors } from "../../assets/colors";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";

const ENIGMA_BACKGROUND = require("../../assets/images/enigma-background.jpg");

const SendOTPScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const auth = getAuth();

    const handleContinue = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Email đặt lại mật khẩu đã được gửi",
                text1Style: {
                    fontSize: 16,
                    fontFamily: "helvetica-neue-bold",
                    color: colors.text.black_100,
                },
                text2Style: {
                    fontSize: 12,
                    fontFamily: "helvetica-neue-bold",
                    color: colors.text.black_50,
                },
            });
            navigation.navigate("SignInScreen");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Đã xảy ra lỗi, vui lòng thử lại",
                text1Style: {
                    fontSize: 16,
                    fontFamily: "helvetica-neue-bold",
                    color: colors.text.black_100,
                },
                text2Style: {
                    fontSize: 12,
                    fontFamily: "helvetica-neue-bold",
                    color: colors.text.black_50,
                },
            });
            console.log(error);
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
                <Text style={styles.title}>Gửi mã xác thực</Text>
                <InputField
                    placeholder="Email đăng ký"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />
                <View style={styles.helperContainer}>
                    <Text style={styles.helperText}>
                        Chúng tôi sẽ gửi thông báo qua email để phục vụ mục đích
                        bảo mật và hỗ trợ bạn đặt lại mật khẩu
                    </Text>
                </View>
                <CustomButton text="Tiếp tục" onPress={handleContinue} arrow />
            </ImageBackground>
        </View>
    );
};

export default SendOTPScreen;

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
});
