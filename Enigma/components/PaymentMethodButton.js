import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../assets/colors";

const PaymentMethodButton = ({ title, imageSource, isChecked, onPress }) => {
    return (
        <View style={[styles.container, isChecked && styles.checkedContainer]}>
            <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
                <View style={styles.imageContainer}>
                    <Image source={imageSource} style={styles.image} />
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable onPress={onPress}>
                <MaterialIcons
                    name={
                        isChecked
                            ? "radio-button-checked"
                            : "radio-button-unchecked"
                    }
                    size={24}
                    color={[styles.icon, isChecked && styles.checkedIcon]}
                />
            </Pressable>
        </View>
    );
};

export default PaymentMethodButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: colors.background.black_20,
        borderRadius: 10,
        padding: "4%",
        alignItems: "center",
        marginVertical: "1%",
    },
    imageContainer: {
        width: 24,
        height: 24,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    title: {
        color: colors.text.black_100,
        fontSize: 14,
        fontFamily: "helvetica-neue-bold",
        marginLeft: "5%",
    },
    checkbox: {
        borderColor: colors.text.black_100,
        borderRadius: 100,
    },
    checkedContainer: {
        backgroundColor: colors.background.lightGrey_10,
    },
    icon: {
        color: colors.background.black_20,
    },
    checkedIcon: {
        color: colors.background.black_100,
    },
});
