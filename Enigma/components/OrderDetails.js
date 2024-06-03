import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { colors } from "../assets/colors";

const USER_IMAGE_SOURCE = require("../assets/images/user.png");

const OrderDetails = ({ name, price, quantity, image }) => (
    <View style={styles.orderItem}>
        <View style={styles.orderItemImageContainer}>
            <Image source={{ uri: image }} style={styles.orderItemImage} />
        </View>
        <View style={styles.orderItemContentContainer}>
            <Text style={styles.productName}>{name}</Text>
            <Text style={styles.productPrice}>{price}</Text>
            <View style={styles.productQuantityContainer}>
                <Text style={styles.productQuantityLabel}>Số lượng:</Text>
                <Text style={styles.productQuantityValue}>{quantity}</Text>
            </View>
        </View>
    </View>
);

export default OrderDetails;

const styles = StyleSheet.create({
    orderItem: {
        flexDirection: "row",
        marginVertical: "2%",
    },
    orderItemImageContainer: {
        width: 64,
        height: 64,
    },
    orderItemImage: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    orderItemContentContainer: {
        marginLeft: "5%",
        flexDirection: "column",
    },
    productName: {
        flex: 1,
        color: colors.text.black_100,
        fontSize: 14,
        fontFamily: "helvetica-neue-bold",
    },
    productPrice: {
        flex: 1,
        color: colors.text.black_50,
        fontSize: 14,
        fontFamily: "helvetica-neue-medium",
    },
    productQuantityContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    productQuantityLabel: {
        color: colors.text.grey_100,
        fontSize: 12,
        fontFamily: "helvetica-neue-regular",
        marginRight: "5%",
    },
    productQuantityValue: {
        color: colors.text.grey_100,
        fontSize: 12,
        fontFamily: "helvetica-neue-regular",
    },
});
