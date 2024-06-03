import React, { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "../../assets/colors";
import AllOrdersTab from "../../screens/Other/Tabs/AllOrdersTab";
import PendingOrdersTab from "../../screens/Other/Tabs/PendingOrdersTab";
import DeliveredOrdersTab from "../../screens/Other/Tabs/DeliveredOrdersTab";
import SuccessOrdersTab from "../../screens/Other/Tabs/SuccessOrdersTab";
import { connect } from "react-redux";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
const Tab = createMaterialTopTabNavigator();

const OrderTabs = ({ initialRouteName, userData }) => {
	const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (userData?.id) {
                const ordersQuery = query(
                    collection(db, "orders"),
                    where("userId", "==", userData.id)
                );
    
                const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
                    let totalCount = 0;
                    let pendingCount = 0;
                    let deliveredCount = 0;
                    let successCount = 0;
    
                    querySnapshot.forEach((doc) => {
                        const orderDoc = doc.data();
                        totalCount++;
    
                        switch (orderDoc.orderState) {
                            case "1":
                                pendingCount++;
                                break;
                            case "2":
                                deliveredCount++;
                                break;
                            case "3":
                                successCount++;
                                break;
                        }
                    });
    
                    setOrders({
                        total: totalCount,
                        pending: pendingCount,
                        delivered: deliveredCount,
                        success: successCount,
                    });
                });
    
                return () => unsubscribe();
            }
        };
    
        fetchOrders();
    }, [userData?.id]);

    const { total, pending, delivered, success } = orders;

	return (
		<Tab.Navigator
			initialRouteName={initialRouteName}
			screenOptions={{
				lazy: true,
				tabBarScrollEnabled: true,
				tabBarLabelStyle: {
					flex: 1,
					fontSize: 12,
					textTransform: "capitalize",
					fontFamily: "helvetica-neue-bold",
				},
				tabBarIndicatorStyle: {
					height: 2,
					borderRadius: 10,   
					backgroundColor: colors.background.black_100,
				},
				tabBarStyle: {
					backgroundColor: colors.background.white_100,
				},

				tabBarItemStyle: {},
				tabBarPressColor: "transparent",
				tabBarPressOpacity: 1,
			}}
		>
			<Tab.Screen name="Tất cả" component={AllOrdersTab} />
			<Tab.Screen name="Chờ xác nhận" component={PendingOrdersTab} />
			<Tab.Screen name="Đang giao hàng" component={DeliveredOrdersTab} />
			<Tab.Screen name="Hoàn thành" component={SuccessOrdersTab} />
		</Tab.Navigator>
	);
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
});

export default connect(mapStateToProps)(OrderTabs);
