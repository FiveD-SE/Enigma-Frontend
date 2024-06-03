import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Linking,
} from "react-native";
import { Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import Accordion from "../../components/Accordion";
import AddNewAddressButton from "../../components/AddNewAddressButton";
import ChooseAddressInfo from "../../components/ChooseAddressInfo";
import TotalOrderList from "../../components/TotalOrderList";
import SelectedProductList from "../../components/SelectedProductList";
import PaymentMethodButton from "../../components/PaymentMethodButton";
import CustomButton from "../../components/CustomButton";
import ToggleButton from "../../components/ToggleButton";
import { colors } from "../../assets/colors";
import { createPaymentLink } from "../../services/payosService";
import Toast from "react-native-toast-message";
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
    updateDoc,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { uploadImageToFirebase } from "../../services/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { calculateFee } from "../../services/ghnService";
import { saveUserData } from "../../redux/actions/userActions";

const CASH_ICON = require("../../assets/images/cash.png");
const COIN_ICON = require("../../assets/images/dollar.png");
const PAYOS_ICON = require("../../assets/images/bank.png");

const addressInfo = [
    {
        name: "Trương Lê Vỉnh Phúc",
        phoneNumber: "0346123456",
        address:
            "KTX Khu B, Đường Nguyễn Du, Khu Phố 6, Phường Đông Hòa,Thành Phố Dĩ An, Bình Dương",
        isDefault: true,
    },
];

const paymentMethods = {
    cash: { title: "Tiền mặt", imageSource: CASH_ICON },
    payos: {
        title: "Chuyển khoản ngân hàng",
        imageSource: PAYOS_ICON,
    },
};

const OrderConfirmationScreen = ({ route, userData, saveUserData }) => {
    const { productOrders, cartOrders } = route.params;

    console.log(
        "productOrders: ",
        JSON.stringify({ ...productOrders, front: "", back: "" }, null, 2)
    );

    const navigation = useNavigation();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [shippingFee, setShippingFee] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [coin, setCoin] = useState(userData.credit);
    const [isUsingCoins, setIsUsingCoins] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [addresses, setAddresses] = useState(addressInfo);

    const generateRandomString = (length) => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    };

    useEffect(() => {
        const findDefaultAddress = () => {
            const defaultAddress = addresses.find((item) => item.isDefault);
            if (defaultAddress) {
                setSelectedAddress({
                    index: addresses.findIndex(
                        (item) => item === defaultAddress
                    ),
                    item: defaultAddress,
                });
            }
        };

        findDefaultAddress();
    }, [addresses]);

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

    useEffect(() => {
        if (addresses.length === 0) {
            Alert.alert(
                "Thông báo",
                "Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng.",
                [
                    {
                        text: "Thêm địa chỉ",
                        onPress: () =>
                            navigation.navigate("AddNewAddressScreen"),
                    },
                    {
                        text: "Quay lại",
                        onPress: () => navigation.goBack(),
                        style: "cancel",
                    },
                ],
                { cancelable: false }
            );
        }
    }, [addresses]);

    const calculateShippingFee = async (address) => {
        try {
            const from_district_id = 3695;
            const from_ward_code = "90768";
            const service_id = null;
            const service_type_id = 2;
            const to_district_id = address.item.districtId;
            const to_ward_code = address.item.wardId;
            const height = 10;
            const length = 50;
            const weight = 200;
            const width = 20;
            const insurance_value = 1000;
            const cod_failed_amount = 2000;
            const coupon = null;

            const feeData = {
                from_district_id,
                from_ward_code,
                service_id,
                service_type_id,
                to_district_id,
                to_ward_code,
                height,
                length,
                weight,
                width,
                insurance_value,
                cod_failed_amount,
                coupon,
            };
            const feeResponse = await calculateFee(feeData);

            const newShippingFee = feeResponse;
            setShippingFee(newShippingFee);
        } catch (error) {
            console.log("Error calculating shipping fee:", error);
        }
    };

    useEffect(() => {
        if (selectedAddress) {
            calculateShippingFee(selectedAddress);
        }
    }, [selectedAddress]);

    const isAddressSelected = () => {
        return selectedAddress !== null;
    };

    const goToAddNewAddressScreen = () => {
        navigation.navigate("AddNewAddressScreen");
    };

    const handleSelectedAddressChange = (selectedItem) => {
        setSelectedAddress({
            index: addresses.findIndex((item) => item === selectedItem),
            item: selectedItem,
        });
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };

    const renderAddressInfo = () => {
        return addresses.map((item, index) => {
            const address = `${item.street}, ${item.wardName}, ${item.districtName}, ${item.provinceName}`;
            const isChecked =
                selectedAddress && selectedAddress.index === index;

            return (
                <ChooseAddressInfo
                    key={index}
                    name={item.name}
                    phoneNumber={item.phoneNumber}
                    address={address}
                    isChecked={isChecked}
                    onPress={() => handleSelectedAddressChange(item)}
                />
            );
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const renderPaymentMethods = () => {
        return Object.keys(paymentMethods).map((method) => {
            const { title, imageSource } = paymentMethods[method];
            const isChecked = selectedPaymentMethod === method;
            return (
                <PaymentMethodButton
                    key={method}
                    title={title}
                    imageSource={imageSource}
                    isChecked={isChecked}
                    onPress={() => handlePaymentMethodChange(method)}
                />
            );
        });
    };

    const handleConfirm = async () => {
        try {
            if (selectedPaymentMethod === null) {
                Toast.show({
                    type: "error",
                    text1: "Vui lòng chọn phương thức thanh toán",
                    text2: "Chọn phương thức thanh toán để tiếp tục",
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

            setPaymentLoading(true);

            if (selectedPaymentMethod === "payos") {
                const formValueData = {
                    orderCode: Number(String(Date.now()).slice(-6)),
                    description: productOrders
                        ? `${productOrders.size} ${productOrders.color}`
                        : `${cartOrders.size} ${cartOrders.color}`,
                    amount: totalAmount,
                };
                //console.log("Form value data:", formValueData);
                setFormValue(formValueData);
                const response = await createPaymentLink(formValueData);
                if (response && response.paymentUrl) {
                    Linking.openURL(response.paymentUrl);
                } else {
                    console.log("Payment link creation failed:", response);
                }
            } else {
                await saveOrderToFirebase();
                // console.log(
                //     "cartOrders: ",
                //     JSON.stringify(cartOrders, null, 2)
                // );

                if (cartOrders && cartOrders.length > 0) {
                    for (const item of cartOrders) {
                        if (item.userId && item.userId !== userData.id) {
                            const productPrice = parseInt(item.totalPrice);
                            const materialPrice =
                                item.productMaterial.materialPrice;
                            const printPrice = item.productPrint.printPrice;
                            const quantity = item.quantity;
                            let creditAmount =
                                (productPrice - (materialPrice + printPrice)) *
                                quantity;
                            if (creditAmount < 0) {
                                creditAmount = 0;
                            }
                            console.log("Credit amount:", creditAmount);

                            // Update original user's credit
                            const originalUserRef = doc(
                                collection(db, "users"),
                                item.userId
                            );
                            const originalUserSnapshot = await getDoc(
                                originalUserRef
                            );
                            if (originalUserSnapshot.exists()) {
                                const originalUserData =
                                    originalUserSnapshot.data();
                                const updatedCredit =
                                    (originalUserData.credit || 0) +
                                    creditAmount;
                                await updateDoc(originalUserRef, {
                                    credit: updatedCredit,
                                });
                            }
                        }
                    }
                } else {
                    console.log("cartList is undefined or empty.");
                }

                // console.log(
                //     "productOrders: ",
                //     JSON.stringify(productOrders, null, 2)
                // );
                if (
                    productOrders &&
                    productOrders.ownerId &&
                    productOrders.ownerId !== userData.id
                ) {
                    const productPrice = parseInt(productOrders.totalPrice);
                    const materialPrice =
                        productOrders.productMaterial.materialPrice;
                    const printPrice = productOrders.productPrint.printPrice;
                    const quantity = productOrders.quantity;
                    let creditAmount =
                        (productPrice - (materialPrice + printPrice)) *
                        quantity;
                    if (creditAmount < 0) {
                        creditAmount = 0;
                    }
                    console.log("Credit amount:", creditAmount);

                    // Update original user's credit
                    const originalUserRef = doc(
                        collection(db, "users"),
                        productOrders.ownerId
                    );
                    const originalUserSnapshot = await getDoc(originalUserRef);
                    if (originalUserSnapshot.exists()) {
                        const originalUserData = originalUserSnapshot.data();
                        const updatedCredit =
                            (originalUserData.credit || 0) + creditAmount;
                        await updateDoc(originalUserRef, {
                            credit: updatedCredit,
                        });
                    }
                }

                if (isUsingCoins) {
                    const updatedCredit =
                        userData.credit - coin > 0 ? userData.credit - coin : 0;
                    const userRef = doc(collection(db, "users"), userData.id);
                    await updateDoc(userRef, { credit: updatedCredit });
                    saveUserData({ ...userData, credit: updatedCredit });
                }
                navigation.navigate("SuccessScreen", { isConfirmOrder: true });
            }
            await removeItemsFromCart(
                cartOrders,
                userData.id,
                route.params?.fromCartScreen
            );
        } catch (error) {
            console.log("Error processing order:", error);
        } finally {
            setPaymentLoading(false);
        }
    };

    const items = productOrders ? [productOrders] : cartOrders || [];
    const totalPrice = items.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.totalPrice;
    }, 0);

    const removeItemsFromCart = async (cartOrders, userId, fromCartScreen) => {
        try {
            if (fromCartScreen) {
                const cartListQuery = query(
                    collection(db, "carts"),
                    where("userId", "==", userId)
                );
                const cartListSnapshot = await getDocs(cartListQuery);

                cartListSnapshot.forEach(async (cartDoc) => {
                    const cartItems = cartDoc.data().cartList;

                    const remainingItems = cartItems.filter(
                        (cartItem) =>
                            !cartOrders.some(
                                (order) =>
                                    order.itemDetailId === cartItem.itemDetailId
                            )
                    );

                    const cartDocRef = doc(db, "carts", cartDoc.id);
                    await updateDoc(cartDocRef, { cartList: remainingItems });
                });
            } else {
                console.log(
                    "Navigation did not come from the cart screen. Items were not removed from the cart."
                );
            }
        } catch (error) {
            console.error("Error removing items from cart: ", error);
        }
    };

    const saveOrderToFirebase = async () => {
        try {
            const orderId = doc(collection(db, "orders")).id;
            if (productOrders) {
                let productImageFrontURL = null;
                let productImageBackURL = null;
                console.log(
                    "productOrders.originalFrontUri: ",
                    productOrders.originalFrontUri
                );
                console.log(
                    "productOrders.originalBackUri: ",
                    productOrders.originalBackUri
                );

                if (productOrders.isUploadToStorage) {
                    productImageFrontURL = await uploadImageToFirebase(
                        productOrders.originalFrontUri,
                        `front_${orderId}.jpg`
                    );

                    productImageBackURL = await uploadImageToFirebase(
                        productOrders.originalBackUri,
                        `back_${orderId}.jpg`
                    );
                } else {
                    productImageFrontURL = productOrders.front;
                    productImageBackURL = productOrders.back;
                }

                console.log("productImageFrontURL: ", productImageFrontURL);
                console.log("productImageBackURL: ", productImageBackURL);

                const items = [productOrders].map((order) => ({
                    productId: order.productId || generateRandomString(10),
                    name: order.name || null,
                    description: order.description || "",
                    front: productImageFrontURL,
                    back: productImageBackURL,
                    size: order.size,
                    color: order.color,
                    price: order.price,
                    productMaterial: {
                        materialName: order.productMaterial.materialName,
                        materialPrice: order.productMaterial.materialPrice,
                    },
                    productPrint: {
                        printName: order.productPrint.printName,
                        printPrice: order.productPrint.printPrice,
                    },
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    userId: userData.id,
                }));

                const orderData = {
                    orderDate: new Date(),
                    orderState: "1",
                    productOrders: items,
                    userId: userData.id,
                    totalAmount: totalAmount,
                };

                await setDoc(doc(collection(db, "orders"), orderId), orderData);

                try {
                    console.log("items: ", items);
                    console.log("Item is called");
                    const newNotificationRef = doc(
                        collection(db, "notifications")
                    );
                    const notificationId = newNotificationRef.id;

                    const notification = {
                        notificationId,
                        notificationContent:
                            "Đơn hàng của bạn đã được xác nhận!",
                        notificationTitle: "Đơn hàng đã được xác nhận",
                        notificationCreatedDate: new Date(),
                        notificationStatus: false,
                        notificationType: 2,
                        productOrders: productOrders ? items : cartOrders,
                        userId: userData.id,
                    };

                    console.log("Notification: ", notification);
                    await setDoc(newNotificationRef, notification);
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
            } else {
                //console.log("cartOrders ", JSON.stringify(cartOrders, null, 2));
                const items = cartOrders.map((order) => ({
                    productId: order.productId || null,
                    name: order.name || null,
                    description: order.description || "",
                    front: order.front,
                    back: order.back,
                    size: order.size,
                    color: order.color,
                    price: order.price,
                    productMaterial: {
                        materialName: order.productMaterial.materialName,
                        materialPrice: order.productMaterial.materialPrice,
                    },
                    productPrint: {
                        printName: order.productPrint.printName,
                        printPrice: order.productPrint.printPrice,
                    },
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    userId: order.userId,
                }));

                console.log("items: ", JSON.stringify(items, null, 2));

                const orderData = {
                    orderDate: new Date(),
                    orderState: "1",
                    productOrders: items,
                    userId: userData.id,
                    totalAmount: totalAmount,
                };

                await setDoc(doc(collection(db, "orders"), orderId), orderData);

                try {
                    console.log("items: ", items);
                    console.log("Item is called");
                    const newNotificationRef = doc(
                        collection(db, "notifications")
                    );
                    const notificationId = newNotificationRef.id;

                    const notification = {
                        notificationId,
                        notificationContent:
                            "Đơn hàng của bạn đã được xác nhận!",
                        notificationTitle: "Đơn hàng đã được xác nhận",
                        notificationCreatedDate: new Date(),
                        notificationStatus: false,
                        notificationType: 2,
                        productOrders: productOrders ? items : cartOrders,
                        userId: userData.id,
                    };

                    console.log("Notification: ", notification);
                    await setDoc(newNotificationRef, notification);
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
            }
        } catch (error) {
            //console.log("items: ", JSON.stringify(items, null, 2))
            console.error("Error adding document: ", error);
            console.log("Error adding order to Firebase: ", error);
        }
    };

    const handleContinue = async () => {
        if (selectedPaymentMethod === "payos") {
            try {
                const response = await fetch(
                    `https://enigma-dropshipping.up.railway.app/payment-link/${formValue.orderCode}`
                );
                const data = await response.json();
                const dataStatus = data.data.status;
                console.log("Payment link information:", data);

                if (dataStatus === "PAID") {
                    navigation.navigate("SuccessScreen", {
                        isConfirmOrder: true,
                    });
                } else {
                    console.error("Payment link is not confirmed");
                    Toast.show({
                        type: "error",
                        text1: "Lỗi",
                        text2: "Thanh toán chưa được xác nhận",
                        text1Style: {
                            fontSize: 16,
                            fontFamily: "helvetica-neue-bold",
                        },
                        text2Style: {
                            fontSize: 12,
                            fontFamily: "helvetica-neue-bold",
                            color: colors.text.black_50,
                        },
                    });
                }
            } catch (error) {
                console.log("Error getting payment link information:", error);
            }
        } else {
            navigation.navigate("SuccessScreen");
        }
    };

    useEffect(() => {
        let amount = totalPrice + shippingFee - discount;
        setTotalAmount(amount);
    }, [totalPrice, shippingFee, discount, isUsingCoins]);

    return (
        <>
            <ScrollView style={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <Accordion value={"Chọn địa chỉ giao hàng"}>
                        <View style={styles.contentContainer}>
                            {renderAddressInfo()}
                            <AddNewAddressButton
                                onPress={goToAddNewAddressScreen}
                            />
                        </View>
                    </Accordion>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
                        {productOrders && (
                            <SelectedProductList orderList={[productOrders]} />
                        )}
                        {cartOrders && (
                            <SelectedProductList orderList={cartOrders} />
                        )}
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Tổng cộng</Text>
                        <TotalOrderList
                            totalPrice={totalPrice}
                            shippingFee={shippingFee}
                            discount={discount}
                        />
                    </View>
                    <View style={styles.coinContainer}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={COIN_ICON}
                                style={styles.iconImage}
                            />
                            <Text style={styles.coinText}>
                                Sử dụng {coin} xu
                            </Text>
                        </View>
                        <ToggleButton
                            isOn={isUsingCoins}
                            onToggle={() => {
                                if (coin !== 0) {
                                    setDiscount(!isUsingCoins ? coin : 0);
                                    setIsUsingCoins(!isUsingCoins);
                                }
                            }}
                        />
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>
                            Phương thức thanh toán
                        </Text>
                        {renderPaymentMethods()}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.totalPriceContainer}>
                    <Text style={styles.label}>Tổng cộng:</Text>
                    <Text style={styles.price}>
                        {formatCurrency(totalAmount)}
                    </Text>
                </View>
                <CustomButton
                    text={paymentLoading ? "Đang xử lý..." : "Tiếp tục"}
                    onPress={handleConfirm}
                    disabled={paymentLoading}
                />
                {selectedPaymentMethod == "payos" && (
                    <CustomButton
                        text={
                            paymentLoading
                                ? "Đang xử lý..."
                                : "Kiểm tra thanh toán"
                        }
                        onPress={handleContinue}
                        disabled={paymentLoading}
                    />
                )}
            </View>
        </>
    );
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
});

const mapDispatchToProps = {
    saveUserData,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderConfirmationScreen);

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    container: {
        padding: "5%",
        flexDirection: "column",
    },
    contentContainer: {
        padding: "4%",
    },
    sectionContainer: {
        marginTop: "5%",
    },
    sectionTitle: {
        color: colors.text.black_50,
        fontSize: 16,
        fontFamily: "helvetica-neue-bold",
        marginBottom: "2%",
    },
    detailsContainer: {
        backgroundColor: colors.background.black_20,
        padding: "5%",
        borderRadius: 5,
    },
    coinContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: "5%",
    },
    coinText: {
        color: colors.text.black_100,
        fontSize: 14,
        fontFamily: "helvetica-neue-bold",
        marginLeft: "8%",
    },
    footer: {
        backgroundColor: colors.background.white_100,
        borderTopColor: colors.background.black_20,
        borderTopWidth: 1,
        paddingHorizontal: "5%",
        paddingVertical: "5%",
    },
    totalPriceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: colors.text.black_100,
        fontSize: 16,
        fontFamily: "helvetica-neue-bold",
    },
    price: {
        color: colors.text.black_100,
        fontSize: 20,
        fontFamily: "helvetica-neue-bold",
    },
    iconImage: {
        width: 30,
        height: 30,
    },
});
