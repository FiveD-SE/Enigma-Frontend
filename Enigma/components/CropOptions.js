import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { colors } from "../assets/colors";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const CropOptions = ({ iconName, label, selected, onPress }) => {
    return (
        <View style={styles.toolsButtonContainer}>
            <Pressable style={styles.toolsButton} onPress={onPress}>
                {iconName === "flip-horizontal" ||
                iconName === "flip-vertical" ? (
                    <MaterialCommunityIcons
                        name={iconName}
                        size={36}
                        color={
                            selected
                                ? colors.text.black_100
                                : colors.text.black_50
                        }
                    />
                ) : (
                    <MaterialIcons
                        name={iconName}
                        size={36}
                        color={
                            selected
                                ? colors.text.black_100
                                : colors.text.black_50
                        }
                    />
                )}
            </Pressable>
            <View
                style={[
                    styles.toolsTextContainer,
                    selected ? styles.selectedToolsButton : {},
                ]}
            >
                <Text
                    style={[
                        styles.toolsText,
                        selected ? styles.selectedToolsText : {},
                    ]}
                >
                    {label}
                </Text>
            </View>
        </View>
    );
};

export default CropOptions;

const styles = StyleSheet.create({
    toolsButtonContainer: {
        justifyContent: "center",
    },
    toolsButton: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: "8%",
    },
    toolsTextContainer: {},
    toolsText: {
        color: colors.text.black_50,
        fontSize: 14,
        fontFamily: "helvetica-neue-regular",
        textAlign: "center",
    },
    selectedToolsButton: {},
    selectedToolsText: {
        color: colors.text.black_100,
        fontFamily: "helvetica-neue-bold",
    },
});
