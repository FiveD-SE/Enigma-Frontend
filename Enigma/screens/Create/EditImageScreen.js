import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import CreateProgress from "../../components/CreateProgress";
import ToolButton from "../../components/ToolButton";
import { colors } from "../../assets/colors";
import { removeBackground } from "../../services/photoroomApi";
import { connect } from "react-redux";
import {
    saveEditImage,
    updateCurrentEditImage,
    updateImageUri,
} from "../../redux/actions/userActions";

const windowHeight = Dimensions.get("window").height;

const EditImageScreen = ({
    imageUri,
    updateImageUri,
    editImage,
    saveEditImage,
    currentEditImage,
    updateCurrentEditImage,
}) => {
    // console.log("EditImage", editImage);
    const navigation = useNavigation();
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedTools, setSelectedTools] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectedRemoveBackground = async (photoUri, tools) => {
        handleSelectedTools(tools);
        setIsLoading(true);

        try {
            const imageUrl = await removeBackground(photoUri);
            updateImageUri(imageUrl);
            saveEditImage([
                ...editImage.slice(0, currentEditImage + 1),
                imageUri,
            ]);
            updateCurrentEditImage(currentEditImage + 1);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectedCrop = (tools) => {
        handleSelectedTools(tools);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigation.navigate("CropScreen");
        }, 200);
    };

    // const handleSelectedAdjust = (tools) => {
    //     handleSelectedTools(tools);
    //     setIsLoading(true);
    //     setTimeout(() => {
    //         setIsLoading(false);
    //         navigation.navigate("AdjustScreen");
    //     }, 200);
    // };
    // const handleSelectedText = (tools) => {
    //     handleSelectedTools(tools);
    //     setIsLoading(true);
    //     setTimeout(() => {
    //         setIsLoading(false);
    //         navigation.navigate("TextScreen");
    //     }, 200);
    // };

    const handleSelectedTools = (tool) => {
        setSelectedTools(tool);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleForward = () => {
        navigation.navigate("MockupScreen");
    };

    const handleUndo = () => {
        if (currentEditImage > 0) {
            updateImageUri(editImage[currentEditImage - 1]);
            updateCurrentEditImage(currentEditImage - 1);
        }
    };

    const handleRedo = () => {
        if (currentEditImage < editImage.length - 1) {
            updateImageUri(editImage[currentEditImage + 1]);
            updateCurrentEditImage(currentEditImage + 1);
        }
    };

    const renderImage = () => {
        return (
            <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
            />
        );
    };

    useFocusEffect(
        useCallback(() => {
            setCurrentPage(1);
            setSelectedTools(null);
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            renderImage();
        }, [imageUri])
    );

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={{ padding: "5%" }}>
                    <CreateProgress
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <View
                        style={[
                            styles.imageContainer,
                            {
                                height: windowHeight * 0.45,
                                borderWidth: imageUri !== null ? 0 : 1,
                            },
                        ]}
                    >
                        {renderImage()}
                    </View>

                    <View style={styles.controlsContainer}>
                        <View style={styles.navigationButtons}>
                            <Pressable
                                style={[styles.navButton]}
                                onPress={handleUndo}
                            >
                                <Ionicons
                                    name="return-up-back"
                                    size={24}
                                    color={colors.text.black_100}
                                />
                            </Pressable>
                            <Pressable
                                style={[styles.navButton]}
                                onPress={handleRedo}
                            >
                                <Ionicons
                                    name="return-up-forward"
                                    size={24}
                                    color={colors.text.black_100}
                                />
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.toolsContainer}>
                        <ToolButton
                            iconName="image-remove"
                            label="Tách nền"
                            selected={selectedTools === "RemoveBackground"}
                            onPress={() =>
                                handleSelectedRemoveBackground(
                                    imageUri,
                                    "RemoveBackground"
                                )
                            }
                        />
                        <ToolButton
                            iconName="crop"
                            label="Cắt"
                            selected={selectedTools === "Crop"}
                            onPress={() => handleSelectedCrop("Crop")}
                        />
                        {/* <ToolButton
                            iconName="color-filter-outline"
                            label="Điều chỉnh"
                            selected={selectedTools === "Adjust"}
                            onPress={() => handleSelectedAdjust("Adjust")}
                        />
                        <ToolButton
                            iconName="text"
                            label="Văn bản"
                            selected={selectedTools === "Text"}
                            onPress={() => handleSelectedText("Text")}
                        /> */}
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.actionsText}>Trở lại</Text>
                </Pressable>
                <Text style={styles.pagingText}>2/5</Text>
                <Pressable onPress={handleForward} style={styles.forwardButton}>
                    <Text style={styles.actionsText}>Tiếp tục</Text>
                </Pressable>
            </View>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator
                        size="large"
                        color={colors.text.black_100}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        borderColor: colors.background.black_20,
        borderRadius: 8,
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
        marginTop: "5%",
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
    repeatButton: {
        borderColor: colors.background.black_20,
        borderWidth: 1,
        padding: "2%",
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
        marginTop: "10%",
        gap: 10,
    },
    footer: {
        flexDirection: "row",
        padding: "6%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.background.white_100,
        borderTopColor: colors.background.black_20,
        borderWidth: 1,
    },
    actionsText: {
        color: colors.text.black_100,
        fontSize: 18,
        lineHeight: 30,
        fontFamily: "helvetica-neue-bold",
    },
    backButton: {
        position: "absolute",
        left: "10%",
        zIndex: 2,
    },
    forwardButton: {
        position: "absolute",
        right: "10%",
        zIndex: 2,
    },
    pagingText: {
        flex: 1,
        color: colors.text.black_100,
        fontFamily: "helvetica-neue-bold",
        fontSize: 20,
        lineHeight: 30,
        textAlign: "center",
        letterSpacing: 2,
    },
});

const mapStateToProps = (state) => ({
    imageUri: state.user.imageUri,
    editImage: state.user.editImage,
    currentEditImage: state.user.currentEditImage,
});

const mapDispatchToProps = {
    updateImageUri,
    saveEditImage,
    updateCurrentEditImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditImageScreen);
