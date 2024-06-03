import { Switch, StyleSheet } from "react-native";
import { colors } from "../assets/colors";

const ToggleButton = ({ isOn, onToggle }) => {
	return (
		<Switch
			trackColor={{
				false: colors.accent.lightGrey_100,
				true: colors.background.black_100,
			}}
			thumbColor={
				isOn ? colors.background.white_100 : colors.background.darkGrey
			}
			ios_backgroundColor={colors.accent.lightGrey_100}
			onValueChange={onToggle}
			value={isOn}
		/>
	);
};

export default ToggleButton;
