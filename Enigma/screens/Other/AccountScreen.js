import {
    StyleSheet,
    View,
    ScrollView,
    Alert,
    TouchableOpacity,
    Pressable,
    Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../assets/colors";
import Accordion from "../../components/Accordion";
import ProfileInfoRow from "../../components/ProfileInfoRow";
import PasswordInput from "../../components/PasswordInput";
import CustomButton from "../../components/CustomButton";
import AddressInfo from "../../components/AddressInfo";
import { useNavigation } from "@react-navigation/native";
import AddNewAddressButton from "../../components/AddNewAddressButton";
import RequestDeleteButton from "../../components/RequestDeleteButton";
import { connect } from "react-redux";
import {
    doc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { saveUserData } from "../../redux/actions/userActions";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
    getAuth,
    signInWithEmailAndPassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
} from "firebase/auth";

const addressInfo = [
    {
        name: "Trương Lê Vỉnh Phúc",
        phoneNumber: "0346123456",
        address:
            "KTX Khu B, Đường Nguyễn Du, Khu Phố 6, Phường Đông Hòa,Thành Phố Dĩ An, Bình Dương",
        isDefault: true,
    },
];

const AccountScreen = ({ userData, saveUserData }) => {
    console.log("User Data: ", userData);
    const navigation = useNavigation();
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
    const [editMode, setEditMode] = useState(false);
    const [addresses, setAddresses] = useState(addressInfo);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [deleteAccountMode, setDeleteAccountMode] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const q = query(
                    collection(db, "addresses"),
                    where("userId", "==", userData.id)
                );
                const querySnapshot = await getDocs(q);
                const loadedAddresses = [];
                querySnapshot.forEach((doc) => {
                    loadedAddresses.push(doc.data());
                });
                setAddresses(loadedAddresses);
            } catch (error) {
                console.error("Error loading addresses:", error);
            }
        };

        loadAddresses();
        const unsubscribe = navigation.addListener("focus", () => {
            loadAddresses();
        });

        return unsubscribe;
    }, [userData.id, navigation]);

    const handleEditInfo = () => {
        setEditMode(!editMode);
    };

    const handleSaveProfileInfo = async () => {
        setEditMode(false);
        Alert.alert("Thành công", "Thông tin cá nhân của bạn đã được thay đổi");
        const userDocRef = doc(db, "users", userData.id);
        await updateDoc(userDocRef, {
            fullName: name,
            phoneNumber: phoneNumber,
        });

        const newUserData = {
            ...userData,
            name: name,
            email: email,
            phoneNumber: phoneNumber,
        };
        saveUserData(newUserData);
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            const batch = writeBatch(db);

            const updatedAddresses = addresses.map((address) => {
                if (address.addressId === addressId) {
                    return { ...address, isDefault: true };
                } else {
                    return { ...address, isDefault: false };
                }
            });

            setAddresses(updatedAddresses);

            updatedAddresses.forEach((address) => {
                const docRef = doc(db, "addresses", address.addressId);
                batch.update(docRef, { isDefault: address.isDefault });
            });

            await batch.commit();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Đã có lỗi xảy ra khi cập nhật địa chỉ",
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

    const goToChangeAddressScreen = (item) => {
        navigation.navigate("ChangeAddressScreen", item);
    };

    const goToAddNewAddressScreen = () => {
        navigation.navigate("AddNewAddressScreen");
    };

    const renderAddressInfo = () => {
        const sortedAddresses = [...addresses].sort(
            (a, b) => b.isDefault - a.isDefault
        );
        return sortedAddresses.map((item) => {
            const address = `${item.street}, ${item.wardName}, ${item.districtName}, ${item.provinceName}`;
            return (
                <AddressInfo
                    key={`${item.addressId}-${item.phoneNumber}`}
                    name={item.name}
                    phoneNumber={item.phoneNumber}
                    address={address}
                    isDefault={item.isDefault}
                    onSetDefaultAddress={() =>
                        handleSetDefaultAddress(item.addressId)
                    }
                    onChangeAddress={() => goToChangeAddressScreen(item)}
                />
            );
        });
    };
    const handleDeleteAccountRequest = () => {
        setDeleteAccountMode(true);
    };

    const handleConfirmDeleteAccount = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập để xoá tài khoản.");
                return;
            }

            // Kiểm tra xem người dùng đã nhập mật khẩu xác nhận chưa
            if (!deletePassword) {
                Alert.alert(
                    "Lỗi",
                    "Vui lòng nhập mật khẩu để xác nhận xóa tài khoản."
                );
                return;
            }

            // Xác nhận xóa tài khoản
            Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn xoá tài khoản? Hành động này không thể hoàn tác.",
                [
                    {
                        text: "Huỷ",
                        style: "cancel",
                    },
                    {
                        text: "Xoá",
                        style: "destructive",
                        onPress: async () => {
                            // Xác thực lại tài khoản bằng mật khẩu
                            const credential = EmailAuthProvider.credential(
                                userData.email,
                                deletePassword
                            );
                            try {
                                await reauthenticateWithCredential(
                                    user,
                                    credential
                                );
                            } catch (error) {
                                console.log("Error reauthenticating:", error);
                                Toast.show({
                                    type: "error",
                                    text1: "Lỗi",
                                    text2: "Mật khẩu không chính xác.",
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

                            // Xoá tài khoản trên Firebase
                            try {
                                await user.delete();
                            } catch (error) {
                                console.log("Error deleting account:", error);
                                Toast.show({
                                    type: "error",
                                    text1: "Lỗi",
                                    text2: "Đã có lỗi xảy ra khi xoá tài khoản.",
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

                            // Xoá dữ liệu liên quan đến tài khoản người dùng
                            // ...

                            // Xoá thông tin đăng nhập trên thiết bị
                            await AsyncStorage.removeItem("email");
                            await AsyncStorage.removeItem("password");
                            await AsyncStorage.removeItem("isRemembered");

                            // Tải lại ứng dụng
                            await Updates.reloadAsync();

                            Toast.show({
                                type: "success",
                                text1: "Thành công",
                                text2: "Tài khoản của bạn đã được xoá.",
                            });
                        },
                    },
                ]
            );
        } catch (error) {
            console.log("Error deleting account:", error);
            // Xử lý lỗi chung
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Đã có lỗi xảy ra khi xoá tài khoản.",
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

    const handlePasswordChange = async () => {
        try {
            if (!oldPassword || !newPassword || !confirmPassword) {
                Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: "Vui lòng điền đầy đủ thông tin",
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

            if (newPassword !== confirmPassword) {
                Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: "Mật khẩu mới không trùng khớp",
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

            if (oldPassword === newPassword) {
                Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: "Mật khẩu mới không được trùng với mật khẩu cũ",
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

            if (newPassword.length < 6) {
                Toast.show({
                    type: "error",
                    text1: "Lỗi",
                    text2: "Mật khẩu mới phải có ít nhất 6 ký tự",
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

            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Lỗi", "Người dùng chưa đăng nhập");
                return;
            }

            const credential = EmailAuthProvider.credential(
                userData.email,
                oldPassword
            );
            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, newPassword);
            // set password to firestore
            const userDocRef = doc(db, "users", userData.id);
            await updateDoc(userDocRef, {
                password: newPassword,
            });

            await AsyncStorage.setItem("password", newPassword);

            await AsyncStorage.removeItem("email");
            await AsyncStorage.removeItem("password");
            await AsyncStorage.removeItem("isRemembered");
            await Updates.reloadAsync();

            Alert.alert("Thành công", "Mật khẩu đã được thay đổi thành công");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Mật khẩu cũ không chính xác",
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

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                showsVerticalScrollIndicator={false}
            >
                <Accordion
                    value={"Hồ sơ"}
                    enableEdit={true}
                    onPressEdit={handleEditInfo}
                >
                    <View style={styles.contentContainer}>
                        <ProfileInfoRow
                            label="Họ và tên:"
                            value={name}
                            enableEdit={true}
                            editMode={editMode}
                            onChangeText={setName}
                        />
                        <ProfileInfoRow
                            label="Email:"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <ProfileInfoRow
                            label="Số điện thoại:"
                            value={phoneNumber}
                            enableEdit={true}
                            editMode={editMode}
                            keyboardNumber={true}
                            onChangeText={setPhoneNumber}
                        />
                        {editMode && (
                            <CustomButton
                                text="Lưu"
                                onPress={handleSaveProfileInfo}
                            />
                        )}
                    </View>
                </Accordion>
                <Accordion value={"Địa chỉ"}>
                    <View style={styles.contentContainer}>
                        {renderAddressInfo()}
                        <AddNewAddressButton
                            onPress={goToAddNewAddressScreen}
                        />
                    </View>
                </Accordion>
                <Accordion value={"Quyền riêng tư"}>
                    <View style={styles.contentContainer}>
                        {deleteAccountMode ? (
                            <>
                                <Text style={styles.passwordText}>
                                    Nhập mật khẩu để xác nhận xoá tài khoản
                                </Text>
                                <PasswordInput
                                    onChangeText={setDeletePassword}
                                />
                                <Pressable
                                    style={styles.confirmButton}
                                    onPress={handleConfirmDeleteAccount}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        Xác nhận xoá tài khoản
                                    </Text>
                                </Pressable>
                            </>
                        ) : (
                            <RequestDeleteButton
                                text={"Xoá tài khoản"}
                                onPress={handleDeleteAccountRequest}
                            />
                        )}
                    </View>
                </Accordion>

                <Accordion value={"Đổi mật khẩu"}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.passwordText}>Mật khẩu cũ</Text>
                        <PasswordInput onChangeText={setOldPassword} />
                        <Text style={[styles.passwordText, { marginTop: 15 }]}>
                            Mật khẩu mới
                        </Text>
                        <PasswordInput onChangeText={setNewPassword} />
                        <Text style={[styles.passwordText, { marginTop: 15 }]}>
                            Nhập lại mật khẩu mới
                        </Text>
                        <PasswordInput onChangeText={setConfirmPassword} />

                        <Pressable
                            style={styles.confirmButton}
                            onPress={handlePasswordChange}
                        >
                            <Text style={styles.confirmButtonText}>
                                Xác nhận
                            </Text>
                        </Pressable>
                    </View>
                </Accordion>
            </ScrollView>
        </View>
    );
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
});

const mapDispatchToProps = {
    saveUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);

const styles = StyleSheet.create({
    scrollViewContainer: {
        marginBottom: "50%",
    },
    passwordText: {
        color: colors.text.black_100,
        fontSize: 16,
        fontFamily: "helvetica-neue-bold",
    },
    confirmButton: {
        backgroundColor: colors.background.black_100,
        width: "100%",
        height: 50,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    confirmButtonText: {
        color: colors.text.white_100,
        fontSize: 16,
        fontFamily: "helvetica-neue-bold",
    },
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
        padding: "5%",
    },
    contentContainer: {
        padding: "4%",
    },
    button: {
        height: 50,
        width: "50%",
        alignSelf: "center",
        marginTop: 20,
        color: colors.background.white_100,
        backgroundColor: colors.background.black_100,
    },
});
