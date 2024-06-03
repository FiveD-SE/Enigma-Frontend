import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import Checkbox from "expo-checkbox";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as SVG from "../../assets/svgs";
import InputField from "../../components/InputField";
import PasswordInput from "../../components/PasswordInput";
import CustomTextButton from "../../components/CustomTextButton";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../assets/colors";
import {
    saveUserData,
    updateProducts,
    updateUserLikes,
    updateUsers,
} from "../../redux/actions/userActions";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    getDocs,
    arrayUnion,
    arrayRemove,
    increment,
} from "firebase/firestore";

const ENIGMA_BACKGROUND = require("../../assets/images/enigma-background.jpg");

const SignInScreen = ({
    saveUserData,
    userData,
    products,
    users,
    likedProducts,
    updateProducts,
    updateUsers,
    updateUserLikes,
}) => {
    const navigation = useNavigation();
    const [isChecked, setChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [userLiked, setUserLiked] = useState({});

    // Function to convert Firestore timestamp to milliseconds since Unix epoch
    const convertFirestoreTimestampToMillis = (timestamp) => {
        return (
            timestamp.seconds * 1000 +
            Math.floor(timestamp.nanoseconds / 1000000)
        );
    };

    // Function to convert timestamps in the products array to milliseconds
    const convertDateCreatedToMillis = (productsArray) => {
        return productsArray.map((product) => {
            return {
                ...product,
                dateCreated: convertFirestoreTimestampToMillis(
                    product.dateCreated
                ),
            };
        });
    };

    const convertCreatedAtToMillis = (usersArray) => {
        return usersArray.map((user) => {
            return {
                ...user,
                createdAt: convertFirestoreTimestampToMillis(user.createdAt),
            };
        });
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const q = query(
                    collection(db, "products"),
                    orderBy("likedTotal", "desc")
                );
                const querySnapshot = await getDocs(q);
                const dataList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const productsData = convertDateCreatedToMillis(dataList);
                updateProducts(productsData);
                setLoading(false);
            } catch (error) {

                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                const q = query(collection(db, "users"));
                const querySnapshot = await getDocs(q);
                const dataList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const usersData = convertCreatedAtToMillis(dataList);
                updateUsers(usersData);
            } catch (error) {

            }
        };

        fetchProductData();
        fetchUserData();
    }, []); // Empty dependency array ensures this runs only once

    const handleRememberMe = () => {
        setChecked(!isChecked);
    };

    const goToForgotPassword = () => {
        navigation.navigate("SendOTPScreen");
    };

    const goToSignUp = () => {
        navigation.navigate("SignUpScreen");
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;
            // Kiểm tra xem email đã được xác minh hay chưa
            if (user.emailVerified) {
                // Thực hiện đăng nhập
                const userDocSnap = await getDoc(doc(db, "users", user.uid));
                if (userDocSnap.exists()) {
                    const userDoc = userDocSnap.data();

                    const userData = {
                        id: user.uid,
                        email: user.email,
                        name: userDoc.fullName,
                        phoneNumber: userDoc.phoneNumber,
                        credit: userDoc.credit,
                        likedProductId: userDoc.likedProductId,
                        stabilityApiKey: userDoc.stabilityApiKey,
                        removeBgApiKey: userDoc.photoroomApiKey,
                        userImage: userDoc.userImage,
                    };

                    saveUserData(userData);
                    updateUserLikes(userData.likedProductId);


                    if (isChecked) {
                        await AsyncStorage.setItem("email", email);
                        await AsyncStorage.setItem("password", password);
                        await AsyncStorage.setItem("isRemembered", "true");
                    } else {
                        await AsyncStorage.removeItem("email");
                        await AsyncStorage.removeItem("password");
                        await AsyncStorage.setItem("isRemembered", "false");
                    }
                    updateUserLikes(userData.likedProductId || []);
                    navigation.navigate("AppNavigator"); // Ensure navigation to main app screen
                }
            } else {
                // Nếu email chưa được xác minh, hiển thị thông báo lỗi
                Toast.show({
                    type: "error",
                    text1: "Lỗi đăng nhập",
                    text2: "Email của bạn chưa được xác minh. Vui lòng kiểm tra email và xác minh tài khoản của bạn trước khi đăng nhập.",
                });
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Lỗi đăng nhập",
                text2: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
            });
        }
    };

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
                <Text style={styles.title}>Đăng nhập</Text>
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
                            onValueChange={handleRememberMe}
                        />
                        <Text style={[styles.helperText, { lineHeight: 24 }]}>
                            Ghi nhớ tôi
                        </Text>
                    </View>
                    <CustomTextButton
                        text="Quên mật khẩu?"
                        onPress={goToForgotPassword}
                    />
                </View>
                <CustomButton text="Đăng nhập" onPress={handleSignIn} arrow />
                <View style={styles.helperContainer}>
                    <Text style={[styles.helperText, { lineHeight: 27 }]}>
                        Chưa có tài khoản?
                    </Text>
                    <View style={{ marginLeft: "2%" }}>
                        <CustomTextButton
                            text="Tạo tài khoản"
                            onPress={goToSignUp}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
    products: state.user.products,
    users: state.user.users,
    likedProducts: state.user.userLikes,
});

const mapDispatchToProps = {
    saveUserData,
    updateUsers,
    updateUserLikes,
    updateProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        marginTop: "5%",
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
        fontStyle: "normal",
        fontWeight: "700",
        lineHeight: 40,
    },
    helperContainer: {
        flexDirection: "row",
        marginTop: "5%",
    },
    helperText: {
        color: colors.text.black_100,
        fontFamily: "helvetica-neue-regular",
        fontSize: 16,
    },
    checkbox: {
        borderColor: colors.background.black_100,
        borderRadius: 2,
        marginRight: "5%",
    },
    imageStyle: {
        opacity: 0.5,
        borderWidth: 3,
        borderColor: colors.accent.lightGrey_100,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
});
