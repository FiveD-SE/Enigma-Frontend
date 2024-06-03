import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Pressable,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../assets/colors";
import CropOptions from "../../../components/CropOptions";
import ViewShot from "react-native-view-shot";
import { connect } from "react-redux";
import { ImageEditor } from "expo-crop-image";

const windowHeight = Dimensions.get("window").height;

const CropTab = ({ route, viewShotRef, setCurrentImageUri }) => {
    const [selectedTools, setSelectedTools] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [croppedImageUri, setCroppedImageUri] = useState(null);
    const { imageUri } = route?.params;

    const handleCrop = (type) => {
        setSelectedTools(type);
        setShowCropper(true); // Hiển thị component crop khi chọn kiểu crop
    };

    const handleUndo = () => { };

    const handleRedo = () => { };

    // Hàm xử lý khi hoàn tất crop ảnh
    const handleCropComplete = (croppedImage) => {
        setShowCropper(false);
        setCroppedImageUri(croppedImage.uri);
        // Gọi hàm cập nhật ảnh đã crop vào redux hoặc state của bạn
        setCurrentImageUri(croppedImage.uri);
    };

    return (
        <View style={styles.container}>
            <ImageEditor
                isVisible={showCropper}
                fixedAspectRatio={
                    selectedTools === "Square"
                        ? 1
                        : selectedTools === "Portrait"
                            ? 0.75
                            : selectedTools === "Lanscape"
                                ? 1.77
                                : 1.33
                }
                onEditingCancel={() => setShowCropper(false)}
                onEditingComplete={handleCropComplete}
                imageUri={imageUri}
            />
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, padding: "5%" }}>
                    <View
                        style={[
                            styles.imageContainer,
                            { height: windowHeight * 0.55 },
                        ]}
                    >
                        <ViewShot ref={viewShotRef}>
                            <Image
                                source={{ uri: croppedImageUri || imageUri }} // Hiển thị ảnh đã crop hoặc ảnh gốc
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </ViewShot>
                    </View>


                </View>
                <View style={styles.toolsContainer}>
                    <CropOptions
                        iconName="crop-free"
                        label="4:3"
                        selected={selectedTools === "Free"}
                        onPress={() => handleCrop("Free")}
                    />
                    <CropOptions
                        iconName="crop-square"
                        label="Vuông"
                        selected={selectedTools === "Square"}
                        onPress={() => handleCrop("Square")}
                    />
                    <CropOptions
                        iconName="crop-portrait"
                        label="Chân dung"
                        selected={selectedTools === "Portrait"}
                        onPress={() => handleCrop("Portrait")}
                    />
                    <CropOptions
                        iconName="crop-16-9"
                        label="16:9"
                        selected={selectedTools === "Lanscape"}
                        onPress={() => handleCrop("Lanscape")}
                    />
                </View>
            </View>
        </View>
    );
};

export default CropTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        aspectRatio: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background.black_20,
    },
    controlsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "10%",
    },
    navigationButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    navButton: {
        borderColor: colors.background.black_20,
        borderWidth: 1,
        padding: "5%",
        marginRight: "5%",
        borderRadius: 30,
        backgroundColor: colors.background.white_100,
        shadowColor: colors.background.black_100,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toolsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopColor: colors.background.black_20,
        borderTopWidth: 1,
        paddingVertical: "2%",
    },
});
