import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

export default ({ value, name, minimum, maximum, step = 1, onChange }) => (
	<View style={styles.container}>
		<Text style={styles.text}>{name}</Text>
		<Slider
			style={styles.slider}
			value={value}
			minimumValue={minimum}
			maximumValue={maximum}
			step={step}
			onValueChange={onChange}
		/>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		paddingHorizontal: "2%",
		marginTop: "10%",
	},
	text: { textAlign: "center" },
	slider: { width: windowWidth * 0.9, alignSelf: "center" },
});
