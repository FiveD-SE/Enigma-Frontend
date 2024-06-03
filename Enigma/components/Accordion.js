import {
	StyleSheet,
	Text,
	View,
	Pressable,
	LayoutAnimation,
} from "react-native";
import React, { useState, useRef } from "react";
import Chevron from "./Chevron";
import { colors } from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";

const Accordion = ({ value, children, enableEdit, onPressEdit }) => {
	const [open, setOpen] = useState(false);
	const contentHeight = useRef(null);

	const toggleAccordion = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setOpen(!open);
	};

	return (
		<View style={[styles.container]}>
			<Pressable
				style={[styles.titleContainer, open && styles.openTitleContainer]}
				onPress={toggleAccordion}
			>
				<Chevron open={open} />
				<Text style={[styles.textTitle, open && styles.openTextTitle]}>
					{value}
				</Text>
				{enableEdit && open && (
					<Pressable onPress={onPressEdit}>
						<Ionicons
							name="pencil"
							size={24}
							style={open && styles.openTextTitle}
						/>
					</Pressable>
				)}
			</Pressable>
			{open && (
				<View
					style={styles.contentContainer}
					ref={(ref) => (contentHeight.current = ref ? ref.clientHeight : null)}
				>
					{children}
				</View>
			)}
		</View>
	);
};

export default Accordion;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.background.white_100,
		marginVertical: "2%",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.background.black_20,
		overflow: "hidden",
	},
	textTitle: {
		flex: 1,
		fontSize: 16,
		fontFamily: "helvetica-neue-bold",
		color: colors.text.black_100,
		marginLeft: "5%",
	},
	titleContainer: {
		padding: "5%",
		flexDirection: "row",
		alignItems: "center",
	},
	contentContainer: {
		width: "100%",
		overflow: "hidden",
	},
	openTitleContainer: {
		backgroundColor: colors.background.black_100,
	},
	openTextTitle: {
		color: colors.text.white_100,
	},
});
