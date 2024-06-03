import {
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Image,
	Pressable,
} from "react-native";
import React from "react";
import { colors } from "../../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import HomeTabs from "../../routes/TopTabs/HomeTabs";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import {
	updateProducts,
	updateUserLikes,
	updateUsers,
} from "../../redux/actions/userActions";

const HomeScreen = ({ userData, products }) => {
	const navigation = useNavigation();

	const onPressSearch = () => {
		navigation.navigate("SearchScreen");
	};
	const onPressCart = () => {
		navigation.navigate("CartScreen");
	};

	const getCurrentTimeGreeting = () => {
		const currentHour = new Date().getHours();
		if (currentHour >= 5 && currentHour < 12) {
			return "Chào buổi sáng.";
		} else if (currentHour >= 12 && currentHour < 18) {
			return "Chào buổi trưa.";
		} else {
			return "Chào buổi tối.";
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: userData.userImage }}
							style={styles.userImage}
							resizeMode="stretch"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.usernameText} numberOfLines={1}>
							Hi! {userData.name} 👋
						</Text>
						<Text style={styles.welcomeText}>{getCurrentTimeGreeting()}</Text>
					</View>
				</View>
				<View style={styles.headerRight}>
					<Pressable style={styles.iconContainer} onPress={onPressSearch}>
						<Ionicons name="search" size={20} />
					</Pressable>
					<Pressable style={styles.iconContainer} onPress={onPressCart}>
						<Ionicons name="cart-outline" size={20} />
					</Pressable>
				</View>
			</View>
			<View style={styles.main}>
				<HomeTabs product={products} />
			</View>
		</SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.white_100,
	},
	header: {
		flexDirection: "row",
		marginTop: Platform.select({
			android: "10%",
		}),
		paddingHorizontal: "5%",
	},
	headerLeft: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	headerRight: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	imageContainer: {
		width: 48,
		height: 48,
		justifyContent: "center",
		alignItems: "center",
		marginRight: "10%",
	},
	userImage: {
		width: "100%",
		height: "100%",
		borderRadius: 100,
		aspectRatio: 1,
	},
	usernameText: {
		color: colors.text.black_100,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
	},
	welcomeText: {
		color: colors.text.grey_100,
		fontFamily: "helvetica-neue-medium",
		fontSize: 12,
	},
	iconContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		margin: "2%",
		padding: "6%",
		borderWidth: 1,
		borderRadius: 30,
		borderColor: colors.background.black_20,
		backgroundColor: colors.background.white_100,
		shadowOpacity: 0.1,
		shadowColor: colors.background.black_100,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowRadius: 5,
		elevation: 4,
	},
	main: {
		flex: 1,
	},
});
