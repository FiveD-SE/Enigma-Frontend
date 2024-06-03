import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../assets/colors";

const PolicyItem = ({ policy }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.content}>{`\u2022  ${policy}`}</Text>
        </View>
    );
};

export default PolicyItem;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "helvetica-neue-regular",
        color: colors.text.grey_100,
        textAlign: "justify",
    },
});
