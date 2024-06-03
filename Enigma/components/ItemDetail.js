import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { colors } from "../assets/colors";
import ItemCard from "./ItemCard";
import CustomButton from "./CustomButton";
import CustomIconButton from "./CustomIconButton";
import { IsOpenProvider } from "../utils/IsOpenContext";
import OrderItemBottomSheet from "./OrderItemBottomSheet";
import {
    collection,
    addDoc,
    doc,
    getDoc,
    query,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useRoute } from "@react-navigation/native";
import { connect } from "react-redux";

const windowHeight = Dimensions.get("window").height;

const ItemDetail = ({ navigation, userData }) => {
    const orderItemBottomSheetRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const [product, setProduct] = useState({});
    const [formatProduct, setFormatProduct] = useState({});
    const [selectedSize, setSelectedSize] = useState(null);
    const [materialName, setMaterialName] = useState(null);
    const [printName, setPrintName] = useState(null);
    const [selectedOverlay, setSelectedOverlay] = useState("front");
    const [mainImage, setMainImage] = useState(product.imageFront);
    const [frontImage, setFrontImage] = useState(product.imageFront);
    const [backImage, setBackImage] = useState(product.imageBack);

    const route = useRoute();
    const { productId } = route.params;

    const handleOpenBottomSheet = (item) => {
        if (!selectedSize) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Vui lòng chọn kích cỡ",
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
            return;
        }
        const selected = {
            name: item.productName,
            price: item.productPrice,
            size: selectedSize,
            color: item.productColor,
            front: item.imageFront,
            back: item.imageBack,
            productMaterial: item.productMaterial,
            productPrint: item.productPrint,
            isUploadToStorage: false,
            ownerId: item.userId,
        };
        setFormatProduct(selected);
        setSelectedItem(selected);
        setIsBottomSheetVisible(true);
    };

    const handleCloseBottomSheet = () => setIsBottomSheetVisible(false);
    const handleSelectSize = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = async () => {
        if (!product) {
            console.error("Product data is not available.");
            return;
        }
        if (!selectedSize) {
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Vui lòng chọn kích cỡ",
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
            return;
        }

        const itemDetail = {
            ...product,
            productSize: selectedSize,
            productQuantity: 1,
            userId: product.userId,
            itemDetailId: productId + selectedSize,
        };

        if (Object.values(itemDetail).some((value) => value === undefined)) {
            console.error(
                "Invalid item detail, some fields are undefined:",
                itemDetail
            );
            return;
        }

        const q = query(
            collection(db, "carts"),
            where("userId", "==", userData.id)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (cart) => {
                const cartData = cart.data();

                const existingProductIndex = cartData.cartList.findIndex(
                    (cartItem) =>
                        cartItem.productId === itemDetail.productId &&
                        cartItem.productSize === itemDetail.productSize
                );

                if (existingProductIndex > -1) {
                    cartData.cartList[
                        existingProductIndex
                    ].productQuantity += 1;
                } else {
                    itemDetail.productQuantity = 1;
                    cartData.cartList.push(itemDetail);
                }

                await updateDoc(doc(db, "carts", cart.id), {
                    cartList: cartData.cartList,
                });
            });
        } else {
            try {
                await addDoc(collection(db, "carts"), {
                    userId: userData.id,
                    cartList: [{ ...itemDetail, productQuantity: 1 }],
                });
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
        navigation.goBack();
        Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Bạn đã thêm vào giỏ hàng thàng công.",
        });
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productDoc = doc(db, "products", productId); // Replace with your product document ID
                const productSnapshot = await getDoc(productDoc);
                if (productSnapshot.exists()) {
                    const productData = productSnapshot.data();
                    setProduct(productData);
                    setMainImage(productData.imageFront);
                    setFrontImage(productData.imageFront);
                    setBackImage(productData.imageBack);
                    setMaterialName(productData.productMaterial.materialName);
                    setPrintName(productData.productPrint.printName);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching product: ", error);
            }
        };

        fetchProduct();
    }, []);

    useEffect(() => {
        if (isBottomSheetVisible) {
            orderItemBottomSheetRef.current?.present();
        }
    }, [isBottomSheetVisible]);

    const handleImageToggle = (imageType) => {
        if (imageType === "front") {
            setSelectedOverlay(imageType);
            setMainImage(product.imageFront);
        } else if (imageType === "back") {
            setSelectedOverlay(imageType);
            setMainImage(product.imageBack);
        }
    };

    return (
        <IsOpenProvider>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: mainImage }}
                            style={styles.mainImage}
                        />
                    </View>

                    <View style={styles.selectOverlayContainer}>
                        <TouchableOpacity
                            onPress={() => handleImageToggle("front")}
                            activeOpacity={0.9}
                        >
                            <View style={styles.toggleButton}>
                                <Image
                                    source={{ uri: frontImage }}
                                    style={[
                                        styles.toggleButtonImage,
                                        selectedOverlay === "front" &&
                                        styles.selectedToggleButtonImage,
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleImageToggle("back")}
                            activeOpacity={0.9}
                        >
                            <View style={styles.toggleButton}>
                                <Image
                                    source={{ uri: backImage }}
                                    style={[
                                        styles.toggleButtonImage,
                                        selectedOverlay === "back" &&
                                        styles.selectedToggleButtonImage,
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mainContentContainer}>
                        <ItemCard
                            title="Tên sản phẩm"
                            description={product.productName}
                        />
                        <ItemCard
                            title="Mô tả"
                            description={product.productDescription}
                        />
                        <ItemCard
                            title="Giá"
                            description={product.productPrice}
                        />
                        <ItemCard
                            title="Kích cỡ"
                            onSelectSize={handleSelectSize}
                        />
                        <ItemCard
                            title="Chất liệu"
                            description={materialName}
                        />
                        <ItemCard title="Họa tiết" description={printName} />
                    </View>
                    <View style={styles.actionsContainer}>
                        <CustomButton
                            text="Mua hàng"
                            onPress={() => handleOpenBottomSheet(product)}
                        />
                        <CustomIconButton
                            text="Thêm vào giỏ"
                            iconName={"cart"}
                            onPress={handleAddToCart}
                        />
                    </View>
                </View>
            </ScrollView>
            {isBottomSheetVisible && (
                <OrderItemBottomSheet
                    bottomSheetRef={orderItemBottomSheetRef}
                    snapPoints={["55%"]}
                    product={formatProduct}
                    isVisible={isBottomSheetVisible}
                    onClose={handleCloseBottomSheet}
                />
            )}
        </IsOpenProvider>
    );
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
});

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: "transparent",
    },
    imageContainer: {
        height: windowHeight * 0.5,
    },
    mainImage: {
        width: "100%",
        height: "100%",
    },
    mainContentContainer: {
        flex: 1,
        backgroundColor: colors.background.white_100,
        padding: "5%",
    },
    actionsContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.background.white_100,
        borderColor: colors.background.black_20,
        borderTopWidth: 1,
        paddingHorizontal: "5%",
        paddingBottom: "10%",
    },
    selectOverlayContainer: {
        flexDirection: "column",
        justifyContent: "center",
        marginRight: "5%",
        backgroundColor: "transparent",
        position: "absolute",
        left: "5%",
        top: "2%",
        gap: 10,
    },
    toggleButton: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.background.black_20,
        overflow: "hidden",
        backgroundColor: colors.background.transparent,
    },
    toggleButtonText: {
        color: colors.text.black_100,
        fontFamily: "helvetica-neue-bold",
        fontSize: 14,
    },
    toggleButtonImage: {
        width: windowHeight * 0.1,
        height: windowHeight * 0.1,
        opacity: 0.6,
    },
    selectedToggleButtonImage: {
        opacity: 1,
    },
});

export default connect(mapStateToProps)(ItemDetail);
