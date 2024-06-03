import React, { useCallback, useRef, useState } from "react";
import {
    Image,
    View,
    Dimensions,
    Pressable,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import Animated from "react-native-reanimated";
import Slider from "@react-native-community/slider";

import CreateProgress from "../../components/CreateProgress";
import ConfirmModal from "../../components/ConfirmModal";
import DraggableAndScalableImage from "../../components/DraggableAndScalableImage";
import { colors } from "../../assets/colors";
import { useExpandAnimation } from "../../utils/useExpandAnimation";
import { mockupUri } from "../../assets/images/uri";
import {
    saveColorOption,
    saveProductFront,
    saveProductBack,
    saveProductName,
    saveProductPrice,
    saveSizeOption,
    saveProductDescription,
    saveOriginalFrontUri,
    saveOriginalBackUri,
} from "../../redux/actions/userActions";
import ToggleButton from "../../components/ToggleButton";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";

const USER_IMAGE_SOURCE = require("../../assets/images/user.png");

const windowHeight = Dimensions.get("window").height;
const sizeOptions = ["S", "M", "L", "XL"];
const colorOptions = ["black", "white", "beige"];

const BagMockupScreen = ({
    imageUri,
    saveOriginalFrontUri,
    saveOriginalBackUri,
    saveProductFront,
    saveProductBack,
    saveProductName,
    saveProductDescription,
    saveColorOption,
    saveSizeOption,
}) => {
    const navigation = useNavigation();
    const { animatedStyleItem } = useExpandAnimation();
    const viewShotRefFront = useRef();
    const viewShotRefBack = useRef();

    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isShowImage, setIsShowImage] = useState(true);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState("black");
    const [selectedMockupOption, setSelectedMockupOption] = useState(0);

    const [isSelectBack, setIsSelectBack] = useState(false);

    const [scale, setScale] = useState(1);
    const minScale = 0.1;
    const maxScale = 3;

    const handleCaptureFront = useCallback(async () => {
        setSelectedMockupOption(0);
        const uri = await viewShotRefFront.current?.capture();

        // Save URI to device storage
        try {
            const savedUri = `${
                FileSystem.documentDirectory
            }front_image_${Date.now()}.png`;
            await FileSystem.copyAsync({ from: uri, to: savedUri });
            saveOriginalFrontUri(savedUri); // Save URI to redux
            console.log("Image saved to:", savedUri);

            // Convert URI to base64
            const base64img = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const image64 = `data:image/png;base64,${base64img}`;
            saveProductFront(image64); // Save base64 image to Redux
        } catch (error) {
            console.error("Error saving image:", error);
        }
    }, [saveProductFront, saveOriginalFrontUri]);

    const handleCaptureBack = useCallback(async () => {
        setSelectedMockupOption(1);
        const uri = await viewShotRefBack.current?.capture();

        // Save URI to device storage
        try {
            const savedUri = `${
                FileSystem.documentDirectory
            }back_image_${Date.now()}.png`;
            await FileSystem.copyAsync({ from: uri, to: savedUri });
            saveOriginalBackUri(savedUri); // Save URI to redux
            console.log("Image saved to:", savedUri);

            // Convert URI to base64
            const base64img = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const image64 = `data:image/png;base64,${base64img}`;
            saveProductBack(image64); // Save base64 image to Redux
        } catch (error) {
            console.error("Error saving image:", error);
        }
    }, [saveProductBack, saveOriginalBackUri]);

    const onSliderValueChange = useCallback(
        async (value) => {
            setScale(value);
            // if (selectedMockupOption === 0) {
            // 	await handleCaptureFront();
            // } else {
            // 	await handleCaptureBack();
            // }
        },
        [selectedMockupOption, handleCaptureFront, handleCaptureBack]
    );

    const formatColor = (color) => {
        switch (color) {
            case "black":
                return "Đen";
            case "white":
                return "Trắng";
            case "beige":
                return "Be";
            default:
                return "";
        }
    };

    const handleSelectColor = (color) => {
        setSelectedColor(color);
        saveColorOption(color);
    };

    const handleSelectMockup = () => {
        navigation.navigate("MockupScreen");
    };

    const handleSelectMockupOption = useCallback(
        async (index) => {
            if (selectedMockupOption === 0) {
                await handleCaptureFront();
                if (isSelectBack) {
                    Toast.show({
                        type: "success",
                        text1: "Thành công",
                        text2: "Tuỳ chọn mặt trước thành công",
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
            } else {
                await handleCaptureBack();
                Toast.show({
                    type: "success",
                    text1: "Thành công",
                    text2: "Tuỳ chọn mặt sau thành công",
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
            setIsSelectBack(true);
            setSelectedMockupOption(index);
        },
        [selectedMockupOption, handleCaptureFront, handleCaptureBack]
    );

    const handleConfirmModal = () => {
        setShowModal(false);
    };

    const handleConfirm = () => {
        if (selectedColor === null || !isSelectBack) {
            setShowModal(true);
        } else {
            saveProductName("Túi tote");
            saveProductDescription(
                `Túi tote ${formatColor(selectedColor)}, size ${selectedSize}`
            );
            saveSizeOption("None");
            saveColorOption(selectedColor);

            // Capture current mockup view before navigating
            if (selectedMockupOption === 0) {
                handleCaptureFront().then(() => {
                    navigation.navigate("SelectOptionsScreen", {
                        productType: "bag",
                    });
                });
            } else {
                handleCaptureBack().then(() => {
                    navigation.navigate("SelectOptionsScreen", {
                        productType: "bag",
                    });
                });
            }
        }
    };

    const renderMissingOption = () => {
        if (selectedColor === null) {
            return "Bạn chưa chọn Màu sắc cho sản phẩm";
        }
        if (!isSelectBack) {
            return "Vui lòng tuỳ chọn mặt sau của túi";
        }
    };

    const renderColorOptionButton = () => {
        return colorOptions.map((item, index) => (
            <Pressable
                key={index}
                style={[
                    styles.colorOptionButton,
                    { backgroundColor: `${item}` },
                ]}
                onPress={() => handleSelectColor(item)}
            >
                <Ionicons
                    name="ellipse-sharp"
                    color={selectedColor === item ? "#FFC567" : `${item}`}
                    size={10}
                />
            </Pressable>
        ));
    };

    const renderMockupOption = () => {
        const mockupOptions = [
            {
                title: "Trước",
                image: selectedColor
                    ? mockupUri.tote[selectedColor].front
                    : USER_IMAGE_SOURCE,
            },
            {
                title: "Sau",
                image: selectedColor
                    ? mockupUri.tote[selectedColor].back
                    : USER_IMAGE_SOURCE,
            },
        ];

        return mockupOptions.map((item, index) => (
            <Animated.View
                key={index}
                style={[styles.mockupOptionsButtonContainer, animatedStyleItem]}
            >
                <Pressable
                    style={[
                        styles.mockupPressable,
                        selectedMockupOption === index &&
                            styles.selectedMockupOption,
                    ]}
                    onPress={() => handleSelectMockupOption(index)}
                >
                    <Image source={item.image} style={styles.mockupImage} />
                </Pressable>
                <Text style={styles.mockupOptionsButtonText}>{item.title}</Text>
            </Animated.View>
        ));
    };

    const renderMockupFront = () => {
        // Render cho mặt trước
        const mockupImageUri = mockupUri.tote[selectedColor].front;
        return (
            <ViewShot ref={viewShotRefFront}>
                <Image
                    source={mockupImageUri}
                    style={styles.image}
                    resizeMode="stretch"
                />
                {isShowImage && (
                    <Animated.View style={[styles.draggableImageContainer]}>
                        <DraggableAndScalableImage
                            imageUri={imageUri}
                            scale={scale}
                        />
                    </Animated.View>
                )}
            </ViewShot>
        );
    };

    const renderMockupBack = () => {
        // Render cho mặt sau
        const mockupImageUri = mockupUri.tote[selectedColor].back;
        return (
            <ViewShot ref={viewShotRefBack}>
                <Image
                    source={mockupImageUri}
                    style={styles.image}
                    resizeMode="stretch"
                />
                {isShowImage && (
                    <Animated.View style={[styles.draggableImageContainer]}>
                        <DraggableAndScalableImage
                            imageUri={imageUri}
                            scale={scale}
                        />
                    </Animated.View>
                )}
            </ViewShot>
        );
    };

    useFocusEffect(
        useCallback(() => {
            setCurrentPage(2);
        }, [])
    );

    return (
        <>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.progressContainer}>
                        <CreateProgress
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                        <View style={styles.imageContainer}>
                            {selectedMockupOption === 0
                                ? renderMockupFront()
                                : renderMockupBack()}
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={minScale}
                            maximumValue={maxScale}
                            value={scale}
                            onValueChange={onSliderValueChange}
                        />
                        <View style={styles.switch}>
                            <ToggleButton
                                onToggle={() => setIsShowImage(!isShowImage)}
                                isOn={isShowImage}
                            />
                        </View>
                        <View style={styles.itemOptionContainer}>
                            <View style={styles.optionGroup}>
                                <Text style={styles.optionLabel}>Màu sắc</Text>
                                <View style={styles.optionRow}>
                                    {renderColorOptionButton()}
                                </View>
                            </View>
                        </View>
                        <View style={styles.mockupOptionsContainer}>
                            <View style={styles.mockupOptionsButtonContainer}>
                                <TouchableOpacity
                                    style={styles.mockupOptionsButton}
                                    onPress={handleSelectMockup}
                                >
                                    <Ionicons
                                        name="bag-outline"
                                        size={28}
                                        color={colors.text.black_100}
                                    />
                                </TouchableOpacity>
                                <View style={styles.focusedItem}>
                                    <Text
                                        style={[
                                            styles.mockupOptionsButtonText,
                                            styles.focusedItemText,
                                        ]}
                                    >
                                        Túi
                                    </Text>
                                </View>
                            </View>
                            <Animated.View style={animatedStyleItem}>
                                <Ionicons
                                    name="chevron-forward"
                                    color={colors.accent.lightGrey_10}
                                    size={48}
                                />
                            </Animated.View>
                            {renderMockupOption()}
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.pagingText}>3/5</Text>
                    <Pressable
                        onPress={handleConfirm}
                        style={styles.confirmButton}
                    >
                        <Text style={styles.actionsText}>Hoàn tất</Text>
                    </Pressable>
                </View>
            </View>
            <ConfirmModal
                visible={showModal}
                onClose={handleConfirmModal}
                renderMissingOption={renderMissingOption}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    imageUri: state.user.imageUri,
});

const mapDispatchToProps = {
    saveProductName,
    saveProductDescription,
    saveProductPrice,
    saveColorOption,
    saveSizeOption,
    saveOriginalFrontUri,
    saveOriginalBackUri,
    saveProductFront,
    saveProductBack,
};

export default connect(mapStateToProps, mapDispatchToProps)(BagMockupScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    innerContainer: {
        flex: 1,
        padding: "5%",
    },
    progressContainer: {
        flex: 1,
    },
    imageContainer: {
        height: windowHeight * 0.45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        borderColor: colors.background.black_20,
        borderWidth: 1,
        borderRadius: 8,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        aspectRatio: 1,
    },
    labelContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    labelText: {
        color: colors.text.grey_100,
        fontSize: 16,
        lineHeight: 20,
        fontFamily: "helvetica-neue-medium",
        marginTop: "2%",
    },
    itemOptionContainer: {
        flexDirection: "row",
    },
    optionGroup: {
        marginTop: "3%",
    },
    optionLabel: {
        fontSize: 14,
        fontFamily: "helvetica-neue-bold",
    },
    optionRow: {
        flexDirection: "row",
        marginTop: "2%",
    },
    sizeOptionButton: {
        marginRight: "2%",
        paddingVertical: "3%",
        paddingHorizontal: "5%",
        borderColor: colors.background.black_20,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background.white_100,
    },
    sizeOptionButtonText: {
        fontSize: 14,
    },
    colorOptionButton: {
        marginRight: "4%",
        paddingVertical: "4%",
        paddingHorizontal: "6%",
        borderColor: colors.background.black_20,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    colorOptionButtonText: {
        fontSize: 14,
    },
    mockupOptionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "5%",
        gap: 10,
    },
    mockupOptionsButtonContainer: {
        flex: 0.25,
        justifyContent: "center",
    },
    mockupPressable: {
        flex: 1,
        marginBottom: "10%",
    },
    mockupOptionsButton: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: "20%",
        borderColor: colors.background.black_20,
        borderWidth: 1,
        marginBottom: "10%",
        borderRadius: 8,
        backgroundColor: colors.background.white_100,
        shadowColor: colors.background.black_20,
        shadowOffset: {
            width: -3,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    mockupOptionsButtonText: {
        color: colors.text.black_100,
        fontSize: 14,
        textAlign: "center",
        fontFamily: "helvetica-neue-medium",
    },
    mockupImage: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    selectedMockupOption: {
        borderColor: colors.background.black_100,
        borderWidth: 2,
        borderRadius: 8,
    },
    selectedSizeOption: {
        backgroundColor: colors.background.black_20,
    },
    footer: {
        backgroundColor: colors.background.white_100,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6%",
        borderTopColor: colors.background.black_20,
        borderWidth: 1,
    },
    actionsText: {
        color: colors.text.black_100,
        fontSize: 18,
        lineHeight: 30,
        fontFamily: "helvetica-neue-bold",
    },
    confirmButton: {
        position: "absolute",
        right: "10%",
        zIndex: 1,
    },
    pagingText: {
        flex: 1,
        color: colors.text.black_100,
        fontSize: 20,
        lineHeight: 30,
        fontFamily: "helvetica-neue-bold",
        textAlign: "center",
        letterSpacing: 2,
    },
    focusedItem: {
        backgroundColor: colors.background.black_100,
        borderRadius: 5,
        paddingVertical: "4%",
    },
    focusedItemText: {
        color: colors.text.white_100,
    },

    draggableImageContainer: {
        position: "absolute",
    },
    draggableImage: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    slider: {
        position: "absolute",
        width: "80%",
        top: "65%",
        alignSelf: "center",
    },
    switch: {
        position: "absolute",
        top: "15%",
        right: "5%",
    },
});
