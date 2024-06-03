import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    FlatList,
    Platform,
    SafeAreaView,
} from "react-native";
import NotificationCard from "../../components/NotificationCard";
import { colors } from "../../assets/colors";
import { connect } from "react-redux";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const isIOS = Platform.OS === "ios";
const isAndroid = Platform.OS === "android";

function NotificationScreen({ userData }) {
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const selectionButtons = ["Tất cả", "Chưa đọc", "Đã đọc"];

    const fetchNotifications = useCallback(() => {
        if (userData?.id) {
            const notificationsQuery = query(
                collection(db, "notifications"),
                where("userId", "==", userData.id),
                orderBy("notificationCreatedDate", "desc")
            );

            const unsubscribe = onSnapshot(
                notificationsQuery,
                (querySnapshot) => {
                    const notificationsData = [];
                    querySnapshot.forEach((doc) => {
                        const notificationDoc = doc.data();
                        notificationsData.push({
                            id: doc.id,
                            title: notificationDoc.notificationTitle,
                            content: notificationDoc.notificationContent,
                            state: notificationDoc.notificationStatus,
                            type: notificationDoc.notificationType,
                            products: notificationDoc.productOrders,
                            time: notificationDoc.notificationCreatedDate,
                        });
                    });
                    setNotifications(notificationsData);
                }
            );
            return () => unsubscribe();
        }
    }, [userData?.id]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const getFilteredNotifications = () => {
        switch (selectedButtonIndex) {
            case 1:
                return notifications.filter(
                    (notification) => !notification.state
                );
            case 2:
                return notifications.filter(
                    (notification) => notification.state
                );
            default:
                return notifications;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.filter}>
                <View style={styles.filterWrapper}>
                    {selectionButtons.map((buttonTitle, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.filterDetail,
                                selectedButtonIndex === index &&
                                    styles.filterDetailSelected,
                            ]}
                            onPress={() => setSelectedButtonIndex(index)}
                        >
                            <Text
                                style={[
                                    styles.filterDetailText,
                                    selectedButtonIndex === index &&
                                        styles.filterDetailTextSelected,
                                ]}
                            >
                                {buttonTitle}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            <View style={styles.listNotification}>
                <Text style={styles.allNotificationText}>Tất cả thông báo</Text>
                <FlatList
                    data={getFilteredNotifications()}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <NotificationCard
                            item={item}
                            onStatusChange={fetchNotifications}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
});

export default connect(mapStateToProps)(NotificationScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    filter: {
        padding: "5%",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: isAndroid ? "10%" : "0%",
    },
    filterWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    filterDetail: {
        flex: 1,
        marginHorizontal: "1%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: isIOS ? "4%" : "2%",
        paddingHorizontal: "6%",
        backgroundColor: colors.background.lightGrey_10,
    },
    filterDetailSelected: {
        backgroundColor: colors.background.black_100,
    },
    filterDetailText: {
        color: colors.text.black_100,
        fontFamily: "helvetica-neue-medium",
        fontSize: 14,
    },
    filterDetailTextSelected: {
        color: colors.text.white_100,
        fontFamily: "helvetica-neue-bold",
        fontSize: 12,
    },
    listNotification: {
        padding: "5%",
        paddingBottom: "35%",
    },
    allNotificationText: {
        color: colors.text.black_100,
        fontFamily: "helvetica-neue-bold",
        fontSize: 16,
    },
});
