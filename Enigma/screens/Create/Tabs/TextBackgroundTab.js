import React, { useCallback, useEffect, useState } from "react";
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
import ViewShot from "react-native-view-shot";
import { connect } from "react-redux";
import TextFontButton from "../../../components/TextFontButton";
import { ScrollView } from "react-native-gesture-handler";
const windowHeight = Dimensions.get("window").height;

const TextBackgroundTab = ({ route, viewShotRef, setCurrentImageUri }) => {
    const [selectedFont, setSelectedFont] = useState(null);

    const { imageUri } = route?.params;

    const handleTextFont = (type) => {
        setSelectedFont(type);
    };

    const handleUndo = () => { };

    const handleRedo = () => { };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, padding: "5%" }}>
                    <View
                        style={[styles.imageContainer, { height: windowHeight * 0.55 }]}
                    >
                        <ViewShot ref={viewShotRef}>
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </ViewShot>
                    </View>
                </View>
                <View style={styles.scrollContainer}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        <TextFontButton
                            label="Aa"
                            selected={selectedFont === "Default"}
                            onPress={() => handleTextFont("Default")}
                        />
                        <TextFontButton
                            label="Aa"
                            selected={selectedFont === "1"}
                            onPress={() => handleTextFont("1")}
                        />
                        <TextFontButton
                            label="Aa"
                            selected={selectedFont === "2"}
                            onPress={() => handleTextFont("2")}
                        />
                        <TextFontButton
                            label="Aa"
                            selected={selectedFont === "3"}
                            onPress={() => handleTextFont("3")}
                        />
                        <TextFontButton
                            label="Aa"
                            selected={selectedFont === "4"}
                            onPress={() => handleTextFont("4")}
                        />
                        <TextFontButton
                            label="Aa"
                            selected={selectedFont === "5"}
                            onPress={() => handleTextFont("5")}
                        />
                        <TextFontButton
                            label="Aa"
                            selected={selectedFont === "6"}
                            onPress={() => handleTextFont("6")}
                        />
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

export default TextBackgroundTab;

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
    scrollContainer: {
        marginBottom: "8%",
    }
});
