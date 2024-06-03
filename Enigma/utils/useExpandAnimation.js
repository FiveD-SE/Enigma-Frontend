import { useEffect } from "react";
import {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
} from "react-native-reanimated";

export const useExpandAnimation = () => {
	const translateXItem = useSharedValue(-100);

	const opacityItem = useSharedValue(0);

	useEffect(() => {
		translateXItem.value = withTiming(0, {
			duration: 1000,
			easing: Easing.out(Easing.exp),
		});
		opacityItem.value = withTiming(1, {
			duration: 1000,
			easing: Easing.out(Easing.exp),
		});
	}, []);

	const animatedStyleItem = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateXItem.value }],
			opacity: opacityItem.value,
		};
	});

	return { animatedStyleItem };
};
