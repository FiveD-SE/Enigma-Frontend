import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { colors } from "../assets/colors";

const CropTabBar = ({ state, descriptors, navigation }) => {
	return (
		<View style={styles.container}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				return (
					<Pressable key={label} onPress={onPress} style={styles.button}>
						<Text
							style={[
								styles.buttonText,
								{
									color: isFocused
										? colors.text.black_100
										: colors.text.grey_100,
									fontFamily: isFocused
										? "helvetica-neue-bold"
										: "helvetica-neue-regular",
								},
							]}
						>
							{label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
};

export default CropTabBar;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: colors.background.white_100,
		borderTopColor: colors.background.black_20,
		borderTopWidth: 1,
	},
	button: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: "5%",
	},
	buttonText: {
		fontSize: 14,
	},
});
