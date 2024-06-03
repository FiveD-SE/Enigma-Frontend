import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import React, { useState } from "react";
import { colors } from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigation } from "@react-navigation/native";

const isIOS = Platform.OS === "ios";

const NotificationCard = ({ item, onStatusChange }) => {
	const [localState, setLocalState] = useState(item.state);
	const navigation = useNavigation();

	const convertDate = (date) => {
		const dateObj = date.toDate();

		return `${
			dateObj.getDate()
				? dateObj.getDate() < 10
					? `0${dateObj.getDate()}`
					: dateObj.getDate()
				: "01"
		}/${
			dateObj.getMonth() < 9
				? `0${dateObj.getMonth() + 1}`
				: dateObj.getMonth() + 1
		} ${dateObj.getHours()}:${
			dateObj.getMinutes()
				? dateObj.getMinutes() < 10
					? `0${dateObj.getMinutes()}`
					: dateObj.getMinutes()
				: "00"
		}`;
	};

	const onPress = () => {
		if (item.type === 1) {
			navigation.navigate("TourGuideScreen");
		} else if (item.type === 2) {
			navigation.navigate("OrderNotificationScreen", {
				notificationId: item.id,
			});
		}
		if (!localState) {
			try {
				const notificationRef = doc(db, "notifications", item.id);
				updateDoc(notificationRef, {
					notificationStatus: true,
				});
				setLocalState(true);
				onStatusChange();
			} catch (error) {
				console.error("Error updating notification: ", error);
			}
		}
	};

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.container,
				{
					backgroundColor: localState
						? colors.background.white_100
						: colors.background.lightGrey_10,
				},
			]}
		>
			<View style={styles.textContainer}>
				<View style={styles.titleContainer}>
					<Text style={styles.title} numberOfLines={1}>
						{item.title}
					</Text>
					<Text style={styles.time}>{convertDate(item.time)}</Text>
				</View>
				<Text style={styles.content} numberOfLines={1}>
					{item.content}
				</Text>
			</View>
			{!localState && (
				<Ionicons
					name="ellipse"
					color="#FFC567"
					size={16}
					style={styles.icon}
				/>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		flexDirection: "row",
		borderColor: colors.background.black_20,
		alignItems: "center",
		borderRadius: 10,
		marginVertical: "2%",
		padding: "4%",
	},
	textContainer: {
		flexDirection: "column",
		flex: 1,
		marginRight: "5%",
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
		color: colors.text.black_100,
		marginBottom: isIOS ? "2%" : "1%",
		textAlign: "left",
		flex: 1,
	},
	content: {
		fontSize: 14,
		fontFamily: "helvetica-neue-regular",
		color: colors.text.black_100,
		textAlign: "left",
		marginTop: "2%",
		// marginBottom: isIOS ? "4%" : "2%",
	},
	time: {
		color: colors.text.grey_100,
		fontSize: 12,
		fontFamily: "helvetica-neue-medium",
		textAlign: "right",
		flex: 0.5, // Time chiếm phần nhỏ không gian
	},
	icon: {},
});

export default NotificationCard;
