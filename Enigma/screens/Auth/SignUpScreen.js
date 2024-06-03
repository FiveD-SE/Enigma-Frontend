import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Platform,
    Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import Toast from "react-native-toast-message";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth, db, storage } from "../../services/firebase";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

import * as SVG from "../../assets/svgs";
import { colors } from "../../assets/colors";
import InputField from "../../components/InputField";
import PasswordInput from "../../components/PasswordInput";
import CustomTextButton from "../../components/CustomTextButton";
import CustomButton from "../../components/CustomButton";
import Hyperlink from "../../components/Hyperlink";
import { getDownloadURL, ref } from "firebase/storage";

const ENIGMA_BACKGROUND = require("../../assets/images/enigma-background.jpg");

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChecked, setChecked] = useState(false);

    const goToSignIn = () => {
        navigation.navigate("SignInScreen");
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Mật khẩu không trùng khớp",
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
            return;
        }

        if (password.length < 6) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Mật khẩu phải chứa ít nhất 6 ký tự",
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
            return;
        }

        if (!isChecked) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Vui lòng đồng ý với điều khoản và chính sách",
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
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            const storageRef = ref(storage, "images/user_icon.png");
            const downloadURL = await getDownloadURL(storageRef);

            await setDoc(doc(collection(db, "users"), user.uid), {
                email: user.email,
                fullName: fullName,
                password: password,
                credit: 0,
                likedProductId: [],
                stabilityApiKey: null,
                photoroomApiKey: null,
                createdAt: new Date(),
                userImage: downloadURL,
            });

            const userId = user.uid;
            await updateDoc(doc(db, "users", userId), {
                userId: userId,
            });

            const newNotificationRef = doc(collection(db, "notifications"));
            const notificationId = newNotificationRef.id;

            const notification = {
                notificationId,
                notificationContent: "Tạo tài khoản thành công!",
                notificationTitle: "Chào mừng bạn đến với Enigma",
                notificationCreatedDate: new Date(),
                notificationStatus: false,
                notificationType: 1,
                productOrder: [],
                userId: user.uid,
            };

            await setDoc(newNotificationRef, notification);

            await sendEmailVerification(user);

            Toast.show({
                type: "success",
                text1: "Đăng ký thành công",
                text2: "Vui lòng kiểm tra email để xác minh tài khoản!",
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
                text1: "Error",
                text2: error.message,
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
        }
    };

    //

    const handleCheckBox = () => {
        setChecked(!isChecked);
    };

    const goToPolicy = () => {
        navigation.navigate("PolicyScreen");
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SVG.LoginSVG />
            </View>
            <ImageBackground
                source={ENIGMA_BACKGROUND}
                style={styles.main}
                imageStyle={styles.imageStyle}
            >
                <Text style={styles.title}>Tạo tài khoản</Text>
                <InputField
                    placeholder="Họ và tên"
                    iconName="person"
                    onChangeText={setFullName}
                />
                <InputField
                    placeholder="Email"
                    keyboardType="email-address"
                    iconName="mail"
                    onChangeText={setEmail}
                />
                <PasswordInput
                    placeholder="Mật khẩu"
                    onChangeText={setPassword}
                />
                <PasswordInput
                    placeholder="Nhập lại mật khẩu"
                    onChangeText={setConfirmPassword}
                />
                <View style={styles.helperContainer}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            marginRight: "auto",
                        }}
                    >
                        <Checkbox
                            style={styles.checkbox}
                            value={isChecked}
                            color={
                                isChecked
                                    ? colors.background.black_100
                                    : undefined
                            }
                            onValueChange={handleCheckBox}
                        />
                        <Hyperlink url={"https://enigma-dropshipping.up.railway.app/"}>
                            <Text style={{ flex: 1 }}>
                                Điều khoản, Chính sách quyền riêng tư và các
                                khoản phí
                            </Text>
                        </Hyperlink>

                    </View>
                </View>
                <CustomButton
                    text="Tạo tài khoản"
                    onPress={handleSignUp}
                    arrow
                />
                <View style={styles.helperContainer}>
                    <Text style={styles.helperText}>Đã có tài khoản?</Text>
                    <View style={{ marginLeft: "2%" }}>
                        <CustomTextButton
                            text="Đăng nhập"
                            onPress={goToSignIn}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    header: {
        flex: 0.5,
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
    helperContainer: {
        flexDirection: "row",
        marginTop: "5%",
    },
    helperText: {
        color: colors.text.black_100,
        fontFamily: "helvetica-neue-medium",
        fontSize: 16,
        lineHeight: Platform.select({
            ios: 27,
            android: 24,
        }),
    },
    checkbox: {
        borderColor: colors.background.black_100,
        borderRadius: 2,
        marginRight: "4%",
    },
    imageStyle: {
        opacity: 0.5,
        borderWidth: 3,
        borderColor: colors.accent.lightGrey_100,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    termsText: {
        color: colors.text.black_100,
        fontSize: 16,
        fontFamily: "helvetica-neue-medium",
        textDecorationLine: "underline",
    },
});
