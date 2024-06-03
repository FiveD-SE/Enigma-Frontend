import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { colors } from "../../../assets/colors";
import OrderItem from "../../../components/OrderItem";
import { connect } from "react-redux";
import {
    collection,
    onSnapshot,
    query,
    where,
    doc,
    updateDoc,
    orderBy,
} from "firebase/firestore";
import { db } from "../../../services/firebase";

const DeliveredOrdersTab = ({ userData }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = () => {
            if (userData?.id) {
                const ordersQuery = query(
                    collection(db, "orders"),
                    where("userId", "==", userData.id),
                    where("orderState", "==", "2"),
                    orderBy("orderDate", "desc")
                );

                const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
                    const ordersData = [];
                    querySnapshot.forEach((doc) => {
                        const orderDoc = doc.data();
                        ordersData.push({
                            orderId: doc.id,
                            orderDate: orderDoc.orderDate,
                            orderState: orderDoc.orderState,
                            productOrders: orderDoc.productOrders,
                            totalAmount: orderDoc.totalAmount,
                            userId: orderDoc.userId,
                        });
                    });
                    setOrders(ordersData);
                });
                return () => unsubscribe();
            }
        };

        fetchOrders();
    }, [userData?.id]);

    const handleOrderStateUpdate = useCallback(
        async (orderId, newOrderState) => {
            try {
                const orderRef = doc(db, "orders", orderId);
                await updateDoc(orderRef, { orderState: newOrderState });
            } catch (error) {
                console.error("Error updating order state:", error);
            }
        },
        []
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                {orders.map((order, index) => (
                    <OrderItem
                        key={order.orderId}
                        orders={order}
                        onOrderStateChange={handleOrderStateUpdate}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
});

export default connect(mapStateToProps)(DeliveredOrdersTab);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
});
