import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TrendingTab from "../../screens/Home/Tabs/TrendingTab";
import NewestTab from "../../screens/Home/Tabs/NewestTab";
import { colors } from "../../assets/colors";
import {
	collection,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
	where,
	getDocs,
	arrayUnion,
	arrayRemove,
	increment,
} from "firebase/firestore";
import { connect } from "react-redux";

import { db } from "../../services/firebase";
import { updateProducts, updateUserLikes, updateUsers } from "../../redux/actions/userActions";

const Tab = createMaterialTopTabNavigator();

const HomeTabs = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarLabelStyle: {
					textTransform: "capitalize",
					fontFamily: "helvetica-neue-bold",
				},
				tabBarIndicatorStyle: {
					height: 2,
					borderRadius: 10,
					backgroundColor: colors.background.black_100,
				},
				tabBarStyle: {
					marginTop: "5%",
				},
				tabBarPressColor: "transparent",
				tabBarPressOpacity: 1,
			}}
		>
			<Tab.Screen name="Đang thịnh hành" component={TrendingTab} />
			<Tab.Screen name="Mới nhất" component={NewestTab} />
		</Tab.Navigator>
	);
};
const mapStateToProps = (state) => ({
	userData: state.auth.userData,
	products: state.user.products,
	users: state.user.users,
	likedProducts: state.user.userLikes,
});

const mapDispatchToProps = {
	updateUsers,
	updateUserLikes,
	updateProducts,
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeTabs);
