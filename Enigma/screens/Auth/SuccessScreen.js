import { StyleSheet, Text, Image, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../assets/colors";

import CustomButton from "../../components/CustomButton";

import { connect } from "react-redux";

const SuccessScreen = ({ route, product, userData }) => {
    const { isSignUp, isResetPassword, isConfirmOrder, isPost } = route.params;
    const navigation = useNavigation();

    const handleQuit = () => {
        if (isSignUp || isResetPassword) {
            navigation.navigate("SignInScreen");
        } else if (isConfirmOrder || isPost) {
            navigation.navigate("HomeScreen");
        }
    };

    const selectSubtitle = () => {
        if (isSignUp) {
            return "Tạo tài khoản thành công";
        } else if (isResetPassword) {
            return "Mật khẩu của bạn đã được thay đổi";
        } else if (isConfirmOrder) {
            return "Cảm ơn bạn đã đặt hàng";
        } else if (isPost) {
            return "Sản phẩm đã được đăng bán thành công";
        }
    };
    return (
        <View style={styles.container}>
            <Image source={require("../../assets/images/tick-front.png")} />
            <Text style={styles.title}>Hoàn thành!</Text>
            <Text style={styles.subtitle}>{selectSubtitle()}</Text>
            <CustomButton text="Thoát" onPress={handleQuit} />
        </View>
    );
};

const mapStateToProps = (state) => ({
    product: state.user.product,
    userData: state.auth.userData,
});

export default connect(mapStateToProps)(SuccessScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: "8%",
    },
    title: {
        color: colors.text.black_100,
        textAlign: "center",
        fontFamily: "helvetica-neue-bold",
        fontSize: 28,
        marginTop: "5%",
    },
    subtitle: {
        color: colors.text.black_100,
        textAlign: "center",
        fontFamily: "helvetica-neue-medium",
        fontSize: 16,
        lineHeight: 24,
        marginTop: "10%",
        marginBottom: "10%",
    },
});
